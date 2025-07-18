"use client";
import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Sale {
  id: number;
  user: string;
  product?: string;
  service?: string;
  amount: number;
}

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Protección para técnicos
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'TECNICO') {
          localStorage.setItem('toastMsg', 'Acceso denegado: solo puedes ver presupuestos.');
          router.push('/admin/presupuestos');
        }
      } catch {}
    }
  }, [router]);

  useEffect(() => {
    async function fetchSales() {
      const res = await fetch('/api/sales');
      const data = await res.json();
      setSales(data.map((s: any) => ({
        ...s,
        user: s.user?.name || '-',
        product: s.product?.name || '-',
        service: s.service?.name || '-',
      })));
    }
    fetchSales();
  }, []);

  const handleDeleteSale = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      try {
        const res = await fetch('/api/sales', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Error al eliminar venta');
        // Refrescar lista
        const salesRes = await fetch('/api/sales');
        setSales(await salesRes.json());
      } catch {
        setError('Error al eliminar venta');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header con título y botones */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Ventas</h1>
            <p className="text-gray-600">Administrá el historial de ventas del sistema</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ← Ir al dashboard
            </Link>
          </div>
        </div>

        {/* Tabla de ventas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Ventas</h2>
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            <Table
              columns={[
                { key: 'user', label: 'USUARIO' },
                { key: 'product', label: 'PRODUCTO' },
                { key: 'service', label: 'SERVICIO' },
                { key: 'amount', label: 'MONTO' },
              ]}
              data={sales}
              actions={(row) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteSale(row.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 