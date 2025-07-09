"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";

export default function GlobalHeader() {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-700">
              IT360
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/catalogo" className="text-blue-700 font-semibold hover:underline transition-colors">
              Catálogo
            </Link>
            <Link href="/carrito" className="text-blue-700 font-semibold hover:underline transition-colors">
              Carrito
            </Link>
            {isLogged && !isAdmin && (
              <Link href="/mi-cuenta" className="text-blue-700 font-semibold hover:underline transition-colors">
                Mi cuenta
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <CartIconWithBadge />
            {isLogged && (
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIconWithBadge />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href="/catalogo" 
            className="block px-3 py-2 text-blue-700 font-semibold hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link 
            href="/carrito" 
            className="block px-3 py-2 text-blue-700 font-semibold hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Carrito
          </Link>
          {isLogged && !isAdmin && (
            <Link 
              href="/mi-cuenta" 
              className="block px-3 py-2 text-blue-700 font-semibold hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mi cuenta
            </Link>
          )}
          {isAdmin && (
            <Link 
              href="/admin" 
              className="block px-3 py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          {isLogged && (
            <button 
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 