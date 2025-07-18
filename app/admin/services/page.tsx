"use client";

import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState<string | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);

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
    async function fetchServices() {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    }
    fetchServices();
  }, []);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setServices([
      ...services,
      { id: services.length + 1, name: form.name, description: form.description, price: Number(form.price) },
    ]);
    setForm({ name: '', description: '', price: '' });
    setShowForm(false);
    setError(null);
  };

  const handleEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !editService) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setServices(services.map(s => s.id === editService.id ? { ...s, ...form, price: Number(form.price) } : s));
    setEditService(null);
    setForm({ name: '', description: '', price: '' });
    setShowForm(false);
    setError(null);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  const openEditForm = (service: Service) => {
    setEditService(service);
    setForm({ name: service.name, description: service.description, price: String(service.price) });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header con título y botones */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Servicios</h1>
            <p className="text-gray-600">Administrá los servicios disponibles en el sistema</p>
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
            <button
              onClick={() => { setShowForm(true); setEditService(null); setForm({ name: '', description: '', price: '' }); }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-sm hover:bg-purple-700 transition-all duration-300"
            >
              Nuevo Servicio
            </button>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <form onSubmit={editService ? handleEditService : handleAddService} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Nombre del servicio"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Descripción del servicio"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editService ? 'Actualizar Servicio' : 'Crear Servicio'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditService(null); setForm({ name: '', description: '', price: '' }); }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de servicios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Servicios</h2>
            </div>
          </div>
          
          <div className="p-6">
            <Table
              columns={[
                { key: 'name', label: 'NOMBRE' },
                { key: 'description', label: 'DESCRIPCIÓN' },
                { key: 'price', label: 'PRECIO' },
              ]}
              data={services}
              actions={(row) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(row)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteService(row.id)}
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