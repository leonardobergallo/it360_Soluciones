"use client";
import Link from "next/link";
import CartIconWithBadge from "@/components/CartIconWithBadge";
import ModernLogo from "./ModernLogo";

export default function GlobalHeader() {
  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg sticky top-0 z-50 min-h-[1rem] flex items-center justify-between px-4 py-3">
      {/* Logo o nombre del sitio */}
      <div className="flex items-center gap-4 sm:gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <ModernLogo size="md" className="group-hover:scale-110 transition-transform duration-300" />
        </Link>
        <Link 
          href="/hogar-inteligente" 
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-xl border border-white/30 px-4 py-2 rounded-xl hover:from-purple-500/90 hover:to-pink-500/90 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
        >
          <span className="text-lg">🏠</span>
          <span className="text-white font-bold text-sm group-hover:text-white transition-colors">
            Hogar Inteligente
          </span>
          <span className="text-xs text-white/80 group-hover:text-white/90 transition-colors">
            🤖
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
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
      </div>
    </header>
  );
} 