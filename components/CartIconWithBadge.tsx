"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartIconWithBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function updateCount() {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Usuario logueado: obtener del backend
        try {
          const res = await fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const total = (data.items || []).reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 1), 0);
            setCount(total);
          } else if (res.status === 401) {
            // Token expirado o inválido - limpiar y usar localStorage
            console.log('Token expirado, usando carrito local');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Continuar con localStorage
            try {
              const stored = localStorage.getItem('carrito');
              if (stored) {
                const cart = JSON.parse(stored);
                const total = cart.reduce((acc: number, item: { quantity?: number; type?: string }) => {
                  if (item.type !== 'cotizacion') {
                    return acc + (item.quantity || 1);
                  }
                  return acc;
                }, 0);
                setCount(total);
              } else {
                setCount(0);
              }
            } catch {
              setCount(0);
            }
          } else {
            setCount(0);
          }
        } catch {
          setCount(0);
        }
      } else {
        // Usuario no logueado: obtener del localStorage
        try {
          const stored = localStorage.getItem('carrito');
          if (stored) {
            const cart = JSON.parse(stored);
            const total = cart.reduce((acc: number, item: { quantity?: number; type?: string }) => {
              if (item.type !== 'cotizacion') {
                return acc + (item.quantity || 1);
              }
              return acc;
            }, 0);
            setCount(total);
          } else {
            setCount(0);
          }
        } catch {
          setCount(0);
        }
      }
    }
    updateCount();
    // Reducir la frecuencia de actualización para evitar muchos errores 401
    const interval = setInterval(updateCount, 5000); // Cambiar de 1 segundo a 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/carrito" className="relative inline-block group">
      {/* Ícono futurista de carrito de compras - Responsive */}
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-lg md:rounded-xl border border-white/30 flex items-center justify-center hover:from-slate-700/90 hover:to-slate-600/90 hover:border-white/50 transition-all duration-300 group-hover:scale-110 shadow-lg hover:shadow-xl">
        <svg className="w-4 h-4 md:w-6 md:h-6 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h2l.4 2M7 6h14l-1.68 8.39a2 2 0 01-2 1.61H7.42a2 2 0 01-2-1.61L3 4H21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-1 md:px-2.5 md:py-1.5 shadow-xl animate-pulse border-2 border-white/30 backdrop-blur-sm min-w-[16px] md:min-w-[20px] text-center">
          {count}
        </span>
      )}
    </Link>
  );
}