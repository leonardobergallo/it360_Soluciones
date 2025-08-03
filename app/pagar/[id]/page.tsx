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

export default function PagarPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.estado === 'pago_habilitado') {
          setTicket(data);
        } else {
          setError('Esta solicitud no está habilitada para pago');
        }
      } else {
        setError('Error al cargar la solicitud');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarPago = async () => {
    setProcessing(true);
    try {
      // Actualizar el ticket a pagado
      const response = await fetch(`/api/tickets/${params.id}`, {
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
        setShowSuccess(true);
        // Enviar email de confirmación
        await enviarConfirmacionPago();
      } else {
        alert('❌ Error al procesar el pago');
      }
    } catch (err) {
      alert('❌ Error de conexión');
    } finally {
      setProcessing(false);
    }
  };

  const enviarConfirmacionPago = async () => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: ticket?.nombre || 'Cliente',
          email: 'pagos@it360.com',
          asunto: `✅ Pago Confirmado - ${ticket?.ticketNumber}`,
          mensaje: `
Pago confirmado para la solicitud ${ticket?.ticketNumber}

Detalles del pago:
• Cliente: ${ticket?.nombre}
• Email: ${ticket?.email}
• Teléfono: ${ticket?.telefono}
• Método de pago: ${paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 'MercadoPago'}
• Fecha: ${new Date().toLocaleString('es-AR')}

Descripción de la solicitud:
${ticket?.descripcion}

Por favor, proceder con el envío de los productos/servicios.
          `
        }),
      });

      if (response.ok) {
        console.log('✅ Email de confirmación enviado');
      }
    } catch (error) {
      console.error('❌ Error enviando confirmación:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70 mt-4">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/mi-cuenta/solicitudes-compra')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
          >
            Ver Mis Solicitudes
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-4">¡Pago Confirmado!</h2>
          <p className="text-white/70 mb-6">
            Tu pago ha sido procesado correctamente. Te enviaremos un email de confirmación y procederemos con tu pedido.
          </p>
          <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 mb-6">
            <p className="text-green-300 text-sm">
              <strong>Número de solicitud:</strong> {ticket?.ticketNumber}
            </p>
          </div>
          <button 
            onClick={() => router.push('/mi-cuenta/solicitudes-compra')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            Ver Mis Solicitudes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ModernLogo size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Finalizar Pago
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Completa tu solicitud de compra
          </p>
        </div>

        {ticket && (
          <div className="max-w-2xl mx-auto">
            {/* Información del ticket */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📦</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{ticket.ticketNumber}</h3>
                  <p className="text-white/70 text-sm">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-3 text-white/90">
                <p><strong>Asunto:</strong> {ticket.asunto}</p>
                <p><strong>Cliente:</strong> {ticket.nombre}</p>
                <p><strong>Email:</strong> {ticket.email}</p>
                <p><strong>Teléfono:</strong> {ticket.telefono || 'No especificado'}</p>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">💳 Método de Pago</h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/20 cursor-pointer hover:bg-white/10 transition-colors">
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
                
                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/20 cursor-pointer hover:bg-white/10 transition-colors">
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

            {/* Datos bancarios (si es transferencia) */}
            {paymentMethod === 'transferencia' && (
              <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-4">🏦 Datos Bancarios</h3>
                <div className="bg-white/10 rounded-xl p-4 space-y-2 text-white/90">
                  <p><strong>Banco:</strong> Banco de la Nación Argentina</p>
                  <p><strong>Tipo de cuenta:</strong> Cuenta Corriente</p>
                  <p><strong>Número de cuenta:</strong> 1234567890</p>
                  <p><strong>CBU:</strong> 0110123456789012345678</p>
                  <p><strong>Titular:</strong> IT360 Soluciones S.A.</p>
                  <p><strong>CUIT:</strong> 30-12345678-9</p>
                </div>
                <p className="text-yellow-300 text-sm mt-4">
                  <strong>💡 Importante:</strong> Envía el comprobante de pago a pagos@it360.com
                </p>
              </div>
            )}

            {/* Botón de confirmación */}
            <div className="text-center">
              <button
                onClick={handleConfirmarPago}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando Pago...
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    Confirmar Pago
                  </>
                )}
              </button>
            </div>

            {/* Información de contacto */}
            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
                ¿Necesitas ayuda? Contactanos:<br />
                <strong>WhatsApp:</strong> +54 9 11 1234-5678 | 
                <strong>Email:</strong> soporte@it360.com
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 