"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

// Interfaz para el tipo de usuario
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TECNICO' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0,
    admins: 0,
    tecnicos: 0,
    clientes: 0,
    products: 0,
    services: 0,
    sales: 0,
    contacts: 0,
    tickets: 0,
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
          fetch("/api/tickets").then(r => r.ok ? r.json() : []),
        ]);

        const [users, products, services, sales, contacts, tickets] = results.map(result => {
          if (result.status === 'fulfilled') {
            return Array.isArray(result.value) ? result.value : [];
          }
          return [];
        });

        // Contar usuarios por rol - CORREGIDO: usar roles en mayúsculas
        const admins = users.filter((user: User) => user.role === 'ADMIN').length;
        const tecnicos = users.filter((user: User) => user.role === 'TECNICO').length;
        const clientes = users.filter((user: User) => user.role === 'USER').length; // USER = clientes

        setCounts({
          users: users.length,
          admins,
          tecnicos,
          clientes,
          products: products.length,
          services: services.length,
          sales: sales.length,
          contacts: contacts.length,
          tickets: tickets.length,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching counts:', err);
        setError('Error al cargar los datos del dashboard');
        setCounts({
          users: 0,
          admins: 0,
          tecnicos: 0,
          clientes: 0,
          products: 0,
          services: 0,
          sales: 0,
          contacts: 0,
          tickets: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const metricCards = [
    { 
      label: "Total Usuarios", 
      count: counts.users, 
      icon: "👥",
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100"
    },
    { 
      label: "Administradores", 
      count: counts.admins, 
      icon: "⚙️",
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100"
    },
    { 
      label: "Técnicos", 
      count: counts.tecnicos, 
      icon: "⭐",
      color: "bg-pink-50 text-pink-600",
      iconBg: "bg-pink-100"
    },
    { 
      label: "Clientes", 
      count: counts.clientes, 
      icon: "👤",
      color: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100"
    },
  ];

  const actionCards = [
    { label: "Productos", count: counts.products, href: "/admin/products", color: "bg-green-50 text-green-800", icon: "📦" },
    { label: "Subir Excel", count: "Productos", href: "/admin/upload-products", color: "bg-blue-50 text-blue-800", icon: "📊" },
    { label: "Servicios", count: counts.services, href: "/admin/services", color: "bg-yellow-50 text-yellow-800", icon: "🔧" },
    { label: "Tickets", count: counts.tickets, href: "/admin/tickets", color: "bg-indigo-50 text-indigo-800", icon: "🎫" },
    { label: "Ventas", count: counts.sales, href: "/admin/sales", color: "bg-purple-50 text-purple-800", icon: "💰" },
    { label: "Contactos", count: counts.contacts, href: "/admin/contacts", color: "bg-pink-50 text-pink-800", icon: "📞" },
    { label: "Transferencias", count: "Gestionar", href: "/admin/transferencias", color: "bg-orange-50 text-orange-800", icon: "💳" },
  ];

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="p-6">
        {/* Botón de volver al sitio principal */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-lg">🏠</span>
            <span>Volver al Sitio Principal</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Tarjetas de métricas en la parte superior */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de acciones */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Panel de Administración</h2>
          </div>
          <p className="text-white/90 mb-6">Gestioná todos los aspectos del sistema desde aquí. Seleccioná una sección para comenzar.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actionCards.map(card => (
              <Link href={card.href} key={card.label} className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{card.icon}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${card.color}`}>
                    {typeof card.count === 'number' ? `${card.count} items` : card.count}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.label}</h3>
                <p className="text-gray-600 text-sm">Gestionar {card.label.toLowerCase()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
} 
