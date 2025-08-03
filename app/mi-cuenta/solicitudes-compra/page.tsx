"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModernLogo from '@/components/ModernLogo';

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

export default function MisSolicitudesCompraPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchMisSolicitudesCompra();
  }, [router]);

  const fetchMisSolicitudesCompra = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(atob(token!.split('.')[1]));
      
      const response = await fetch('/api/tickets');
      const data = await response.json();
      
      if (response.ok) {
        // Filtrar solo tickets de compra del usuario actual
        const misSolicitudesCompra = data.filter((ticket: Ticket) => 
          ticket.tipo === 'compra' && 
          ticket.email === userData.email
        );
        setTickets(misSolicitudesCompra);
      } else {
        setError('Error al cargar las solicitudes de compra');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowPaymentModal(true);
  };

  const handleConfirmarPago = async () => {
    if (!selectedTicket) return;
    
    setProcessing(true);
    try {
      // Aquí iría la lógica de pago real
      // Por ahora solo actualizamos el estado del ticket
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'pagado',
          notas: `Pago realizado con ${paymentMethod === 'transferencia' ? 'transferencia bancaria' : 'MercadoPago'}`
        }),
      });

      if (response.ok) {
        alert('✅ ¡Pago realizado con éxito! Te enviaremos un email de confirmación.');
        setShowPaymentModal(false);
        setSelectedTicket(null);
        fetchMisSolicitudesCompra(); // Recargar la lista
      } else {
        alert('❌ Error al procesar el pago');
      }
    } catch (err) {
      alert('❌ Error de conexión');
    } finally {
      setProcessing(false);
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
      case 'pagado': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'rechazado': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'abierto':
      case 'pendiente': return '⏳ Pendiente de revisión';
      case 'pago_habilitado': return '✅ Pago habilitado';
      case 'pagado': return '💳 Pagado';
      case 'rechazado': return '❌ Rechazado';
      default: return estado;
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
              Mis Solicitudes de Compra
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Gestiona y paga tus solicitudes de compra
          </p>
        </div>

        {/* Lista de solicitudes */}
        <div className="space-y-6">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">No tienes solicitudes de compra</h3>
              <p className="text-white/70">Ve al catálogo para hacer tu primera compra</p>
              <button 
                onClick={() => router.push('/catalogo')}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
              >
                Ir al Catálogo
              </button>
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
                      {getEstadoText(ticket.estado)}
                    </span>
                  </div>
                </div>

                {/* Información del ticket */}
                <div className="mb-4">
                  <h4 className="font-semibold text-cyan-300 mb-2">📋 Detalles</h4>
                  <div className="space-y-1 text-white/90">
                    <p><strong>Asunto:</strong> {ticket.asunto}</p>
                    <p><strong>Prioridad:</strong> {ticket.prioridad}</p>
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

                {/* Acciones según el estado */}
                {ticket.estado === 'pago_habilitado' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handlePagar(ticket)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>💳</span>
                      Proceder al Pago
                    </button>
                  </div>
                )}

                {ticket.estado === 'pagado' && (
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💳</span>
                      <div>
                        <h4 className="font-semibold text-blue-300">Pago Completado</h4>
                        <p className="text-white/70 text-sm">Tu pedido está siendo procesado</p>
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

      {/* Modal de Pago */}
      {showPaymentModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">💳 Finalizar Compra</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cyan-300 mb-2">
                  Método de Pago
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/20 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === 'transferencia'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-cyan-500"
                    />
                    <span className="text-2xl">🏦</span>
                    <div>
                      <p className="font-semibold text-white">Transferencia Bancaria</p>
                      <p className="text-white/70 text-sm">Pago directo a nuestra cuenta</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/20 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-cyan-500"
                    />
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="font-semibold text-white">MercadoPago</p>
                      <p className="text-white/70 text-sm">Pago seguro con tarjeta</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-500/20 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-500/30 transition-all duration-300"
                  disabled={processing}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarPago}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span>💳</span>
                      Confirmar Pago
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 