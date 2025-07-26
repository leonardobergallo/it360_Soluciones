"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentConfig {
  mercadopago: {
    habilitado: boolean;
    nombre: string;
    descripcion: string;
    configurado: boolean;
  };
  transferencia: {
    habilitado: boolean;
    nombre: string;
    descripcion: string;
    configurado: boolean;
    datos?: {
      alias: string;
      banco: string;
      cbu: string;
    };
  };
}

export default function PaymentConfigPage() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Verificar autenticación y permisos
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'ADMIN') {
        router.push('/admin');
        return;
      }
    } catch {
      router.push('/login');
      return;
    }

    fetchConfig();
  }, [router]);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/payment-config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Error al cargar configuración');
      }

      const data = await response.json();
      setConfig(data);
    } catch (error) {
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePayment = async (method: 'mercadopago' | 'transferencia') => {
    if (!config) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const newConfig = {
        mercadopago: {
          ...config.mercadopago,
          habilitado: method === 'mercadopago' ? !config.mercadopago.habilitado : config.mercadopago.habilitado
        },
        transferencia: {
          ...config.transferencia,
          habilitado: method === 'transferencia' ? !config.transferencia.habilitado : config.transferencia.habilitado
        }
      };

      const response = await fetch('/api/admin/payment-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newConfig)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar configuración');
      }

      const data = await response.json();
      setConfig(data.config);
      setMessage('Configuración actualizada correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Error al actualizar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70 mt-4">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Configuración de Métodos de Pago
          </h1>
          <p className="text-white/70 text-lg">
            Gestiona los métodos de pago disponibles para tus clientes
          </p>
        </div>

        {/* Mensajes */}
        {message && (
          <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 rounded-2xl px-6 py-4 mb-6 text-center">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-6 py-4 mb-6 text-center">
            ❌ {error}
          </div>
        )}

        {/* Configuración */}
        {config && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* MercadoPago */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">MercadoPago</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    config.mercadopago.habilitado 
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-400/30'
                  }`}>
                    {config.mercadopago.habilitado ? 'Habilitado' : 'Deshabilitado'}
                  </div>
                </div>
                
                <p className="text-white/70 mb-4">
                  {config.mercadopago.descripcion}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>✅</span>
                    <span>Pago seguro con tarjeta</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>✅</span>
                    <span>Pago en efectivo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>✅</span>
                    <span>Procesamiento automático</span>
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePayment('mercadopago')}
                  disabled={saving}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    config.mercadopago.habilitado
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </span>
                  ) : (
                    <span>
                      {config.mercadopago.habilitado ? 'Deshabilitar' : 'Habilitar'} MercadoPago
                    </span>
                  )}
                </button>
              </div>

              {/* Transferencia Bancaria */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">Transferencia Bancaria</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    config.transferencia.habilitado 
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-400/30'
                  }`}>
                    {config.transferencia.habilitado ? 'Habilitado' : 'Deshabilitado'}
                  </div>
                </div>
                
                <p className="text-white/70 mb-4">
                  {config.transferencia.descripcion}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>✅</span>
                    <span>Sin comisiones</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>✅</span>
                    <span>Transferencia directa</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>✅</span>
                    <span>Contacto personalizado</span>
                  </div>
                </div>

                {config.transferencia.datos && (
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Datos bancarios:</h4>
                    <div className="space-y-1 text-xs text-white/70">
                      <p><strong>Alias:</strong> {config.transferencia.datos.alias}</p>
                      <p><strong>Banco:</strong> {config.transferencia.datos.banco}</p>
                      <p><strong>CBU:</strong> {config.transferencia.datos.cbu}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleTogglePayment('transferencia')}
                  disabled={saving}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    config.transferencia.habilitado
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </span>
                  ) : (
                    <span>
                      {config.transferencia.habilitado ? 'Deshabilitar' : 'Habilitar'} Transferencia
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Información importante</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-white/70">
                <div>
                  <h4 className="font-semibold text-white mb-2">Para MercadoPago:</h4>
                  <ul className="space-y-1">
                    <li>• Los clientes serán redirigidos a MercadoPago</li>
                    <li>• El pago se procesa automáticamente</li>
                    <li>• Recibirás notificaciones por email</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Para Transferencia:</h4>
                  <ul className="space-y-1">
                    <li>• Los clientes recibirán los datos bancarios</li>
                    <li>• Deberás verificar el pago manualmente</li>
                    <li>• Recibirás notificaciones por email y WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botón volver */}
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/admin')}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20"
              >
                ← Volver al Panel de Administración
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
