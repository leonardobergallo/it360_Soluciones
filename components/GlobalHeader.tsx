"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";

export default function GlobalHeader() {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");
      setIsLogged(!!token && !!userStr);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAdmin(user.role === "ADMIN");
        } catch {}
      }
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <header className="bg-white shadow flex items-center justify-between px-8 py-4 border-b">
      <div className="flex items-center gap-4">
        <Link href="/catalogo" className="text-blue-700 font-semibold hover:underline">Catálogo</Link>
        <Link href="/carrito" className="text-blue-700 font-semibold hover:underline">Carrito</Link>
        {isLogged && !isAdmin && (
          <Link href="/mi-cuenta" className="text-blue-700 font-semibold hover:underline">Mi cuenta</Link>
        )}
        {isAdmin && (
          <Link href="/admin" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold ml-2">Admin</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <CartIconWithBadge />
        {isLogged && (
          <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition">Logout</button>
        )}
      </div>
    </header>
  );
} 