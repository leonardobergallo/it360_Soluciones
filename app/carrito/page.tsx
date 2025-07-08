"use client";
import { useEffect, useState } from "react";
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

  // Cargar carrito desde la API
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items || []);
        } else {
          setError("No se pudo cargar el carrito. ¿Estás logueado?");
        }
      } catch {
        setError("Error de red al cargar el carrito");
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

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
  };

  // Eliminar ítem
  const removeItem = async (productId: string) => {
    const token = localStorage.getItem('authToken');
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

  // Checkout (flujo real de ventas con datos completos y método de pago)
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    let userId = null;
    try {
      userId = userStr ? JSON.parse(userStr).id : null;
    } catch {
      setError("No se pudo obtener el usuario. Vuelve a iniciar sesión.");
      return;
    }
    if (!userId) {
      setError("No se pudo obtener el usuario. Vuelve a iniciar sesión.");
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
          return;
        }
        window.location.href = data.url;
        return;
      }
      // Si es reembolso, registrar la venta como antes
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
      setCartItems([]);
      setCheckout(false);
      alert("¡Compra registrada como reembolso!");
    } catch (err: any) {
      setError(err.message || "Error al realizar la compra");
    }
  };

  // Filtrar cotizaciones válidas
  const cotizacionesValidas = cotizaciones.filter(c => c.nombre && c.email && c.servicio);

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Carrito</h1>
      {loading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold py-8">{error}</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-12">Tu carrito está vacío.</div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item: any, idx: number) => (
              <li key={idx} className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    {item.type === 'product' && item.product?.image && (
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-contain rounded" />
                    )}
                    {item.type === 'service' && item.imagen && (
                      <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-contain rounded" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">
                          {item.type === 'product' ? item.product.name : item.nombre}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'product' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {item.type === 'product' ? 'Producto' : 'Servicio a cotizar'}
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {item.type === 'product' ? item.product.description : item.descripcion}
                      </div>
                    </div>
                  </div>
                </div>
                {item.type === 'product' ? (
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div className="text-blue-700 font-bold text-lg">${item.product.price.toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-xs text-red-600 hover:underline">Eliminar</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <span className="text-yellow-700 font-semibold text-sm">Cotización</span>
                    <button onClick={() => removeItem(item.nombre)} className="text-xs text-red-600 hover:underline">Eliminar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Mejoro la sección de contacto/cotización */}
      <section className="max-w-lg mx-auto bg-gradient-to-br from-yellow-100 to-blue-50 rounded-2xl shadow-lg p-10 border border-blue-100 mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">Solicitar Cotización</h2>
        <p className="text-center text-gray-700 mb-6">¿Tienes servicios en el carrito? Completa tus datos y te enviaremos una cotización personalizada.</p>
        <form onSubmit={handleCheckout} className="flex flex-col gap-4">
          <input name="nombre" type="text" placeholder="Nombre" className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          <input name="email" type="email" placeholder="Email" className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input name="telefono" type="tel" placeholder="Teléfono" className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" required value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
          <input name="direccion" type="text" placeholder="Dirección" className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" required value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
          <div className="flex flex-col gap-2">
            <label className="text-blue-700 font-medium">Método de pago</label>
            <select name="metodoPago" className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" value={form.metodoPago} onChange={e => setForm({ ...form, metodoPago: e.target.value })}>
              <option value="reembolso">Cotización (solo servicios)</option>
              <option value="mercadopago">Mercado Pago (solo productos)</option>
            </select>
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60 text-lg mt-2">Solicitar cotización / Pagar productos</button>
          {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2 font-semibold text-center mt-2">{error}</div>}
        </form>
      </section>
      {/* Sección de cotizaciones */}
      {cotizacionesValidas.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Solicitudes de cotización</h2>
          <ul className="space-y-4">
            {cotizacionesValidas.map((c, i) => (
              <li key={i} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-yellow-900">{c.servicio}</div>
                  <div className="text-sm text-gray-700">{c.nombre} &lt;{c.email}&gt; {c.empresa && `- ${c.empresa}`}</div>
                  <div className="text-sm text-gray-500">{c.telefono}</div>
                  <div className="text-gray-600 mt-1">{c.mensaje}</div>
                </div>
                <button
                  onClick={() => removeCotizacion(i)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-xs font-semibold mt-2 md:mt-0"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cotizaciones.length > 0 && cotizacionesValidas.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-yellow-900 font-semibold">
          Hay cotizaciones incompletas en tu carrito. Por favor, elimínalas y vuelve a enviar tu solicitud desde el formulario de contacto.
        </div>
      )}
    </div>
  );
} 