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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-110">
              <ModernLogo size="lg" className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
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
            <span className="text-xl">📊</span>
            <span>Dashboard</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          {userRole === 'ADMIN' && (
            <Link 
              href="/admin/users" 
              className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
              onClick={handleNav}
            >
              <span className="text-xl">👥</span>
              <span>Usuarios</span>
              <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          )}
          
          <Link 
            href="/admin/services" 
            className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <span className="text-xl">🔧</span>
            <span>Servicios</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <span className="text-xl">📦</span>
            <span>Productos</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link 
            href="/admin/sales" 
            className="flex items-center gap-3 text-cyan-100 hover:bg-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 group" 
            onClick={handleNav}
          >
            <span className="text-xl">💰</span>
            <span>Ventas</span>
            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
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
      <main className="flex-1 flex flex-col min-h-screen pb-16">
        {/* Header mejorado */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg flex items-center justify-between px-6 py-4 relative z-20">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-xl hover:bg-white/20 focus:outline-none transition-all duration-300" 
              onClick={() => setSidebarOpen(true)} 
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <ModernLogo size="sm" className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-slate-800">IT360 Soluciones</h1>
                <p className="text-sm text-slate-600">
                  {userRole === 'TECNICO' ? 'Panel Técnico' : 'Panel de Administración'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-xl transition-all duration-300"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Ir al sitio</span>
            </Link>
            <Link 
              href="/catalogo" 
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-xl transition-all duration-300"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Catálogo</span>
            </Link>
            <Link 
              href="/carrito" 
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-xl transition-all duration-300"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Carrito</span>
            </Link>
          </div>
        </header>

        {/* Contenido */}
        <div className="flex-1 p-6">
          {children}
        </div>

        {/* FooterNav */}
        <FooterNav />
      </main>
    </div>
  );
} 