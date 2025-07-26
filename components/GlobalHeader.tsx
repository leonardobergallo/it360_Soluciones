"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";
import ModernLogo from "./ModernLogo";

export default function GlobalHeader() {
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
