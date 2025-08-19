import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

import QuickNavBanner from './QuickNavBanner';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [userRole, setUserRole] = useState<string>('ADMIN');
  const [userData, setUserData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Detectar el rol del usuario y obtener datos completos
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUserData = JSON.parse(user);
        setUserRole(parsedUserData.role || 'ADMIN');
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Cerrar sidebar al navegar
  const handleNav = () => setSidebarOpen(false);

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* QuickNavBanner para admin y técnicos */}
      <QuickNavBanner userRole={userRole as 'ADMIN' | 'TECNICO' | 'USER'} />
      
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      
      {/* Sidebar mejorado */}
      <aside className={`fixed md:static z-50 top-0 left-0 h-full w-72 
        bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900
        shadow-2xl border-r border-white/10 backdrop-blur-xl
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Header del sidebar */}
        <div className="flex flex-col items-center py-8 px-6 border-b border-white/10">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-bold text-xl">IT</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-wide">
            IT360 {userRole === 'TECNICO' ? 'Técnico' : 'Admin'}
          </h2>
          <span className="text-base text-cyan-300 font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-cyan-500/30">
            {userRole === 'TECNICO' ? 'Panel Técnico' : 'Panel de Gestión'}
          </span>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-2 mt-8 px-4">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 text-white hover:bg-white/10 rounded-xl px-4 py-3 font-medium transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Dashboard</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          {userRole === 'ADMIN' && (
            <Link 
              href="/admin/users" 
              className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
              onClick={handleNav}
            >
              <svg className="w-6 h-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Usuarios</span>
              <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          )}
          
          <Link 
            href="/admin/services" 
            className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <svg className="w-6 h-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Servicios</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <svg className="w-6 h-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Catálogo</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link 
            href="/admin/sales" 
            className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <svg className="w-6 h-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>Ventas</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link 
            href="/admin/tickets" 
            className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <svg className="w-6 h-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Tickets</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          {userRole === 'ADMIN' && (
            <Link 
              href="/admin/transferencias" 
              className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
              onClick={handleNav}
            >
              <svg className="w-6 h-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Transferencias</span>
              <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          )}
        </nav>

        {/* Footer del sidebar */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-3 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-300 text-base">
              <span className="text-lg">⚡</span>
              <span className="font-medium">Sistema Activo</span>
            </div>
            <div className="text-sm text-cyan-200 mt-1">Panel de administración IT360</div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header simplificado */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-all duration-300" 
              onClick={() => setSidebarOpen(true)} 
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">IT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IT360 Soluciones</h1>
                <p className="text-sm text-gray-600">
                  {userRole === 'TECNICO' ? 'Panel Técnico' : 'Panel de Administración'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Información del usuario logueado */}
            {userData && (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-4 py-2 border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-gray-900">{userData.name}</div>
                    <div className="text-xs text-gray-600">{userData.email}</div>
                  </div>
                  <div className="text-xs">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userData.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      userData.role === 'TECNICO' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {userData.role === 'ADMIN' ? 'Admin' :
                       userData.role === 'TECNICO' ? 'Técnico' : 'Cliente'}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menú desplegable */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{userData.name}</div>
                          <div className="text-sm text-gray-600">{userData.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          window.location.href = '/profile';
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Editar Perfil
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          window.location.href = '/reset-password';
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Cambiar Contraseña
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          localStorage.removeItem('authToken');
                          localStorage.removeItem('user');
                          window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-lg">🏠</span>
              <span className="hidden sm:inline">Volver al Sitio</span>
            </Link>
            <Link 
              href="/catalogo" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Catálogo</span>
            </Link>
            <Link 
              href="/carrito" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Carrito</span>
            </Link>
          </div>
        </header>

        {/* Contenido con fondo blanco */}
        <div className="flex-1 bg-white">
          {children}
        </div>


      </main>
    </div>
  );
} 
