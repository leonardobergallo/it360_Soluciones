"use client";

import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import Alert from '@/components/Alert';
import { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState<string | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);
  const [alert, setAlert] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Error al cargar servicios');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      setAlert({ message: 'Error al cargar servicios', type: 'error' });
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price)
        }),
      });
      
      if (!res.ok) throw new Error('Error al crear servicio');
      
      setAlert({ message: 'Servicio creado con éxito', type: 'success' });
      setForm({ name: '', description: '', price: '' });
      setShowForm(false);
      setError(null);
      fetchServices();
    } catch (error) {
      setAlert({ message: 'Error al crear servicio', type: 'error' });
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !editService) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editService.id,
          name: form.name,
          description: form.description,
          price: parseFloat(form.price)
        }),
      });
      
      if (!res.ok) throw new Error('Error al actualizar servicio');
      
      setAlert({ message: 'Servicio actualizado con éxito', type: 'success' });
      setEditService(null);
      setForm({ name: '', description: '', price: '' });
      setShowForm(false);
      setError(null);
      fetchServices();
    } catch (error) {
      setAlert({ message: 'Error al actualizar servicio', type: 'error' });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este servicio?')) {
      try {
        const res = await fetch('/api/services', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        
        if (!res.ok) throw new Error('Error al eliminar servicio');
        
        setAlert({ message: 'Servicio eliminado con éxito', type: 'success' });
        fetchServices();
      } catch (error) {
        setAlert({ message: 'Error al eliminar servicio', type: 'error' });
      }
    }
  };

  const openEditForm = (service: Service) => {
    setEditService(service);
    setForm({ 
      name: service.name, 
      description: service.description, 
      price: String(service.price) 
    });
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
          onClick={() => { 
            setShowForm(true); 
            setEditService(null); 
            setForm({ name: '', description: '', price: '' }); 
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Nuevo Servicio
        </button>
      </div>
      
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
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
              step="0.01"
              name="price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
            >
              {editService ? 'Actualizar Servicio' : 'Crear Servicio'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditService(null);
                setForm({ name: '', description: '', price: '' });
                setError(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
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