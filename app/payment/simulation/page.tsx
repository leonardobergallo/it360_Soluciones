'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSimulationPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const ticket = searchParams.get('ticket');
  const amount = searchParams.get('amount');
  const prefId = searchParams.get('pref_id');

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Redirigir a página de éxito después de 3 segundos
      setTimeout(() => {
        window.location.href = `/payment/success?ticket=${ticket}`;
      }, 3000);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando MercadoPago...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
          <p className="text-gray-600 mb-6">Tu pago ha sido procesado correctamente</p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-700">
              <strong>Ticket:</strong> {ticket}<br/>
              <strong>Monto:</strong> ${amount}<br/>
              <strong>ID de Preferencia:</strong> {prefId}
            </p>
          </div>
          <p className="text-sm text-gray-500">Redirigiendo a la página de confirmación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MercadoPago - Simulación</h1>
          <p className="text-gray-600">Procesando tu pago de forma segura</p>
        </div>

        {/* Información del Pago */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Detalles del Pago</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Ticket:</span>
              <span className="font-semibold text-gray-800">{ticket}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Monto:</span>
              <span className="font-semibold text-gray-800">${amount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">ID de Preferencia:</span>
              <span className="font-mono text-sm text-gray-600">{prefId}</span>
            </div>
          </div>
        </div>

        {/* Métodos de Pago Simulados */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💳 Selecciona tu método de pago</h2>
          
          <div className="space-y-4">
            {/* Tarjeta de Crédito */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Tarjeta de Crédito/Débito</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
              </div>
            </div>

            {/* Transferencia Bancaria */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Transferencia Bancaria</h3>
                  <p className="text-sm text-gray-600">Pago en efectivo en sucursales</p>
                </div>
              </div>
            </div>

            {/* Pago en Efectivo */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Pago en Efectivo</h3>
                  <p className="text-sm text-gray-600">Pago en efectivo en sucursales</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Pago */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando pago...
              </div>
            ) : (
              '💳 Confirmar Pago'
            )}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              🔒 Pago seguro procesado por MercadoPago
            </p>
          </div>
        </div>

        {/* Información de Seguridad */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Información de Seguridad</h3>
              <p className="text-sm text-blue-700">
                Esta es una simulación del proceso de pago. En un entorno real, 
                serías redirigido a MercadoPago para completar el pago de forma segura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
