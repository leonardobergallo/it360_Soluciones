"use client";
import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Gestión de Ventas</h1>
        <a href="/admin" className="px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-blue-800 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12l6-6M3 12l6 6" />
          </svg>
          Ir al dashboard
        </a>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ventas</h1>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Table
        columns={[
          { key: 'user', label: 'Usuario' },
          { key: 'product', label: 'Producto' },
          { key: 'service', label: 'Servicio' },
          { key: 'amount', label: 'Monto' },
        ]}
        data={sales}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteSale(row.id)}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            >
              Eliminar
            </button>
          </div>
        )}
      />
    </AdminLayout>
  );
} 