"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";

export default function GlobalHeader() {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="bg-white shadow border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            <span role="img" aria-label="menu">☰</span>
          </button>
          {/* Logo y texto IT360 eliminados */}
        </div>
        {/* Menú escritorio oculto, se moverá al footer */}
        <div className="md:hidden flex items-center gap-2">
          <CartIconWithBadge />
        </div>
      </div>
      {/* Menú móvil bandoneón (opcional, puede eliminarse si solo se usa footer) */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t shadow-lg animate-fadeIn flex flex-col gap-2 px-6 py-4">
          <Link href="/catalogo" className="py-2 border-b hover:text-blue-700 font-medium" onClick={() => setMenuOpen(false)}>Catálogo</Link>
          <Link href="/carrito" className="py-2 border-b hover:text-blue-700 font-medium" onClick={() => setMenuOpen(false)}>Carrito</Link>
          {isLogged && !isAdmin && (
            <Link href="/mi-cuenta" className="py-2 border-b hover:text-blue-700 font-medium" onClick={() => setMenuOpen(false)}>Mi cuenta</Link>
          )}
          {!isLogged && (
            <Link href="/login" className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium shadow mt-2" onClick={() => setMenuOpen(false)}>
              <span role="img" aria-label="Login">🔑</span> Login
            </Link>
          )}
          {isLogged && (
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition mt-2">Logout</button>
          )}
        </nav>
      )}
    </header>
  );
} 