"use client";
import { useEffect, useState } from "react";
import AdminLayout from '@/components/AdminLayout';
import TecnicoLayout from '@/components/TecnicoLayout';

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
  updatedAt: string;
}

export default function PresupuestosAdminPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('ADMIN');
  const [toast, setToast] = useState<string | null>(null);

  // Detectar el rol del usuario
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || 'ADMIN');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Mostrar toast si hay mensaje de acceso denegado
  useEffect(() => {
    const msg = localStorage.getItem('toastMsg');
    if (msg) {
      setToast(msg);
      localStorage.removeItem('toastMsg');
      setTimeout(() => setToast(null), 3500);
    }
  }, []);

  useEffect(() => {
    async function fetchPresupuestos() {
      try {
        console.log('🔄 Cargando presupuestos...');
        const res = await fetch('/api/presupuestos');
        const data = await res.json();
        
        console.log('📊 Respuesta del API:', data);
        
        // Verificar si la respuesta es un array
        if (!Array.isArray(data)) {
          console.error('❌ La respuesta no es un array:', data);
          setError(`Error: La respuesta del servidor no es válida. ${data.error || ''}`);
          return;
        }
        
        setPresupuestos(data);
        console.log(`✅ ${data.length} presupuestos cargados`);
      } catch (err) {
        console.error('❌ Error al cargar presupuestos:', err);
        setError(`Error al cargar presupuestos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
    fetchPresupuestos();
  }, []);

  // Determinar qué layout usar basado en el rol
  const Layout = userRole === 'TECNICO' ? TecnicoLayout : AdminLayout;

  return (
    <Layout>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {toast}
        </div>
      )}
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Solicitudes de Presupuesto</h1>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Cargando presupuestos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error al cargar presupuestos</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : presupuestos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay solicitudes de presupuesto aún.</p>
            <p className="text-sm text-gray-400 mt-1">Las solicitudes aparecerán aquí cuando los usuarios envíen el formulario de contacto.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Teléfono</th>
                  <th className="px-4 py-2 border">Empresa</th>
                  <th className="px-4 py-2 border">Servicio</th>
                  <th className="px-4 py-2 border">Mensaje</th>
                  <th className="px-4 py-2 border">Estado</th>
                  <th className="px-4 py-2 border">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {presupuestos.map(p => (
                  <tr key={p.id} className="border-b hover:bg-blue-50">
                    <td className="px-4 py-2 border">{p.nombre}</td>
                    <td className="px-4 py-2 border">{p.email}</td>
                    <td className="px-4 py-2 border">{p.telefono || '-'}</td>
                    <td className="px-4 py-2 border">{p.empresa || '-'}</td>
                    <td className="px-4 py-2 border">{p.servicio}</td>
                    <td className="px-4 py-2 border">{p.mensaje || '-'}</td>
                    <td className="px-4 py-2 border font-semibold capitalize">{p.estado}</td>
                    <td className="px-4 py-2 border">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
} 