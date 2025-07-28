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
  active?: boolean;
  order?: number;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', active: true });
  const [error, setError] = useState<string | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

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
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          console.log('Servicios cargados:', data);
          setServices(data);
        } else {
          console.error('Error cargando servicios:', res.status);
          setError('Error al cargar servicios');
        }
      } catch (error) {
        console.error('Error en fetchServices:', error);
        setError('Error de conexión');
      }
    }
    fetchServices();
  }, []);

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
          price: Number(form.price)
        })
      });
      
      if (res.ok) {
        const newService = await res.json();
        setServices([...services, newService]);
        setForm({ name: '', description: '', price: '' });
        setShowForm(false);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Error al crear servicio');
      }
    } catch (error) {
      console.error('Error al crear servicio:', error);
      setError('Error de conexión');
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !editService) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    try {
      const res = await fetch(`/api/services/${editService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price)
        })
      });
      
      if (res.ok) {
        const updatedService = await res.json();
        setServices(services.map(s => s.id === editService.id ? updatedService : s));
        setEditService(null);
        setForm({ name: '', description: '', price: '' });
        setShowForm(false);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Error al actualizar servicio');
      }
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      setError('Error de conexión');
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Error al eliminar servicio');
      }
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      setError('Error de conexión');
    }
  };

  const openEditForm = (service: Service) => {
    setEditService(service);
    setForm({ 
      name: service.name, 
      description: service.description, 
      price: String(service.price),
      active: service.active ?? true
    });
    setShowForm(true);
  };

  // Función para cambiar visibilidad del servicio
  const toggleServiceVisibility = async (serviceId: number, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      });
      
      if (res.ok) {
        setServices(services.map(s => 
          s.id === serviceId ? { ...s, active: !currentActive } : s
        ));
      }
    } catch (error) {
      console.error('Error al cambiar visibilidad:', error);
    }
  };

  // Función para reordenar servicios
  const moveService = (fromIndex: number, toIndex: number) => {
    const newServices = [...services];
    const [movedService] = newServices.splice(fromIndex, 1);
    newServices.splice(toIndex, 0, movedService);
    
    // Actualizar orden
    const updatedServices = newServices.map((service, index) => ({
      ...service,
      order: index + 1
    }));
    
    setServices(updatedServices);
    
    // Aquí podrías hacer una llamada a la API para guardar el nuevo orden
    // updateServicesOrder(updatedServices);
  };

  // Función para manejar drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== dropIndex) {
      moveService(draggedItem, dropIndex);
    }
    setDraggedItem(null);
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visible</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={e => setForm({ ...form, active: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {form.active ? 'Mostrar en la web' : 'Ocultar de la web'}
                    </span>
                  </div>
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

        {/* Tabla de servicios mejorada */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Servicios</h2>
              </div>
              <div className="text-white text-sm">
                {services.filter(s => s.active).length} de {services.length} activos
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    Orden
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Visible
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service, index) => (
                  <tr 
                    key={service.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`hover:bg-gray-50 transition-colors ${
                      draggedItem === index ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600 cursor-move">
                          ⋮⋮
                        </div>
                        <span className="text-sm text-gray-500">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={service.description}>
                        {service.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${service.price}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => toggleServiceVisibility(service.id, service.active ?? true)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          service.active 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        title={service.active ? 'Ocultar servicio' : 'Mostrar servicio'}
                      >
                        {service.active ? '✓' : '✗'}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(service)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-xs font-medium hover:bg-yellow-600 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
