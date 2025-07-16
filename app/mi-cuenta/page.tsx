"use client";
import Link from "next/link";

export default function MiCuentaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Mi cuenta</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mis datos */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <div className="mb-4 text-blue-700">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Mis datos</h2>
            <p className="text-gray-700 mb-2">Editá tus datos personales, direcciones y contraseña.</p>
            <Link href="/mi-cuenta/mis-datos" className="text-blue-600 hover:underline text-sm">Ir a Mis datos</Link>
          </div>
          {/* Mis compras */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <div className="mb-4 text-blue-700">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Mis compras</h2>
            <p className="text-gray-700 mb-2">Seguí el estado de tus compras y consultá tus facturas.</p>
            <Link href="/mis-compras" className="text-blue-600 hover:underline text-sm">Ir a Mis compras</Link>
          </div>
          {/* Centro de ayuda */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <div className="mb-4 text-blue-700">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Centro de ayuda</h2>
            <p className="text-gray-700 mb-2">Realizá consultas y reclamos. Contactanos para poder ayudarte.</p>
            <Link href="/mi-cuenta/centro-ayuda" className="text-blue-600 hover:underline text-sm">Ir al Centro de ayuda</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 