"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MiCuentaPage() {
  // Estado para almacenar información del usuario
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para cargar información del usuario al montar el componente
  useEffect(() => {
    // Obtener información del usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Si está cargando, mostrar un estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6">
                  <div className="h-10 w-10 bg-white/10 rounded mb-4"></div>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Mi cuenta</h1>
        
        {/* Información del usuario */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Información de la cuenta</h2>
          <div className="grid md:grid-cols-2 gap-4 text-white/80">
            <div>
              <span className="font-semibold">Nombre:</span> {user?.name || 'No disponible'}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user?.email || 'No disponible'}
            </div>
            <div>
              <span className="font-semibold">Rol:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                user?.role === 'admin' ? 'bg-green-500/20 text-green-300' :
                user?.role === 'tecnico' ? 'bg-orange-500/20 text-orange-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {user?.role === 'admin' ? 'Administrador' :
                 user?.role === 'tecnico' ? 'Técnico' :
                 'Cliente'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel de Administración - Solo para admin */}
          {user?.role === 'admin' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-start">
              <div className="mb-4 text-green-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Panel de Administración</h2>
              <p className="text-white/70 mb-4">Gestioná productos, servicios, ventas y transferencias.</p>
              <Link 
                href="/admin" 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Ir al Panel
              </Link>
            </div>
          )}

          {/* Panel de Técnico - Solo para técnicos */}
          {user?.role === 'tecnico' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-start">
              <div className="mb-4 text-orange-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Panel de Técnico</h2>
              <p className="text-white/70 mb-4">Accedé a herramientas técnicas y gestión de servicios.</p>
              <Link 
                href="/admin" 
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Ir al Panel
              </Link>
            </div>
          )}

          {/* Mis datos - Para todos los usuarios */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-start">
            <div className="mb-4 text-purple-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Mis datos</h2>
            <p className="text-white/70 mb-4">Editá tus datos personales, direcciones y contraseña.</p>
            <Link 
              href="/mi-cuenta/mis-datos" 
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Ir a Mis datos
            </Link>
          </div>

          {/* Mis compras - Para clientes y técnicos */}
          {(user?.role === 'cliente' || user?.role === 'tecnico') && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-start">
              <div className="mb-4 text-blue-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Mis compras</h2>
              <p className="text-white/70 mb-4">Seguí el estado de tus compras y consultá tus facturas.</p>
              <Link 
                href="/mis-compras" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Ir a Mis compras
              </Link>
            </div>
          )}

          {/* Mis Solicitudes de Compra - Para todos los usuarios */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-start">
            <div className="mb-4 text-green-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Mis Solicitudes de Compra</h2>
            <p className="text-white/70 mb-4">Gestioná y pagá tus solicitudes de compra pendientes.</p>
            <Link 
              href="/mi-cuenta/solicitudes-compra" 
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Ver Solicitudes
            </Link>
          </div>

          {/* Centro de ayuda - Para todos los usuarios */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-start">
            <div className="mb-4 text-cyan-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Centro de ayuda</h2>
            <p className="text-white/70 mb-4">Realizá consultas y reclamos. Contactanos para poder ayudarte.</p>
            <Link 
              href="/mi-cuenta/centro-ayuda" 
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Ir al Centro de ayuda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
