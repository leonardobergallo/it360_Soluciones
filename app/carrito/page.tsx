"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";


interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    metodoPago: "reembolso"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Cargar carrito (backend para logueados, localStorage para no logueados)
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Usuario logueado: cargar desde API
          const res = await fetch("/api/cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setCartItems(data.items || []);
          } else {
            if (data.error === 'Token expirado') {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
              setTimeout(() => {
                router.push('/login?message=Sesion expirada. Inicia sesión de nuevo.');
              }, 1500);
              return;
            }
            setError(data.error || "No se pudo cargar el carrito");
          }
        } else {
          // Usuario no logueado: cargar desde localStorage
          const stored = localStorage.getItem('carrito');
          if (stored) {
            try {
              const cart = JSON.parse(stored);
              const products = cart.filter((item: { type?: string }) => item.type !== 'cotizacion');
              setCartItems(products.map((item: any) => ({
                id: item.productId,
                product: {
                  id: item.productId,
                  name: item.name,
                  price: item.price,
                  description: '',
                  image: ''
                },
                quantity: item.quantity || 1
              })));
            } catch {
              setCartItems([]);
            }
          } else {
            setCartItems([]);
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

  // Calcular total
  useEffect(() => {
    setTotal(cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0));
  }, [cartItems]);

  // Manejar parámetros de URL para feedback de pago
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');
    
    if (status === 'success' && paymentId) {
      alert(`¡Pago exitoso! ID de pago: ${paymentId}`);
      setCartItems([]);
      setCheckout(false);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'failure') {
      setError('El pago fue rechazado. Intenta nuevamente.');
      setCheckout(false);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'pending') {
      alert('El pago está pendiente de confirmación.');
      setCheckout(false);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Cargar cotizaciones desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem('carrito');
    let cotizacionesLS = [];
    if (stored) {
      try {
        cotizacionesLS = JSON.parse(stored).filter((item: any) => item.type === 'cotizacion');
      } catch {}
    }
    setCotizaciones(cotizacionesLS);
  }, []);

  // Modificar cantidad
  const updateQty = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Usuario logueado: usar API
      await fetch("/api/cart", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      // Refrescar carrito
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } else {
      // Usuario no logueado: usar localStorage
      const stored = localStorage.getItem('carrito');
      if (stored) {
        try {
          const cart = JSON.parse(stored);
          const itemIndex = cart.findIndex((item: { productId: string; type?: string }) => 
            item.productId === productId && item.type !== 'cotizacion'
          );
          if (itemIndex >= 0) {
            cart[itemIndex].quantity = quantity;
            localStorage.setItem('carrito', JSON.stringify(cart));
            // Actualizar estado local
            setCartItems(cart.filter((item: { type?: string }) => item.type !== 'cotizacion').map((item: any) => ({
              id: item.productId,
              product: {
                id: item.productId,
                name: item.name,
                price: item.price,
                description: '',
                image: ''
              },
              quantity: item.quantity || 1
            })));
          }
        } catch {
          // Error al actualizar localStorage
        }
      }
    }
  };

  // Eliminar ítem
  const removeItem = async (productId: string) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Usuario logueado: usar API
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      // Refrescar carrito
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } else {
      // Usuario no logueado: usar localStorage
      const stored = localStorage.getItem('carrito');
      if (stored) {
        try {
          const cart = JSON.parse(stored);
          const cotizaciones = cart.filter((item: { type?: string }) => item.type === 'cotizacion');
          const productos = cart.filter((item: { productId: string; type?: string }) => 
            item.productId !== productId && item.type !== 'cotizacion'
          );
          const newCart = [...productos, ...cotizaciones];
          localStorage.setItem('carrito', JSON.stringify(newCart));
          // Actualizar estado local
          setCartItems(productos.map((item: any) => ({
            id: item.productId,
            product: {
              id: item.productId,
              name: item.name,
              price: item.price,
              description: '',
              image: ''
            },
            quantity: item.quantity || 1
          })));
        } catch {
          // Error al actualizar localStorage
        }
      }
    }
  };

  // Eliminar cotización del localStorage
  const removeCotizacion = (index: number) => {
    const stored = localStorage.getItem('carrito');
    if (!stored) return;
    let cart = JSON.parse(stored);
    const cotizacionesLS = cart.filter((item: any) => item.type === 'cotizacion');
    const productosLS = cart.filter((item: any) => item.type !== 'cotizacion');
    cotizacionesLS.splice(index, 1);
    const newCart = [...productosLS, ...cotizacionesLS];
    localStorage.setItem('carrito', JSON.stringify(newCart));
    setCotizaciones(cotizacionesLS);
  };

  // Vaciar carrito
  const clearCart = async () => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Usuario logueado: vaciar en backend
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: "all" })
      });
    }
    
    // Limpiar localStorage (mantener solo cotizaciones)
    const stored = localStorage.getItem('carrito');
    if (stored) {
      try {
        const cart = JSON.parse(stored);
        const cotizaciones = cart.filter((item: { type?: string }) => item.type === 'cotizacion');
        if (cotizaciones.length > 0) {
          localStorage.setItem('carrito', JSON.stringify(cotizaciones));
        } else {
          localStorage.removeItem('carrito');
        }
      } catch {
        localStorage.removeItem('carrito');
      }
    }
    
    setCartItems([]);
  };

  // Checkout (flujo real de ventas con datos completos y método de pago)
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
    
    // Verificar que hay productos para comprar
    if (cartItems.length === 0) {
      setError("No hay productos en el carrito para comprar");
      setProcessing(false);
      return;
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
      
      // Si es reembolso o transferencia, registrar la venta
      if (token && userId) {
        // Usuario logueado: registrar en backend
        for (const item of cartItems) {
          const res = await fetch("/api/sales", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              userId,
              productId: item.product.id,
              amount: item.product.price * item.quantity,
              nombre: form.nombre,
              email: form.email,
              telefono: form.telefono,
              direccion: form.direccion,
              metodoPago: form.metodoPago
            })
          });
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Error al registrar la venta");
          }
        }
      } else {
        // Usuario no logueado: solo mostrar mensaje de éxito
        // En un caso real, aquí se enviaría un email con los detalles
      }
      
      setCartItems([]);
      setCheckout(false);
      setSuccess("¡Compra realizada con éxito! Te contactaremos pronto.");
      
      // Limpiar localStorage (mantener cotizaciones)
      const stored = localStorage.getItem('carrito');
      if (stored) {
        try {
          const cart = JSON.parse(stored);
          const cotizaciones = cart.filter((item: { type?: string }) => item.type === 'cotizacion');
          if (cotizaciones.length > 0) {
            localStorage.setItem('carrito', JSON.stringify(cotizaciones));
          } else {
            localStorage.removeItem('carrito');
          }
        } catch {
          localStorage.removeItem('carrito');
        }
      }
      
      if (formRef.current) formRef.current.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al realizar la compra");
    } finally {
      setProcessing(false);
    }
  };

  // Nuevo handler para el botón principal
  const handleMainCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (productos.length > 0) {
      // Si hay productos, ir a /checkout
      router.push("/checkout");
    } else {
      // Solo servicios: enviar cotización como antes
      handleCheckout(e);
    }
  };

  // Filtrar cotizaciones válidas
  const cotizacionesValidas = cotizaciones.filter(c => c.nombre && c.email && c.servicio);

  // Separar productos y servicios
  const productos = cartItems.filter((item: any) => item.product); // Si tiene .product es un producto real
  const servicios = cartItems.filter((item: any) => !item.product); // Si NO tiene .product, es un servicio/cotización
  const totalProductos = productos.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo futurista con animaciones */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto py-16 px-4 min-h-screen pb-24">
        {/* Header futurista mejorado */}
        <div className="text-center mb-12">
          <div className="inline-block mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 backdrop-blur-xl rounded-2xl border border-cyan-400/50 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h2l.4 2M7 6h14l-1.68 8.39a2 2 0 01-2 1.61H7.42a2 2 0 01-2-1.61L3 4H21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-purple-500 transition-all duration-500">
                  Carrito de Compras
                </h1>
                <p className="text-white/80 text-lg font-medium">
                  {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} seleccionado${cartItems.length > 1 ? 's' : ''}` : 'Tu carrito está vacío'}
                </p>
              </div>
            </div>
          </div>
          <p className="text-white/70 max-w-3xl mx-auto text-xl leading-relaxed">
            Revisa tus productos y servicios seleccionados. Completa tu compra de forma segura.
          </p>
        </div>

        {/* Mensajes de estado */}
        {success && (
          <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 rounded-2xl px-6 py-4 mb-8 text-center font-semibold text-lg animate-fadeIn flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {success}
          </div>
        )}
        {error && (
          <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-6 py-4 mb-8 text-center font-semibold text-lg animate-fadeIn flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white/70 mt-4">Cargando tu carrito...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h3>
              <p className="text-white/70">Agrega algunos productos para comenzar</p>
            </div>
          </div>
        ) : (
          <>
          {/* Sección de productos mejorada */}
          {productos.length > 0 && (
            <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all duration-500">
                  🛍️ Productos en tu carrito
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
              </div>
              <ul className="divide-y divide-white/20">
                {productos.map((item: any, idx: number) => (
                  <li key={idx} className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        {item.product?.image && (
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur-sm opacity-50"></div>
                            <img src={item.product.image} alt={item.product.name} className="relative w-16 h-16 object-contain rounded-xl" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-xl text-white group-hover:text-cyan-400 transition-colors duration-300">
                              {item.product.name}
                            </span>
                            <span className="backdrop-blur-md bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs px-3 py-1 rounded-full font-medium">
                              Producto
                            </span>
                          </div>
                          <div className="text-white/70 text-sm">{item.product.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ${item.product.price.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQty(item.product.id, item.quantity - 1)} 
                          className="w-8 h-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white hover:text-cyan-400"
                        >
                          -
                        </button>
                        <span className="text-white font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.product.id, item.quantity + 1)} 
                          className="w-8 h-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white hover:text-cyan-400"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)} 
                        className="text-xs text-red-400 hover:text-red-300 hover:underline transition-colors duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Total: ${totalProductos.toLocaleString()}
                </div>
                <button 
                  onClick={clearCart} 
                  className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 px-6 py-3 rounded-2xl hover:bg-red-500/30 transition-all duration-300 text-sm font-semibold"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          )}

          {/* Sección de servicios a cotizar */}
          {servicios.length > 0 && (
            <div className="backdrop-blur-md bg-yellow-500/10 border border-yellow-400/30 rounded-3xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Servicios a cotizar
                </h2>
              </div>
              <ul className="space-y-3">
                {servicios.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between text-sm py-2 items-center text-white/90">
                    <span>{item.nombre || 'Servicio a cotizar'}</span>
                    <button 
                      onClick={() => removeItem(item.nombre)} 
                      className="text-xs text-red-400 hover:text-red-300 hover:underline transition-colors duration-300"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resumen de compra solo si hay productos */}
          {productos.length > 0 && (
            <div className="backdrop-blur-md bg-cyan-500/10 border border-cyan-400/30 rounded-3xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Resumen de compra
                </h2>
              </div>
              <ul className="space-y-3 mb-6">
                {productos.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between text-sm py-2 text-white/90">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span className="font-semibold">${(item.product.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold text-3xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
                Total: ${totalProductos.toLocaleString()}
              </div>
              <button
                className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-5 px-8 rounded-2xl font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-105 text-xl flex items-center justify-center gap-4 group border border-cyan-400/30 hover:border-cyan-300/50"
                onClick={handleMainCheckout}
              >
                <div className="w-3 h-3 bg-white rounded-full group-hover:animate-pulse"></div>
                <span>🚀 Finalizar compra</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <div className="text-center text-base text-white/70 mt-6 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Podrás elegir MercadoPago o Transferencia bancaria en el siguiente paso.
              </div>
            </div>
          )}
          </>
        )}

        {/* Sección de contacto/cotización */}
        {productos.length === 0 && (
          <section className="max-w-lg mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 mt-12 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                Solicitar Cotización
              </h2>
              <p className="text-white/70">¿Tienes servicios en el carrito? Completa tus datos y te enviaremos una cotización personalizada.</p>
            </div>
            <form onSubmit={handleMainCheckout} ref={formRef} className="flex flex-col gap-4">
              <input 
                name="nombre" 
                type="text" 
                placeholder="Nombre" 
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-white placeholder-white/50 transition-all duration-300" 
                required 
                value={form.nombre} 
                onChange={e => setForm({ ...form, nombre: e.target.value })} 
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-white placeholder-white/50 transition-all duration-300" 
                required 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
              />
              <input 
                name="telefono" 
                type="tel" 
                placeholder="Teléfono" 
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-white placeholder-white/50 transition-all duration-300" 
                required 
                value={form.telefono} 
                onChange={e => setForm({ ...form, telefono: e.target.value })} 
              />
              <input 
                name="direccion" 
                type="text" 
                placeholder="Dirección" 
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-white placeholder-white/50 transition-all duration-300" 
                required 
                value={form.direccion} 
                onChange={e => setForm({ ...form, direccion: e.target.value })} 
              />
              <div className="flex flex-col gap-2">
                <label className="text-cyan-300 font-medium">Método de pago</label>
                <select 
                  name="metodoPago" 
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-white transition-all duration-300" 
                  value={form.metodoPago} 
                  onChange={e => setForm({ ...form, metodoPago: e.target.value })}
                >
                  <option value="reembolso" className="bg-slate-800">Cotización (solo servicios)</option>
                  <option value="mercadopago" className="bg-slate-800">Mercado Pago (solo productos)</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 text-lg mt-4 flex items-center justify-center gap-3 group" 
                disabled={processing}
              >
                <div className="w-2 h-2 bg-white rounded-full group-hover:animate-pulse"></div>
                {processing ? 'Procesando...' : 'Solicitar cotización / Pagar productos'}
              </button>
              {error && (
                <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-4 py-3 font-semibold text-center mt-4 flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}
            </form>
          </section>
        )}

        {/* Sección de cotizaciones */}
        {cotizacionesValidas.length > 0 && (
          <div className="backdrop-blur-md bg-yellow-500/10 border border-yellow-400/30 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Solicitudes de cotización
              </h2>
            </div>
            <ul className="space-y-4">
              {cotizacionesValidas.map((c, i) => (
                <li key={i} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 group">
                  <div>
                    <div className="font-semibold text-yellow-300 text-lg">{c.servicio}</div>
                    <div className="text-sm text-white/70">{c.nombre} &lt;{c.email}&gt; {c.empresa && `- ${c.empresa}`}</div>
                    <div className="text-sm text-white/60">{c.telefono}</div>
                    <div className="text-white/80 mt-2">{c.mensaje}</div>
                  </div>
                  <button
                    onClick={() => removeCotizacion(i)}
                    className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-2xl hover:bg-red-500/30 transition-all duration-300 text-sm font-semibold"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cotizaciones.length > 0 && cotizacionesValidas.length === 0 && (
          <div className="backdrop-blur-md bg-yellow-500/10 border border-yellow-400/30 rounded-3xl p-6 mb-8 text-yellow-300 font-semibold flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            Hay cotizaciones incompletas en tu carrito. Por favor, elimínalas y vuelve a enviar tu solicitud desde el formulario de contacto.
          </div>
        )}

        
      </div>
    </div>
  );
} 
