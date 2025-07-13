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
    <Link href="/carrito" className="relative inline-block">
      {/* Ícono clásico de carrito de compras */}
      <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h2l.4 2M7 6h14l-1.68 8.39a2 2 0 01-2 1.61H7.42a2 2 0 01-2-1.61L3 4H21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-bounce">
          {count}
        </span>
      )}
    </Link>
  );
}