"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartIconWithBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function updateCount() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setCount(0);
        return;
      }
      try {
        const res = await fetch('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const total = (data.items || []).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
          setCount(total);
        } else {
          setCount(0);
        }
      } catch {
        setCount(0);
      }
    }
    updateCount();
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/carrito" className="relative inline-block">
      <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-bounce">
          {count}
        </span>
      )}
    </Link>
  );
} 