import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar mejorado */}
      <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 shadow-lg p-0 flex flex-col">
        <div className="flex flex-col items-center py-8 border-b border-blue-700">
          <Image src="/icono.png" alt="IT360 Logo" width={60} height={60} className="rounded-xl mb-2" />
          <h2 className="text-xl font-bold text-white tracking-wide">IT360 Admin</h2>
          <span className="text-xs text-blue-200">Panel de gestión</span>
        </div>
        <nav className="flex flex-col gap-1 mt-8 px-4">
          <Link href="/admin" className="text-white hover:bg-blue-700 rounded-lg px-4 py-2 font-medium transition">Dashboard</Link>
          <Link href="/admin/users" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition">Usuarios</Link>
          <Link href="/admin/services" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition">Servicios</Link>
          <Link href="/admin/products" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition">Productos</Link>
          <Link href="/admin/sales" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition">Ventas</Link>
          <Link href="/admin/contacts" className="text-blue-100 hover:bg-blue-700 rounded-lg px-4 py-2 transition">Contactos</Link>
        </nav>
      </aside>
      {/* Main content con header superior */}
      <main className="flex-1 p-0 flex flex-col min-h-screen">
        <header className="bg-white shadow flex items-center justify-between px-8 py-4 border-b">
          <div className="flex items-center gap-3">
            <Image src="/icono.png" alt="IT360 Logo" width={36} height={36} className="rounded" />
            <span className="text-lg font-bold text-blue-800">IT360 Soluciones</span>
            <span className="text-sm text-gray-400 ml-2">Panel de Administración</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-700 hover:underline">Ir al sitio</Link>
            <Link href="/catalogo" className="text-blue-700 hover:underline">Catálogo</Link>
            <Link href="/carrito" className="text-blue-700 hover:underline">Carrito</Link>
            <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition">Logout</button>
          </div>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 