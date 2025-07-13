"use client";

import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import { useState } from 'react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

const mockServices: Service[] = [
  { id: 1, name: 'Desarrollo Web', description: 'Sitios web a medida', price: 1000 },
  { id: 2, name: 'Soporte Técnico', description: 'Soporte remoto y presencial', price: 500 },
];

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState<string | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Gestión de Servicios</h1>
        <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12l6-6M3 12l6 6" />
          </svg>
          Ir al inicio
        </a>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Servicios</h1>
        <button
          onClick={() => { setShowForm(true); setEditService(null); setForm({ name: '', description: '', price: '' }); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Nuevo Servicio
        </button>
      </div>
      {showForm && (
        <form onSubmit={editService ? handleEditService : handleAddService} className="mb-8 space-y-4 max-w-md">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
          >
            {editService ? 'Actualizar Servicio' : 'Crear Servicio'}
          </button>
        </form>
      )}
      <Table
        columns={[
          { key: 'name', label: 'Nombre' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ]}
        data={services}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => openEditForm(row)}
              className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteService(row.id)}
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