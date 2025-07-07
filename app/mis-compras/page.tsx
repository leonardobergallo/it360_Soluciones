"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Compra {
  id: string;
  amount: number;
  createdAt: string;
  product: {
    name: string;
    price: number;
  } | null;
}

export default function MisComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      router.push("/login");
      return;
    }
    const userId = JSON.parse(userStr).id;
    async function fetchCompras() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/sales`);
        if (!res.ok) throw new Error("No se pudieron cargar las compras");
        const data = await res.json();
        // Filtrar solo las compras del usuario actual
        setCompras(data.filter((c: any) => c.userId === userId && c.product));
      } catch {
        setError("No se pudieron cargar las compras");
      } finally {
        setLoading(false);
      }
    }
    fetchCompras();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-blue-800">Mis compras</h1>
        {loading ? (
          <div className="text-blue-700">Cargando compras...</div>
        ) : error ? (
          <div className="text-red-600 font-bold">{error}</div>
        ) : compras.length === 0 ? (
          <div className="text-gray-600">No has realizado compras aún.</div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Producto</th>
                  <th className="py-2 px-4">Monto</th>
                </tr>
              </thead>
              <tbody>
                {compras.map(c => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-2 px-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{c.product?.name}</td>
                    <td className="py-2 px-4 font-semibold text-blue-700">${c.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-8 text-center">
          <a href="/catalogo" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-all">Ir al catálogo</a>
        </div>
      </div>
    </div>
  );
} 