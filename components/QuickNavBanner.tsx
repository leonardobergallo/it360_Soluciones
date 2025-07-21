'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface QuickNavBannerProps {
  userRole: 'ADMIN' | 'TECNICO' | 'USER';
}

export default function QuickNavBanner({ userRole }: QuickNavBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Ocultar el banner después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || userRole === 'USER') {
    return null;
  }

  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform transition-all duration-500 ease-in-out">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">
                {isAdmin ? '👑' : '🔧'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm">
                ¡Bienvenido al Panel de {isAdmin ? 'Administración' : 'Técnico'}!
              </h3>
              <p className="text-xs opacity-90">
                Acceso rápido a las funciones principales
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Sitio Principal</span>
            </Link>
            
            <Link 
              href="/catalogo" 
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Catálogo</span>
            </Link>
            
            <Link 
              href="/carrito" 
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Carrito</span>
            </Link>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="flex items-center gap-1 px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
            >
              <span>✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 