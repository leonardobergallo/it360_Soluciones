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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">Resumen de compra</h1>
        <p className="text-center text-blue-700 mb-6">Completa tus datos para finalizar la compra de tus productos.</p>
        {error && <div className="bg-red-100 border border-red-300 text-red-800 rounded px-4 py-3 mb-4 text-center font-semibold">{error}</div>}
        {success && <div className="bg-green-100 border border-green-300 text-green-800 rounded px-4 py-3 mb-4 text-center font-semibold">{success}</div>}
        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : (
          <>
            <ul className="mb-4 divide-y divide-gray-200">
              {cartItems.map((item, idx) => (
                <li key={idx} className="flex justify-between py-2 text-sm">
                  <span>{item.product ? item.product.name : ''} x{item.quantity}</span>
                  <span>${item.product ? (item.product.price * item.quantity).toLocaleString() : ''}</span>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-blue-800 text-xl mb-6">Total: ${total.toLocaleString()}</div>
            <form onSubmit={handleCheckout} className="space-y-4">
              <input name="nombre" type="text" placeholder="Nombre" className="border border-blue-200 rounded px-4 py-2 w-full" required value={form.nombre} onChange={handleChange} />
              <input name="email" type="email" placeholder="Email" className="border border-blue-200 rounded px-4 py-2 w-full" required value={form.email} onChange={handleChange} />
              <input name="telefono" type="tel" placeholder="Teléfono" className="border border-blue-200 rounded px-4 py-2 w-full" required value={form.telefono} onChange={handleChange} />
              <input name="direccion" type="text" placeholder="Dirección" className="border border-blue-200 rounded px-4 py-2 w-full" required value={form.direccion} onChange={handleChange} />
              <div>
                <label className="block text-blue-700 font-medium mb-1">Método de pago</label>
                <select name="metodoPago" className="border border-blue-200 rounded px-4 py-2 w-full" value={form.metodoPago} onChange={handleChange}>
                  <option value="mercadopago">MercadoPago</option>
                  <option value="transferencia">Transferencia bancaria</option>
                </select>
              </div>
              <button type="submit" disabled={processing} className="w-full bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition-all duration-300 mt-2 disabled:opacity-50">
                {processing ? 'Procesando...' : 'Finalizar compra'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 