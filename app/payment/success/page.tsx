'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const ticket = searchParams.get('ticket');
    const prefId = searchParams.get('pref_id');
    
    if (ticket && prefId) {
      setPaymentData({
        ticket,
        preferenceId: prefId,
        status: 'approved',
        paymentMethod: 'MercadoPago',
        amount: '53.300'
      });
    }
  }, [searchParams]);

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Procesando pago...</h1>
            <p className="text-gray-600">Verificando información de pago</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          {/* Ícono de éxito */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
          <p className="text-gray-600 mb-6">Tu transacción se completó correctamente</p>

          {/* Detalles del pago */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Detalles de la transacción:</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket:</span>
                <span className="font-medium">{paymentData.ticket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Método de pago:</span>
                <span className="font-medium">{paymentData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-medium">${paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-green-600">Aprobado</span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">📧 Confirmación por email</h3>
            <p className="text-sm text-blue-700">
              Recibirás una confirmación por email con los detalles de tu compra y las instrucciones de envío.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Link 
              href="/"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors block text-center"
            >
              🏠 Volver al inicio
            </Link>
            
            <Link 
              href="/catalogo"
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors block text-center"
            >
              🛍️ Seguir comprando
            </Link>
          </div>

          {/* Nota importante */}
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Nota:</strong> Esta es una simulación de pago para pruebas. En producción, 
              recibirías la confirmación real de MercadoPago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
