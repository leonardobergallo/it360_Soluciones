"use client";
import { useState } from 'react';

export default function TestMercadoPago() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testMercadoPago = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Datos de prueba
      const testData = {
        items: [
          {
            product: {
              id: 'test-1',
              name: 'Producto de Prueba',
              price: 100,
              image: '/servicio-productos.png'
            },
            quantity: 1
          }
        ],
        nombre: 'Usuario de Prueba',
        email: 'test@example.com',
        telefono: '123456789',
        direccion: 'Dirección de Prueba 123',
        userId: null
      };

      console.log('Enviando datos de prueba:', testData);

      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Intentar parsear como JSON
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || 'Error desconocido');
        } catch {
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (data.success && data.url) {
        setResult(data);
        // Abrir la URL de Mercado Pago en una nueva pestaña
        window.open(data.url, '_blank');
      } else {
        throw new Error(data.error || 'No se pudo generar el enlace de pago');
      }

    } catch (err) {
      console.error('Error en prueba:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🔧 Prueba de Mercado Pago
        </h1>
        
        <div className="space-y-6">
          {/* Información */}
          <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
            <h2 className="text-lg font-semibold text-blue-300 mb-2">Información de Prueba</h2>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Producto: Producto de Prueba ($100)</li>
              <li>• Usuario: Usuario de Prueba</li>
              <li>• Email: test@example.com</li>
              <li>• Teléfono: 123456789</li>
            </ul>
          </div>

          {/* Botón de prueba */}
          <div className="text-center">
            <button
              onClick={testMercadoPago}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Probando Mercado Pago...
                </div>
              ) : (
                '🧪 Probar Mercado Pago'
              )}
            </button>
          </div>

          {/* Resultado */}
          {result && (
            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-300 mb-2">✅ Prueba Exitosa</h3>
              <div className="text-green-200 text-sm space-y-2">
                <p><strong>Preferencia ID:</strong> {result.preferenceId}</p>
                <p><strong>URL de Pago:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-100">{result.url}</a></p>
                <p className="text-xs mt-3">Se abrirá automáticamente en una nueva pestaña</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
              <h3 className="text-lg font-semibold text-red-300 mb-2">❌ Error en la Prueba</h3>
              <p className="text-red-200 text-sm">{error}</p>
              
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                <h4 className="text-red-300 font-semibold mb-2">Posibles soluciones:</h4>
                <ul className="text-red-200 text-xs space-y-1">
                  <li>• Verifica que MERCADOPAGO_ACCESS_TOKEN esté configurado en .env</li>
                  <li>• Asegúrate de que el token sea válido y esté activo</li>
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Revisa los logs del servidor para más detalles</li>
                </ul>
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-500/30">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">📋 Instrucciones</h3>
            <ol className="text-yellow-200 text-sm space-y-1">
              <li>1. Haz clic en "Probar Mercado Pago"</li>
              <li>2. Si es exitoso, se abrirá la página de pago</li>
              <li>3. Usa las tarjetas de prueba de Mercado Pago</li>
              <li>4. Completa el proceso de pago</li>
              <li>5. Verifica que regrese correctamente a tu sitio</li>
            </ol>
            
            <div className="mt-3 p-2 bg-yellow-500/10 rounded text-xs">
              <strong>Tarjetas de prueba:</strong><br/>
              • Visa: 4509 9535 6623 3704<br/>
              • Mastercard: 5031 4332 1540 6351<br/>
              • Cualquier fecha futura y CVV 123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 