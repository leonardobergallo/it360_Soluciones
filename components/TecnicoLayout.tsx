import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import FooterNav from './FooterNav';

interface TecnicoLayoutProps {
  children: ReactNode;
}

export default function TecnicoLayout({ children }: TecnicoLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleNav = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar responsive */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <aside className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gradient-to-b from-green-800 to-green-600 shadow-lg p-0 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col items-center py-8 border-b border-green-700">
          <Image src="/icono.png" alt="IT360 Logo" width={60} height={60} className="rounded-xl mb-2" />
          <h2 className="text-xl font-bold text-white tracking-wide">IT360 Técnico</h2>
          <span className="text-xs text-green-200">Panel técnico</span>
        </div>
        <nav className="flex flex-col gap-1 mt-8 px-4">
          <Link href="/admin/presupuestos" className="text-green-100 hover:bg-green-700 rounded-lg px-4 py-2 transition" onClick={handleNav}>Presupuestos</Link>
        </nav>
      </aside>
      {/* Main content con header superior */}
      <main className="flex-1 p-0 flex flex-col min-h-screen pb-16">
        <header className="bg-white shadow flex items-center justify-between px-4 md:px-8 py-4 border-b relative">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa solo en móvil */}
            <button className="md:hidden mr-2 p-2 rounded hover:bg-green-100 focus:outline-none" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
              <svg className="w-7 h-7 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Image src="/icono.png" alt="IT360 Logo" width={36} height={36} className="rounded" />
            <span className="text-lg font-bold text-green-800">IT360 Soluciones</span>
            <span className="text-sm text-gray-400 ml-2">Panel Técnico</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-green-700 hover:underline">Ir al sitio</Link>
            <Link href="/catalogo" className="text-green-700 hover:underline">Catálogo</Link>
            <Link href="/carrito" className="text-green-700 hover:underline">Carrito</Link>
          </div>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
        {/* FooterNav: navegación inferior homogénea */}
        <FooterNav />
      </main>
    </div>
  );
} 
