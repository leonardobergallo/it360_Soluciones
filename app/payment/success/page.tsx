'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [ticket, setTicket] = useState<string | null>(null);

  useEffect(() => {
    const ticketParam = searchParams.get('ticket');
    setTicket(ticketParam);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
        {/* Icono de Éxito */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Pago Completado Exitosamente!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Tu pago ha sido procesado y confirmado. Gracias por tu compra.
        </p>

        {/* Información del Ticket */}
        {ticket && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4">📋 Detalles de la Transacción</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">Número de Ticket:</span>
                <span className="text-green-800 font-semibold">{ticket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">Estado:</span>
                <span className="text-green-800 font-semibold">✅ Pagado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">Fecha:</span>
                <span className="text-green-800 font-semibold">
                  {new Date().toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de Confirmación */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📧 Confirmación por Email</h3>
          <p className="text-blue-700 mb-4">
            Hemos enviado una confirmación de pago a tu email. 
            También recibirás un comprobante de MercadoPago.
          </p>
          <div className="text-sm text-blue-600">
            <p>• Verifica tu bandeja de entrada</p>
            <p>• Revisa la carpeta de spam si no encuentras el email</p>
          </div>
        </div>

        {/* Próximos Pasos */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 Próximos Pasos</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">1.</span>
              <span className="text-gray-700">Nuestro equipo procesará tu pedido</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">2.</span>
              <span className="text-gray-700">Te contactaremos para coordinar la entrega</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">3.</span>
              <span className="text-gray-700">Recibirás actualizaciones por email</span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            🏠 Volver al Inicio
          </a>
          <a
            href="/mi-cuenta"
            className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            👤 Mi Cuenta
          </a>
          <a
            href="/contacto"
            className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            📞 Contacto
          </a>
        </div>

        {/* Información de Contacto */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            ¿Tienes alguna pregunta sobre tu pedido?
          </p>
          <div className="text-sm text-gray-500">
            <p>📧 it360tecnologia@gmail.com</p>
            <p>📱 +54 9 342 508-9906</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de fallback para Suspense
function PaymentSuccessFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando confirmación de pago...</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
