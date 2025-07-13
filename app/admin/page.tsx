"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    services: 0,
    sales: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const results = await Promise.allSettled([
          fetch("/api/users").then(r => r.ok ? r.json() : []),
          fetch("/api/products").then(r => r.ok ? r.json() : []),
          fetch("/api/services").then(r => r.ok ? r.json() : []),
          fetch("/api/sales").then(r => r.ok ? r.json() : []),
          fetch("/api/contact").then(r => r.ok ? r.json() : []),
        ]);

        const [users, products, services, sales, contacts] = results.map(result => {
          if (result.status === 'fulfilled') {
            return Array.isArray(result.value) ? result.value : [];
          }
          return [];
        });

        setCounts({
          users: users.length,
          products: products.length,
          services: services.length,
          sales: sales.length,
          contacts: contacts.length,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching counts:', err);
        setError('Error al cargar los datos del dashboard');
        setCounts({
          users: 0,
          products: 0,
          services: 0,
          sales: 0,
          contacts: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const cards = [
    { label: "Usuarios", count: counts.users, href: "/admin/users", color: "bg-blue-100 text-blue-800" },
    { label: "Productos", count: counts.products, href: "/admin/products", color: "bg-green-100 text-green-800" },
    { label: "Servicios", count: counts.services, href: "/admin/services", color: "bg-yellow-100 text-yellow-800" },
    { label: "Ventas", count: counts.sales, href: "/admin/sales", color: "bg-purple-100 text-purple-800" },
    { label: "Contactos", count: counts.contacts, href: "/admin/contacts", color: "bg-pink-100 text-pink-800" },
  ];

  return (
    <AuthGuard requiredRole="ADMIN">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/" className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition-all">Volver al inicio</Link>
        </div>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">¡Bienvenido al panel de administración de IT360!</h2>
          <p className="text-gray-700 mb-1">Desde aquí puedes gestionar usuarios, productos, servicios, ventas y contactos.</p>
          <p className="text-gray-500 text-sm">Haz clic en cualquier tarjeta para ver o administrar la sección correspondiente.</p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg text-gray-600">Cargando datos del dashboard...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cards.map(card => (
              <Link href={card.href} key={card.label} className={`block rounded-lg shadow p-8 text-center transition hover:scale-105 cursor-pointer ${card.color}`}>
                <div className="text-4xl font-bold mb-2">{card.count}</div>
                <div className="text-lg font-semibold">{card.label}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
} 