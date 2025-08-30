"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";
import ModernLogo from "./ModernLogo";

export default function GlobalHeader() {
  // Estado para almacenar información del usuario
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-b border-white/30 shadow-2xl sticky top-0 z-50 min-h-[1rem] flex items-center justify-between px-4 py-3">
      {/* Logo o nombre del sitio */}
      <div className="flex items-center gap-4 sm:gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <ModernLogo size="lg" className="group-hover:scale-110 transition-transform duration-300" />
        </Link>
        
        {/* Menú de navegación interactivo */}
        <nav className="hidden md:flex items-center gap-3">
          <Link 
            href="/servicios" 
            className="group relative text-white/90 hover:text-cyan-300 transition-all duration-300 font-semibold text-sm px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 backdrop-blur-sm border border-transparent hover:border-cyan-400/30 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <span className="flex items-center gap-2">
              <span className="text-cyan-400 group-hover:scale-110 transition-transform">⚡</span>
              Servicios
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/catalogo" 
            className="group relative text-white/90 hover:text-blue-300 transition-all duration-300 font-semibold text-sm px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 backdrop-blur-sm border border-transparent hover:border-blue-400/30 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <span className="flex items-center gap-2">
              <span className="text-blue-400 group-hover:scale-110 transition-transform">🛍️</span>
              Catálogo
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/#testimonios" 
            className="group relative text-white/90 hover:text-yellow-300 transition-all duration-300 font-semibold text-sm px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20 backdrop-blur-sm border border-transparent hover:border-yellow-400/30 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
          >
            <span className="flex items-center gap-2">
              <span className="text-yellow-400 group-hover:scale-110 transition-transform">⭐</span>
              Testimonios
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/contacto" 
            className="group relative text-white/90 hover:text-green-300 transition-all duration-300 font-semibold text-sm px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-500/20 hover:to-teal-500/20 backdrop-blur-sm border border-transparent hover:border-green-400/30 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            <span className="flex items-center gap-2">
              <span className="text-green-400 group-hover:scale-110 transition-transform">💬</span>
              Contacto
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          

        </nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Botón de Dashboard para Administradores */}
        {!isLoading && user?.role === 'admin' && (
          <Link 
            href="/admin" 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-800/80 to-green-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-green-700/90 hover:to-green-600/90 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
            title="Panel de Administración"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Link>
        )}

        {/* Botón de Dashboard para Técnicos */}
        {!isLoading && user?.role === 'tecnico' && (
          <Link 
            href="/admin" 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-800/80 to-orange-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-orange-700/90 hover:to-orange-600/90 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
            title="Panel de Técnico"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        )}

        {/* Botón de Mi Cuenta */}
        <Link 
          href="/mi-cuenta" 
          className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-800/80 to-purple-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-purple-700/90 hover:to-purple-600/90 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          title="Mi cuenta"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
        
        {/* Botón de Mis Compras */}
        <Link 
          href="/mis-compras" 
          className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-800/80 to-green-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-green-700/90 hover:to-green-600/90 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          title="Mis compras"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </Link>
        
        {/* Botón de Catálogo */}
        <Link 
          href="/catalogo" 
          className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-800/80 to-blue-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-blue-700/90 hover:to-blue-600/90 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          title="Catálogo"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </Link>
        
        {/* Ícono del carrito */}
        <CartIconWithBadge />
        
        {/* Botón de logout - Mejorado y responsive */}
        <button 
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-800/80 to-red-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-red-700/90 hover:to-red-600/90 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          title="Cerrar sesión"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
        
        {/* Botón de menú móvil */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-8 h-8 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-gray-700/90 hover:to-gray-600/90 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          title="Menú"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Menú móvil desplegable interactivo */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border-b border-white/30 shadow-2xl">
          <nav className="flex flex-col p-6 space-y-3">
            <Link 
              href="/servicios" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center gap-3 text-white/90 hover:text-cyan-300 transition-all duration-300 font-semibold text-base px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 backdrop-blur-sm border border-transparent hover:border-cyan-400/30 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-cyan-400 group-hover:scale-110 transition-transform text-lg">⚡</span>
              Servicios
            </Link>
            <Link 
              href="/catalogo" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center gap-3 text-white/90 hover:text-blue-300 transition-all duration-300 font-semibold text-base px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 backdrop-blur-sm border border-transparent hover:border-blue-400/30 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-blue-400 group-hover:scale-110 transition-transform text-lg">🛍️</span>
              Catálogo
            </Link>
            <Link 
              href="/#testimonios" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center gap-3 text-white/90 hover:text-yellow-300 transition-all duration-300 font-semibold text-base px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20 backdrop-blur-sm border border-transparent hover:border-yellow-400/30 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-yellow-400 group-hover:scale-110 transition-transform text-lg">⭐</span>
              Testimonios
            </Link>
            <Link 
              href="/contacto" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center gap-3 text-white/90 hover:text-green-300 transition-all duration-300 font-semibold text-base px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-500/20 hover:to-teal-500/20 backdrop-blur-sm border border-transparent hover:border-green-400/30 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-green-400 group-hover:scale-110 transition-transform text-lg">💬</span>
              Contacto
            </Link>
            <Link 
              href="/mis-compras" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center gap-3 text-white/90 hover:text-green-300 transition-all duration-300 font-semibold text-base px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-500/20 hover:to-teal-500/20 backdrop-blur-sm border border-transparent hover:border-green-400/30 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-green-400 group-hover:scale-110 transition-transform text-lg">📋</span>
              Mis compras
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
} 
