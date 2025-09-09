"use client";
import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Sale {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
    price: number;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
  amount: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  metodoPago?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      try {
        setLoading(true);
        const res = await fetch('/api/admin/sales');
        if (!res.ok) throw new Error('Error al obtener ventas');
        const data = await res.json();
        setSales(data);
      } catch (err) {
        setError('Error al cargar las ventas');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  const handleUpdateSaleStatus = async (saleId: string, status: 'approved' | 'cancelled', adminNotes?: string) => {
    try {
      const res = await fetch('/api/admin/sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleId, status, adminNotes }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar venta');
      }
      
      // Refrescar lista
      const salesRes = await fetch('/api/admin/sales');
      setSales(await salesRes.json());
      
      // Mostrar mensaje de éxito
      const statusText = status === 'approved' ? 'aprobada' : 'cancelada';
      alert(`Venta ${statusText} exitosamente`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar venta');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
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

        {/* Lista de ventas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Gestión de Ventas</h2>
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando ventas...</p>
              </div>
            ) : sales.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🛒</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas</h3>
                <p className="text-gray-600">No se encontraron ventas en el sistema.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(sale.status)}`}>
                            {getStatusText(sale.status)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
                            <p className="text-sm text-gray-600">
                              <strong>Usuario:</strong> {sale.user?.name || 'N/A'}<br/>
                              <strong>Email:</strong> {sale.user?.email || sale.email || 'N/A'}<br/>
                              <strong>Teléfono:</strong> {sale.telefono || 'N/A'}<br/>
                              <strong>Dirección:</strong> {sale.direccion || 'N/A'}
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Producto/Servicio</h3>
                            <p className="text-sm text-gray-600">
                              <strong>Item:</strong> {sale.product?.name || sale.service?.name || 'N/A'}<br/>
                              <strong>Precio:</strong> ${sale.product?.price || sale.service?.price || sale.amount}<br/>
                              <strong>Total:</strong> ${sale.amount.toLocaleString('es-AR')}<br/>
                              <strong>Método de pago:</strong> {sale.metodoPago || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {sale.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateSaleStatus(sale.id, 'approved')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                            >
                              ✅ Aprobar
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Motivo de cancelación (opcional):');
                                handleUpdateSaleStatus(sale.id, 'cancelled', reason || undefined);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                            >
                              ❌ Cancelar
                            </button>
                          </>
                        )}
                        {sale.status === 'approved' && (
                          <div className="text-sm text-blue-600 font-medium">
                            ✅ Aprobado
                          </div>
                        )}
                        {sale.status === 'cancelled' && (
                          <div className="text-sm text-red-600 font-medium">
                            ❌ Cancelado
                          </div>
                        )}
                        {sale.status === 'completed' && (
                          <div className="text-sm text-green-600 font-medium">
                            🎉 Completado
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
