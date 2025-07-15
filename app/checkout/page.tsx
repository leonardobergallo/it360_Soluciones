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
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    metodoPago: "mercadopago"
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
              const productos = (cart as ProductItem[]).filter((item: ProductItem) => (item as ProductItem).product);
              setCartItems(productos);
              setTotal(productos.reduce((acc: number, item: ProductItem) => acc + item.product.price * item.quantity, 0));
              if (productos.length === 0) router.push("/carrito");
            } catch {
              setCartItems([]);
              router.push("/carrito");
            }
          } else {
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

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Finalizar compra
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProcessing(true);
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    let userId = null;
    if (token && userStr) {
      try {
        userId = JSON.parse(userStr).id;
      } catch {
        setError("No se pudo obtener el usuario. Vuelve a iniciar sesión.");
        setProcessing(false);
        return;
      }
    }
    try {
      if (form.metodoPago === 'mercadopago') {
        // Llamar a /api/mercadopago y redirigir
        const res = await fetch('/api/mercadopago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            nombre: form.nombre,
            email: form.email,
            telefono: form.telefono,
            direccion: form.direccion,
            userId: userId
          })
        });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setError(data.error || 'Error al iniciar pago con Mercado Pago');
          setProcessing(false);
          return;
        }
        window.location.href = data.url;
        return;
      }
      // Si es transferencia, mostrar datos y mensaje de éxito
      if (form.metodoPago === 'transferencia') {
        setSuccess("Por favor, realiza la transferencia al alias: GENIA.GRAMO.PERSA y envía el comprobante por WhatsApp. ¡Gracias por tu compra!");
        setProcessing(false);
        // Aquí podrías registrar la venta en el backend si lo deseas
        return;
      }
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

          {/* Mensajes de estado */}
          {error && (
            <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-6 py-4 mb-6 text-center font-semibold flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}
          {success && (
            <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 rounded-2xl px-6 py-4 mb-6 text-center font-semibold flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {success}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-white/70 mt-4">Cargando tu carrito...</p>
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
                  <select 
                    name="metodoPago" 
                    className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white" 
                    value={form.metodoPago} 
                    onChange={handleChange}
                  >
                    <option value="mercadopago" className="bg-slate-800">MercadoPago</option>
                    <option value="transferencia" className="bg-slate-800">Transferencia bancaria</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={processing} 
                  className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-5 px-6 rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group mt-6" 
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full group-hover:animate-pulse"></div>
                      Finalizar compra
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 