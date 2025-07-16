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
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/carrito" className="relative inline-block group">
      {/* Ícono futurista de carrito de compras - Mejorado */}
      <div className="w-10 h-10 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center hover:from-slate-700/90 hover:to-slate-600/90 hover:border-white/50 transition-all duration-300 group-hover:scale-110 shadow-lg hover:shadow-xl">
        <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h2l.4 2M7 6h14l-1.68 8.39a2 2 0 01-2 1.61H7.42a2 2 0 01-2-1.61L3 4H21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {count > 0 && (
        <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full px-2.5 py-1.5 shadow-xl animate-pulse border-2 border-white/30 backdrop-blur-sm min-w-[20px] text-center">
          {count}
        </span>
      )}
    </Link>
  );
}