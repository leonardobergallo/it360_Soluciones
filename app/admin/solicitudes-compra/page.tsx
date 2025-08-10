"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: string;
  ticketNumber: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  categoria: string;
  asunto: string;
  descripcion: string;
  urgencia: string;
  estado: string;
  prioridad: string;
  createdAt: string;
  updatedAt: string;
}

export default function SolicitudesCompraPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está logueado y es admin
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN') {
        router.push('/');
        return;
      }
    } catch {
      router.push('/login');
      return;
    }

    fetchSolicitudesCompra();
  }, [router]);

  const fetchSolicitudesCompra = async () => {
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      
      if (response.ok) {
        // Filtrar solo tickets de tipo 'compra'
        const solicitudesCompra = data.filter((ticket: Ticket) => ticket.tipo === 'compra');
        setTickets(solicitudesCompra);
        console.log('Tickets encontrados:', solicitudesCompra.length);
      } else {
        setError('Error al cargar las solicitudes de compra');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleHabilitarPago = async (ticketId: string) => {
    // Mostrar modal para seleccionar método de pago
    const metodoPago = prompt(
      'Selecciona el método de pago:\n\n1. TRANSFERENCIA_BANCARIA\n2. MERCADOPAGO\n\nEscribe el número (1 o 2):'
    );
    
    if (!metodoPago) return;
    
    let metodoSeleccionado = '';
    if (metodoPago === '1') {
      metodoSeleccionado = 'TRANSFERENCIA_BANCARIA';
    } else if (metodoPago === '2') {
      metodoSeleccionado = 'MERCADOPAGO';
    } else {
      alert('❌ Opción no válida');
      return;
    }

    try {
      const response = await fetch('/api/admin/habilitar-pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: ticketId,
          metodoPago: metodoSeleccionado
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar la lista
        fetchSolicitudesCompra();
        alert(`✅ ${data.message}`);
        
        // Disparar evento para actualizar el carrito en el frontend
        window.dispatchEvent(new CustomEvent('cartCleared'));
      } else {
        if (data.error === 'Stock insuficiente') {
          alert(`❌ ${data.error}\n\nProductos sin stock:\n${data.detalles.join('\n')}`);
        } else {
          alert(`❌ ${data.error || 'Error al habilitar el pago'}`);
        }
      }
    } catch {
      alert('❌ Error de conexión');
    }
  };

  const handleRechazar = async (ticketId: string) => {
    const motivo = prompt('Motivo del rechazo:');
    if (!motivo) return;

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'rechazado',
          notas: `Rechazado: ${motivo}`
        }),
      });

      if (response.ok) {
        fetchSolicitudesCompra();
        alert('✅ Solicitud rechazada');
      } else {
        alert('❌ Error al rechazar la solicitud');
      }
    } catch {
      alert('❌ Error de conexión');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto':
      case 'pendiente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'pago_habilitado': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'rechazado': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70 mt-4">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Solicitudes de Compra
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Gestiona las solicitudes de compra y habilita los pagos
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {tickets.filter(t => t.estado === 'pendiente' || t.estado === 'abierto').length}
            </div>
            <div className="text-white/70">Pendientes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {tickets.filter(t => t.estado === 'pago_habilitado').length}
            </div>
            <div className="text-white/70">Pagos Habilitados</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {tickets.filter(t => t.estado === 'rechazado').length}
            </div>
            <div className="text-white/70">Rechazadas</div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        <div className="space-y-6">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay solicitudes de compra</h3>
              <p className="text-white/70">Las solicitudes aparecerán aquí cuando los clientes completen el checkout</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                {/* Header del ticket */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">📦</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{ticket.ticketNumber}</h3>
                      <p className="text-white/70 text-sm">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(ticket.estado)}`}>
                      {ticket.estado === 'pendiente' || ticket.estado === 'abierto' ? '⏳ Pendiente' :
                       ticket.estado === 'pago_habilitado' ? '✅ Pago Habilitado' :
                       ticket.estado === 'rechazado' ? '❌ Rechazado' : ticket.estado}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full text-sm font-medium">
                      {ticket.prioridad}
                    </span>
                  </div>
                </div>

                {/* Información del cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-cyan-300 mb-2">👤 Cliente</h4>
                    <div className="space-y-1 text-white/90">
                      <p><strong>Nombre:</strong> {ticket.nombre}</p>
                      <p><strong>Email:</strong> {ticket.email}</p>
                      <p><strong>Teléfono:</strong> {ticket.telefono}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-300 mb-2">📋 Detalles</h4>
                    <div className="space-y-1 text-white/90">
                      <p><strong>Asunto:</strong> {ticket.asunto}</p>
                      <p><strong>Urgencia:</strong> {ticket.urgencia}</p>
                      <p><strong>Creado:</strong> {formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-6">
                  <h4 className="font-semibold text-cyan-300 mb-2">📝 Descripción</h4>
                  <div className="bg-white/5 rounded-xl p-4">
                    <pre className="text-white/90 text-sm whitespace-pre-wrap font-sans">
                      {ticket.descripcion}
                    </pre>
                  </div>
                </div>

                {/* Acciones */}
                {(ticket.estado === 'pendiente' || ticket.estado === 'abierto') && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleHabilitarPago(ticket.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>✅</span>
                      Habilitar Pago
                    </button>
                    <button
                      onClick={() => handleRechazar(ticket.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>❌</span>
                      Rechazar
                    </button>
                  </div>
                )}

                {ticket.estado === 'pago_habilitado' && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <h4 className="font-semibold text-green-300">Pago Habilitado</h4>
                        <p className="text-white/70 text-sm">El cliente puede proceder con el pago</p>
                      </div>
                    </div>
                  </div>
                )}

                {ticket.estado === 'rechazado' && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❌</span>
                      <div>
                        <h4 className="font-semibold text-red-300">Solicitud Rechazada</h4>
                        <p className="text-white/70 text-sm">Esta solicitud ha sido rechazada</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 