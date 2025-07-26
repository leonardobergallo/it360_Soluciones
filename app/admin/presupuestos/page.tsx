'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-hot-toast';

interface Presupuesto {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  servicio: string;
  mensaje?: string;
  estado: string;
  createdAt: string;
}

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Verificar rol del usuario
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');

    // Si es técnico, redirigir a presupuestos (ya estamos aquí)
    // Si es admin, puede acceder a todas las páginas
    if (user.role === 'USER') {
      router.push('/');
      return;
    }

    fetchPresupuestos();
  }, [router]);

  const fetchPresupuestos = async () => {
    try {
      const response = await fetch('/api/presupuestos');
      if (response.ok) {
        const data = await response.json();
        setPresupuestos(data);
      } else {
        toast.error('Error al cargar presupuestos');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar presupuestos');
    } finally {
      setLoading(false);
    }
  };

  const updateEstado = async (id: string, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/presupuestos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        toast.success('Estado actualizado correctamente');
        fetchPresupuestos(); // Recargar la lista
      } else {
        toast.error('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Presupuestos
          </h1>
          <div className="text-sm text-gray-600">
            Total: {presupuestos.length} presupuestos
          </div>
        </div>

        {presupuestos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No hay presupuestos registrados
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {presupuestos.map((presupuesto) => (
                    <tr key={presupuesto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {presupuesto.nombre}
                          </div>
                          {presupuesto.empresa && (
                            <div className="text-sm text-gray-500">
                              {presupuesto.empresa}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {presupuesto.email}
                          </div>
                          {presupuesto.telefono && (
                            <div className="text-sm text-gray-500">
                              {presupuesto.telefono}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {presupuesto.servicio}
                        </div>
                        {presupuesto.mensaje && (
                          <div className="text-sm text-gray-500 mt-1">
                            {presupuesto.mensaje.length > 50
                              ? `${presupuesto.mensaje.substring(0, 50)}...`
                              : presupuesto.mensaje}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                            presupuesto.estado
                          )}`}
                        >
                          {presupuesto.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(presupuesto.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={presupuesto.estado}
                          onChange={(e) => updateEstado(presupuesto.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en proceso">En Proceso</option>
                          <option value="completado">Completado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 
