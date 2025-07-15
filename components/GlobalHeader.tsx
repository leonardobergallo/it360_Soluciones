"use client";
import Link from "next/link";
import Image from "next/image";
// import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";

export default function GlobalHeader() {
  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg sticky top-0 z-50 min-h-[1rem] flex items-center justify-between px-4 py-3">
      {/* Logo o nombre del sitio */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/icono.png" alt="Logo IT360" width={32} height={32} className="rounded-lg group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all duration-300">
            IT360 Soluciones
          </span>
        </Link>
        <Link 
          href="/hogar-inteligente" 
          className="text-white/70 hover:text-cyan-400 font-semibold transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-white/10"
        >
          Hogar Inteligente
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Ícono del carrito */}
        <CartIconWithBadge />
        {/* Mostrar botón de logout solo si el usuario está logueado */}
      </div>
    </header>
  );
} 