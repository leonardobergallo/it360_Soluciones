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
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/sales`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.error === 'Token expirado') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            setTimeout(() => {
              router.push('/login?message=Sesion expirada. Inicia sesión de nuevo.');
            }, 1500);
            return;
          }
          throw new Error(data.error || "No se pudieron cargar las compras");
        }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a href="/mi-cuenta" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Volver a Mi cuenta
          </a>
          <h1 className="text-3xl font-bold">Mis compras</h1>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-white/80">Cargando tus compras...</p>
          </div>
        ) : error ? (
          <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-300 font-semibold">{error}</p>
          </div>
        ) : compras.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">No tienes compras aún</h3>
            <p className="text-white/70 mb-8">Explora nuestro catálogo y encuentra productos increíbles</p>
            <a 
              href="/catalogo" 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-semibold"
            >
              Ir al catálogo
            </a>
          </div>
        ) : (
          <>
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-xl">📦</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Total de compras</p>
                    <p className="text-2xl font-bold">{compras.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 text-xl">💰</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Total gastado</p>
                    <p className="text-2xl font-bold">
                      ${compras.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Última compra</p>
                    <p className="text-lg font-semibold">
                      {new Date(Math.max(...compras.map(c => new Date(c.createdAt).getTime()))).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de compras */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-6">Historial de compras</h3>
              
              <div className="space-y-4">
                {compras.map((compra, index) => (
                  <div key={compra.id} className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-cyan-400 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{compra.product?.name || 'Producto'}</h4>
                          <p className="text-sm text-white/60">
                            Comprado el {new Date(compra.createdAt).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">${compra.amount.toLocaleString()}</p>
                        <p className="text-sm text-white/60">ID: {compra.id.slice(-8)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
} 
