import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import FooterNav from './FooterNav';
import ModernLogo from './ModernLogo';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [userRole, setUserRole] = useState<string>('ADMIN');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detectar el rol del usuario
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || 'ADMIN');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Cerrar sidebar al navegar
  const handleNav = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
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
            <span>Productos</span>
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
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Ir al sitio</span>
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

        {/* FooterNav */}
        <FooterNav />
      </main>
    </div>
  );
} 