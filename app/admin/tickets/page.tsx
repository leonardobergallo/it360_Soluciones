"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import AdminLayout from "@/components/AdminLayout";

interface Ticket {
  id: string;
  ticketNumber: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  tipo: string;
  categoria: string;
  asunto: string;
  descripcion: string;
  urgencia: string;
  estado: string;
  prioridad: string;
  asignadoA?: string;
  notas?: string;
  resueltoEn?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setError('Error al cargar tickets');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, estado: newStatus })
      });

      if (response.ok) {
        fetchTickets(); // Recargar tickets
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Error actualizando ticket:', error);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'bg-blue-100 text-blue-800';
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800';
      case 'resuelto': return 'bg-green-100 text-green-800';
      case 'cerrado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'todos') return true;
    return ticket.estado === filter;
  });

  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎫 Sistema de Tickets</h1>
            <p className="text-gray-600">Gestión unificada de todas las peticiones de soporte</p>
          </div>

          {/* Filtros */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'todos' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos ({tickets.length})
            </button>
            <button
              onClick={() => setFilter('abierto')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'abierto' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Abiertos ({tickets.filter(t => t.estado === 'abierto').length})
            </button>
            <button
              onClick={() => setFilter('en_proceso')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'en_proceso' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              En Proceso ({tickets.filter(t => t.estado === 'en_proceso').length})
            </button>
            <button
              onClick={() => setFilter('resuelto')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'resuelto' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Resueltos ({tickets.filter(t => t.estado === 'resuelto').length})
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg text-gray-600">Cargando tickets...</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          #{ticket.ticketNumber}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.estado)}`}>
                          {ticket.estado.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(ticket.urgencia)}`}>
                          {ticket.urgencia}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">{ticket.asunto}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{ticket.nombre}</span> • {ticket.email}
                        {ticket.empresa && ` • ${ticket.empresa}`}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>🏷️ {ticket.tipo}</span>
                        <span>📂 {ticket.categoria}</span>
                        <span>⭐ {ticket.prioridad}</span>
                        <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {ticket.descripcion}
                  </p>
                </div>
              ))}
            </div>
          )}

          {filteredTickets.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay tickets</h3>
              <p className="text-gray-600">No se encontraron tickets con los filtros seleccionados.</p>
            </div>
          )}
        </div>

        {/* Modal de detalle del ticket */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      #{selectedTicket.ticketNumber}
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedTicket.asunto}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl p-2"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información del Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {selectedTicket.nombre}</p>
                      <p><span className="font-medium">Email:</span> {selectedTicket.email}</p>
                      <p><span className="font-medium">Teléfono:</span> {selectedTicket.telefono || 'No especificado'}</p>
                      <p><span className="font-medium">Empresa:</span> {selectedTicket.empresa || 'No especificada'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Detalles del Ticket</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Tipo:</span> {selectedTicket.tipo}</p>
                      <p><span className="font-medium">Categoría:</span> {selectedTicket.categoria}</p>
                      <p><span className="font-medium">Urgencia:</span> {selectedTicket.urgencia}</p>
                      <p><span className="font-medium">Prioridad:</span> {selectedTicket.prioridad}</p>
                      <p><span className="font-medium">Estado:</span> {selectedTicket.estado}</p>
                      <p><span className="font-medium">Creado:</span> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.descripcion}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {selectedTicket.estado === 'abierto' && (
                    <button
                      onClick={() => updateTicketStatus(selectedTicket.id, 'en_proceso')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Marcar en Proceso
                    </button>
                  )}
                  {selectedTicket.estado === 'en_proceso' && (
                    <button
                      onClick={() => updateTicketStatus(selectedTicket.id, 'resuelto')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Marcar Resuelto
                    </button>
                  )}
                  {selectedTicket.estado === 'resuelto' && (
                    <button
                      onClick={() => updateTicketStatus(selectedTicket.id, 'cerrado')}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cerrar Ticket
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AuthGuard>
  );
} 