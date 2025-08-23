'use client';

import { useEffect, useState, use } from 'react';
import { useParams } from 'next/navigation';

interface Ticket {
  id: string;
  ticketNumber: string;
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  descripcion: string;
  tipo: string;
  categoria: string;
  estado: string;
  notas: string;
  createdAt: string;
}

export default function PagarPage() {
  const params = useParams();
  const ticketNumber = params.ticketNumber as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metodoPago, setMetodoPago] = useState<'transferencia' | 'mercadopago' | null>(null);
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await fetch(`/api/tickets/${ticketNumber}`);
        if (response.ok) {
          const data = await response.json();
          setTicket(data);
        } else {
          setError('Ticket no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el ticket');
      } finally {
        setLoading(false);
      }
    }
    if (ticketNumber) {
      fetchTicket();
    }
  }, [ticketNumber]);

  // Función para extraer productos del ticket
  function extractProductos(descripcion: string) {
    const productos = [];
    const lines = descripcion.split('\n');
    
    for (const line of lines) {
      // Buscar el patrón "• Producto x1 - $XXXXX"
      const match = line.match(/•\s*(.+?)\s*x(\d+)\s*-\s*\$([\d,]+\.?\d*)/);
      if (match) {
        productos.push({
          nombre: match[1].trim(),
          cantidad: parseInt(match[2]),
          precio: parseFloat(match[3].replace(',', ''))
        });
      }
    }
    
    console.log('Productos extraídos:', productos);
    return productos;
  }

  // Función para extraer el total
  function extraerTotal(descripcion: string) {
    // Buscar el patrón "Total: $XXXXX"
    const match = descripcion.match(/Total:\s*\$([\d,]+\.?\d*)/);
    if (match) {
      return parseFloat(match[1].replace(',', ''));
    }
    
    // Si no encuentra el patrón, buscar cualquier número después de "Total:"
    const totalMatch = descripcion.match(/Total:\s*([\d,]+\.?\d*)/);
    if (totalMatch) {
      return parseFloat(totalMatch[1].replace(',', ''));
    }
    
    console.log('No se pudo extraer el total de la descripción:', descripcion);
    return 0;
  }

  // Función para copiar al portapapeles
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert('¡Copiado al portapapeles!');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }

  // Función para procesar pago con MercadoPago
  async function procesarPagoMercadoPago() {
    if (!ticket) return;
    
    setProcesandoPago(true);
    try {
      const total = extraerTotal(ticket.descripcion);
      const productos = extractProductos(ticket.descripcion);
      const descripcionProductos = productos.map(p => `${p.nombre} x${p.cantidad}`).join(', ');
      
      console.log('Datos para MercadoPago:', {
        ticketNumber: ticket.ticketNumber,
        amount: total,
        description: descripcionProductos,
        customerEmail: ticket.email,
        customerName: ticket.nombre
      });
      
      const response = await fetch('/api/payment/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketNumber: ticket.ticketNumber,
          amount: total,
          description: descripcionProductos,
          customerEmail: ticket.email,
          customerName: ticket.nombre
        }),
      });

      const data = await response.json();
      
      if (data.success && data.init_point) {
        // Redirigir a MercadoPago
        window.location.href = data.init_point;
      } else {
        alert('Error al procesar el pago: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al procesar el pago');
    } finally {
      setProcesandoPago(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Ticket no encontrado'}</p>
          <a 
            href="/"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  const productos = extractProductos(ticket.descripcion);
  const total = extraerTotal(ticket.descripcion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Procesar Pago</h1>
          <p className="text-gray-600">Ticket: {ticket.ticketNumber}</p>
        </div>

        {/* Resumen del Pedido */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Resumen del Pedido</h2>
          <div className="space-y-3">
            {productos.map((producto, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{producto.nombre}</p>
                  <p className="text-sm text-gray-500">Cantidad: {producto.cantidad}</p>
                </div>
                <p className="font-semibold text-gray-800">${producto.precio.toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
              <p className="text-xl font-bold text-gray-800">Total</p>
              <p className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Selección de Método de Pago */}
        {!metodoPago ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Transferencia Bancaria */}
            <div 
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200"
              onClick={() => setMetodoPago('transferencia')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Transferencia Bancaria</h3>
                <p className="text-gray-600 mb-4">Paga directamente desde tu cuenta bancaria</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✅ Sin comisiones adicionales</p>
                  <p>✅ Pago inmediato</p>
                  <p>✅ Datos bancarios seguros</p>
                </div>
              </div>
            </div>

            {/* MercadoPago */}
            <div 
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-200"
              onClick={() => setMetodoPago('mercadopago')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">MercadoPago</h3>
                <p className="text-gray-600 mb-4">Paga con tarjeta, efectivo o transferencia</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✅ Múltiples métodos de pago</p>
                  <p>✅ Pago seguro y rápido</p>
                  <p>✅ Comprobante automático</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Método de Pago Seleccionado */
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {metodoPago === 'transferencia' ? '🏦 Transferencia Bancaria' : '💳 MercadoPago'}
              </h2>
              <button 
                onClick={() => setMetodoPago(null)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Cambiar método
              </button>
            </div>

            {metodoPago === 'transferencia' ? (
              /* Datos de Transferencia */
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Datos Bancarios</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Banco:</span>
                      <span className="text-gray-800">Banco Santander</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Titular:</span>
                      <span className="text-gray-800">Aníbal Leonardo Bergallo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">CUIT/CUIL:</span>
                      <span className="text-gray-800">23-27487833-9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Tipo de Cuenta:</span>
                      <span className="text-gray-800">Cuenta Corriente</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">CBU:</span>
                      <span className="text-gray-800 font-mono">0720156788000001781072</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Alias:</span>
                      <span className="text-gray-800 font-mono">IT360.SOLUCIONES</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-blue-200">
                      <span className="font-bold text-gray-800">Monto a transferir:</span>
                      <span className="font-bold text-blue-600 text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => copyToClipboard('0720156788000001781072')}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    📋 Copiar CBU
                  </button>
                  <button 
                    onClick={() => copyToClipboard('IT360.SOLUCIONES')}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    📋 Copiar Alias
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>⚠️ Importante:</strong> Una vez realizada la transferencia, envía el comprobante a{' '}
                    <strong>it360tecnologia@gmail.com</strong> con el número de ticket: <strong>{ticket.ticketNumber}</strong>
                  </p>
                </div>

                <a 
                  href={`mailto:it360tecnologia@gmail.com?subject=Comprobante de pago - ${ticket.ticketNumber}&body=Hola, adjunto el comprobante de transferencia por el ticket ${ticket.ticketNumber}.`}
                  className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-700 transition-colors"
                >
                  📧 Enviar Comprobante por Email
                </a>
              </div>
            ) : (
              /* MercadoPago */
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Pago con MercadoPago</h3>
                  <div className="space-y-3 text-sm text-green-700">
                    <p>• Pagos seguros con tarjeta de crédito/débito</p>
                    <p>• Transferencias bancarias</p>
                    <p>• Pago en efectivo</p>
                    <p>• Comprobante automático</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-center">
                    <strong>Monto a pagar:</strong> <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                  </p>
                </div>

                <button 
                  onClick={procesarPagoMercadoPago}
                  disabled={procesandoPago}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesandoPago ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    '💳 Proceder al Pago con MercadoPago'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
