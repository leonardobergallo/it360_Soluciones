"use client";
import Link from "next/link";
// import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";

export default function GlobalHeader() {
  return (
    <header className="bg-white shadow border-b sticky top-0 z-50 min-h-[1rem] flex items-center justify-between px-4 py-2">
      {/* Logo o nombre del sitio */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-blue-800 font-bold text-lg">IT360 Soluciones</Link>
        <Link href="/hogar-inteligente" className="text-blue-700 font-semibold hover:underline transition">Hogar Inteligente</Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Ícono del carrito */}
        <CartIconWithBadge />
        {/* Mostrar botón de logout solo si el usuario está logueado */}
      </div>
    </header>
  );
} 