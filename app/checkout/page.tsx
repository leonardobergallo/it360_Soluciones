"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definir tipos para los productos y el formulario
interface ProductItem {
  product: {
    name: string;
    price: number;
    // Puedes agregar más campos si es necesario
  };
  quantity: number;
}

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  metodoPago: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<ProductItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    metodoPago: "transferencia"
  });
  const router = useRouter();

  // Cargar productos del carrito
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const res = await fetch("/api/cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            const productos = (data.items || []).filter((item: ProductItem) => item.product);
            setCartItems(productos);
            setTotal(productos.reduce((acc: number, item: ProductItem) => acc + item.product.price * item.quantity, 0));
            if (productos.length === 0) router.push("/carrito");
          } else {
            setError(data.error || "No se pudo cargar el carrito");
          }
        } else {
          // No logueado: localStorage
          const stored = localStorage.getItem('carrito');
          if (stored) {
            try {
              const cart = JSON.parse(stored);
              console.log('🛒 Carrito desde localStorage:', cart);
              
              // Manejar diferentes estructuras del carrito
              let productos = [];
              if (Array.isArray(cart)) {
                productos = cart.filter((item: any) => {
                  // Si tiene .product, usar esa estructura
                  if (item.product) {
                    return true;
                  }
                  // Si tiene .productId, .name, .price, convertir a estructura esperada
                  if (item.productId && item.name && item.price) {
                    return true;
                  }
                  return false;
                }).map((item: any) => {
                  // Si ya tiene la estructura correcta, usarla
                  if (item.product) {
                    return item;
                  }
                  // Si no, convertir a la estructura esperada
                  return {
                    product: {
                      name: item.name,
                      price: item.price,
                      id: item.productId
                    },
                    quantity: item.quantity || 1
                  };
                });
              }
              
              console.log('📦 Productos procesados:', productos);
              setCartItems(productos);
              setTotal(productos.reduce((acc: number, item: ProductItem) => acc + item.product.price * item.quantity, 0));
              
              if (productos.length === 0) {
                console.log('❌ No hay productos, redirigiendo al carrito');
                router.push("/carrito");
              }
            } catch (error) {
              console.error('❌ Error procesando carrito:', error);
              setCartItems([]);
              router.push("/carrito");
            }
          } else {
            console.log('❌ No hay carrito en localStorage');
            setCartItems([]);
            router.push("/carrito");
          }
        }
      } catch {
        setError("Error al cargar el carrito");
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [router]);

  // Cargar configuración de métodos de pago
  useEffect(() => {
    async function fetchPaymentConfig() {
      try {
        const res = await fetch('/api/checkout');
        const data = await res.json();
        if (res.ok) {
          setPaymentConfig(data);
        }
      } catch (error) {
        console.error('Error al cargar configuración de pagos:', error);
      }
    }
    fetchPaymentConfig();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Finalizar compra
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem('authToken');
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

      // Crear ticket de solicitud de compra
      const ticketData = {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        empresa: '',
        tipo: 'compra',
        categoria: 'venta',
        asunto: `Solicitud de compra - ${cartItems.length} producto${cartItems.length > 1 ? 's' : ''}`,
        descripcion: `
Solicitud de compra desde el carrito:

Productos solicitados:
${cartItems.map(item => `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toLocaleString()}`).join('\n')}

Total: $${total.toLocaleString()}

Datos del cliente:
• Nombre: ${form.nombre}
• Email: ${form.email}
• Teléfono: ${form.telefono}
• Dirección: ${form.direccion}
• Método de pago: ${form.metodoPago}

Estado: Pendiente de verificación de stock y habilitación de pago
        `,
        urgencia: 'normal',
        prioridad: 'alta'
      };

      // Enviar solicitud como ticket
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la solicitud');
      }

      // Mostrar mensaje de éxito simplificado
      setSuccess(`
✅ ¡Solicitud enviada con éxito!

📋 Tu solicitud está siendo procesada.

📞 Nos comunicaremos contigo para:
• Verificar stock disponible
• Confirmar precio final
• Habilitar el pago

⏰ Tiempo estimado: 2-4 horas hábiles
      `);

      // Limpiar carrito después de enviar la solicitud
      if (token) {
        try {
          await fetch('/api/cart', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ clearAll: true })
          });
        } catch (error) {
          console.error('Error al limpiar carrito:', error);
        }
      } else {
        localStorage.removeItem('carrito');
      }

      setProcessing(false);
      return;

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al realizar la compra");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo futurista con animaciones */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex justify-center items-center py-16 px-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50"></div>
              <h1 className="relative text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Resumen de compra
              </h1>
            </div>
            <p className="text-white/70 text-lg">Completa tus datos para finalizar la compra de tus productos.</p>
          </div>

          {/* Aviso importante sobre verificación de stock */}
          <div className="backdrop-blur-md bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">⚠️ Verificación de stock</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  <strong>Importante:</strong> Verificaremos el stock disponible y nos comunicaremos contigo antes de proceder con el pago.
                </p>
              </div>
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-6 py-4 mb-6 text-center font-semibold flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}


          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-white/70 mt-4">Cargando tu carrito...</p>
            </div>
          ) : success ? (
            // Mostrar solo el mensaje de éxito cuando se haya enviado la solicitud
            <div className="text-center py-8">
              <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-2xl p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-green-300">¡Solicitud Enviada!</h2>
                </div>
                <div className="text-sm whitespace-pre-line text-center text-white/90 mb-6">
                  {success}
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href="https://wa.me/5493425089906" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>📱</span>
                    Contactar por WhatsApp
                  </a>
                  <a 
                    href="mailto:leonardobergallo@gmail.com" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>📧</span>
                    Enviar Email
                  </a>
                </div>
                <div className="mt-6">
                  <a 
                    href="/catalogo" 
                    className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
                  >
                    ← Volver al catálogo
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Resumen de productos */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Productos en tu carrito
                  </h2>
                </div>
                <ul className="space-y-3 mb-4">
                  {cartItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between py-2 text-white/90">
                      <span className="font-medium">{item.product ? item.product.name : ''} x{item.quantity}</span>
                      <span className="font-semibold">${item.product ? (item.product.price * item.quantity).toLocaleString() : ''}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-right font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent pt-4 border-t border-white/20">
                  Total: ${total.toLocaleString()}
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Nombre completo *
                    </label>
                    <input 
                      name="nombre" 
                      type="text" 
                      placeholder="Tu nombre completo" 
                      className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50" 
                      required 
                      value={form.nombre} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Email *
                    </label>
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="tu@email.com" 
                      className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50" 
                      required 
                      value={form.email} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Teléfono *
                    </label>
                    <input 
                      name="telefono" 
                      type="tel" 
                      placeholder="+54 9 11 1234-5678" 
                      className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50" 
                      required 
                      value={form.telefono} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Dirección *
                    </label>
                    <input 
                      name="direccion" 
                      type="text" 
                      placeholder="Tu dirección completa" 
                      className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50" 
                      required 
                      value={form.direccion} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cyan-300 mb-3">
                    Método de pago *
                  </label>
                  <div className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏦</span>
                      <div>
                        <p className="font-semibold">Transferencia bancaria</p>
                        <p className="text-white/70 text-sm">Te enviaremos los datos bancarios después de verificar stock</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={processing} 
                  className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-5 px-6 rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group mt-6 border border-cyan-400/30 hover:border-cyan-300/50" 
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando solicitud...
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-white rounded-full group-hover:animate-pulse"></div>
                      <span>📋 Enviar solicitud de compra</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
                
                <div className="text-center text-sm text-white/60 mt-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  Recuerda: Verificaremos stock antes de procesar el pago
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
