"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definir tipos para las solicitudes de transferencia
interface TransferenciaSolicitud {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  servicio: string;
  mensaje: string;
  estado: string;
  createdAt: string;
  total?: number;
  items?: any[];
}

export default function TransferenciasAdminPage() {
  const [solicitudes, setSolicitudes] = useState<TransferenciaSolicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const router = useRouter();

  // Verificar autenticación de admin
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
    } catch {
      router.push('/login');
      return;
    }

    fetchSolicitudes();
  }, [router]);

  // Cargar solicitudes de transferencia
  const fetchSolicitudes = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/transferencias', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSolicitudes(data.solicitudes);
      } else {
        setError(data.error || 'Error al cargar las solicitudes');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Aprobar solicitud
  const aprobarSolicitud = async (solicitudId: string) => {
    setProcessing(solicitudId);
    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/approve-transfer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          solicitudId,
          accion: 'aprobar'
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Solicitud aprobada exitosamente. Se envió email al cliente con los datos bancarios.');
        fetchSolicitudes(); // Recargar lista
      } else {
        setError(data.error || 'Error al aprobar la solicitud');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setProcessing(null);
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = async (solicitudId: string, motivo: string) => {
    setProcessing(solicitudId);
    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/approve-transfer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          solicitudId,
          accion: 'rechazar',
          motivo
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Solicitud rechazada. Se notificó al cliente.');
        fetchSolicitudes(); // Recargar lista
      } else {
        setError(data.error || 'Error al rechazar la solicitud');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setProcessing(null);
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Extraer total del mensaje
  const extraerTotal = (mensaje: string) => {
    const match = mensaje.match(/Total: \$([\d,]+)/);
    return match ? match[1] : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Gestión de Solicitudes de Compra
          </h1>
          <p className="text-white/70 text-lg">
            Aproba o rechaza solicitudes de compra por transferencia bancaria y MercadoPago
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-6 py-4 mb-6 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-400/30 text-green-300 rounded-2xl px-6 py-4 mb-6 text-center">
            {success}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {solicitudes.filter(s => s.estado === 'pendiente').length}
            </div>
            <div className="text-white/70">Pendientes</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {solicitudes.filter(s => s.estado === 'aprobado').length}
            </div>
            <div className="text-white/70">Aprobadas</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {solicitudes.filter(s => s.estado === 'rechazado').length}
            </div>
            <div className="text-white/70">Rechazadas</div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white/70 mt-4">Cargando solicitudes...</p>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-white/70 text-xl">No hay solicitudes de transferencia bancaria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                {/* Header de la solicitud */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {solicitud.nombre}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      <span>📧 {solicitud.email}</span>
                      <span>📱 {solicitud.telefono}</span>
                      <span>📅 {formatearFecha(solicitud.createdAt)}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      solicitud.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                      solicitud.estado === 'aprobado' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                      'bg-red-500/20 text-red-300 border border-red-400/30'
                    }`}>
                      {solicitud.estado === 'pendiente' ? '⏳ Pendiente' :
                       solicitud.estado === 'aprobado' ? '✅ Aprobado' : '❌ Rechazado'}
                    </span>
                  </div>
                </div>

                {/* Detalles de la solicitud */}
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">📍 Dirección de entrega:</h4>
                    <p className="text-white/70">{solicitud.direccion}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">💰 Total estimado:</h4>
                    <p className="text-cyan-400 font-bold text-lg">
                      ${extraerTotal(solicitud.mensaje)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">💳 Método de pago:</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      solicitud.servicio.includes('TRANSFERENCIA') 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                        : 'bg-green-500/20 text-green-300 border border-green-400/30'
                    }`}>
                      {solicitud.servicio.includes('TRANSFERENCIA') ? '🏦 Transferencia Bancaria' : '💳 MercadoPago'}
                    </span>
                  </div>
                </div>

                {/* Mensaje completo */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">📋 Detalles de la compra:</h4>
                  <div className="bg-black/20 rounded-lg p-4 text-white/80 text-sm">
                    {solicitud.mensaje}
                  </div>
                </div>

                {/* Acciones */}
                {solicitud.estado === 'pendiente' && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {solicitud.servicio.includes('TRANSFERENCIA') ? (
                      <button
                        onClick={() => aprobarSolicitud(solicitud.id)}
                        disabled={processing === solicitud.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processing === solicitud.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                          </>
                        ) : (
                          <>
                            ✅ Aprobar y enviar datos bancarios
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => aprobarSolicitud(solicitud.id)}
                        disabled={processing === solicitud.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processing === solicitud.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                          </>
                        ) : (
                          <>
                            ✅ Aprobar solicitud de MercadoPago
                          </>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        const motivo = prompt('Motivo del rechazo (opcional):');
                        if (motivo !== null) {
                          rechazarSolicitud(solicitud.id, motivo);
                        }
                      }}
                      disabled={processing === solicitud.id}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing === solicitud.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          ❌ Rechazar solicitud
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Estado final */}
                {solicitud.estado !== 'pendiente' && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    solicitud.estado === 'aprobado' ? 'bg-green-500/20 border border-green-400/30' :
                    'bg-red-500/20 border border-red-400/30'
                  }`}>
                    <p className={`font-semibold ${
                      solicitud.estado === 'aprobado' ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {solicitud.estado === 'aprobado' 
                        ? '✅ Solicitud aprobada - Se enviaron los datos bancarios al cliente'
                        : '❌ Solicitud rechazada - Se notificó al cliente'
                      }
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Botón de recargar */}
        <div className="text-center mt-8">
          <button
            onClick={fetchSolicitudes}
            className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
          >
            🔄 Recargar solicitudes
          </button>
        </div>
      </div>
    </div>
  );
} 
