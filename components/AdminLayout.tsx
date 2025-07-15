import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import FooterNav from './FooterNav'; // Importar el footer global

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
    <div className="min-h-screen flex">
      {/* Sidebar responsive */}
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <aside className={`fixed md:static z-50 top-0 left-0 h-full w-64 
        ${userRole === 'TECNICO' ? 'bg-gradient-to-b from-green-700 to-green-500' : 'bg-gradient-to-b from-blue-800 to-blue-600'}
        shadow-lg p-0 flex flex-col transform transition-transform duration-300 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col items-center py-8 border-b border-blue-700">
          <Image src="/icono.png" alt="IT360 Logo" width={60} height={60} className="rounded-xl mb-2" />
          <h2 className={`text-xl font-bold tracking-wide ${userRole === 'TECNICO' ? 'text-green-100' : 'text-white'}`}> 
            IT360 {userRole === 'TECNICO' ? 'Técnico' : 'Admin'}
          </h2>
          <span className={`text-xs ${userRole === 'TECNICO' ? 'text-green-200' : 'text-blue-200'}`}> 
            {userRole === 'TECNICO' ? 'Panel técnico' : 'Panel de gestión'}
          </span>
        </div>
        <nav className="flex flex-col gap-1 mt-8 px-4">
          <Link href="/admin" className="text-white hover:bg-blue-700 rounded-lg px-4 py-2 font-medium transition" onClick={handleNav}>Dashboard</Link>
          {userRole === 'ADMIN' && (
            <Link href="/admin/users" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition" onClick={handleNav}>Usuarios</Link>
          )}
          <Link href="/admin/services" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition" onClick={handleNav}>Servicios</Link>
          <Link href="/admin/products" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition" onClick={handleNav}>Productos</Link>
          <Link href="/admin/sales" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition" onClick={handleNav}>Ventas</Link>
        </nav>
      </aside>
      {/* Main content con header superior */}
      <main className="flex-1 p-0 flex flex-col min-h-screen pb-16">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg flex items-center justify-between px-4 md:px-8 py-4 relative z-20">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa solo en móvil */}
            <button className="md:hidden mr-2 p-2 rounded-lg hover:bg-white/10 focus:outline-none transition-colors" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Image src="/icono.png" alt="IT360 Logo" width={36} height={36} className="rounded" />
            <span className="text-lg font-bold text-white">IT360 Soluciones</span>
            <span className="text-sm text-blue-200 ml-2">
              {userRole === 'TECNICO' ? 'Panel Técnico' : 'Panel de Administración'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-200 hover:text-white transition-colors">Ir al sitio</Link>
            <Link href="/catalogo" className="text-blue-200 hover:text-white transition-colors">Catálogo</Link>
            <Link href="/carrito" className="text-blue-200 hover:text-white transition-colors">Carrito</Link>
          </div>
        </header>
        <div className="flex-1">
          {children}
        </div>
        {/* FooterNav: navegación inferior homogénea para admin y usuarios */}
        <FooterNav />
      </main>
    </div>
  );
} 