"use client";
import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Protección para técnicos
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'TECNICO') {
          localStorage.setItem('toastMsg', 'Acceso denegado: solo puedes ver presupuestos.');
          router.push('/admin/presupuestos');
        }
      } catch {}
    }
  }, [router]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) {
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al crear producto');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', stock: '' });
      setError(null);
      // Refrescar lista
      const productsRes = await fetch('/api/products');
      setProducts(await productsRes.json());
    } catch {
      setError('Error al crear producto');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock || !editProduct) {
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editProduct.id, ...form }),
      });
      if (!res.ok) throw new Error('Error al actualizar producto');
      setEditProduct(null);
      setShowForm(false);
      setForm({ name: '', description: '', price: '', stock: '' });
      setError(null);
      // Refrescar lista
      const productsRes = await fetch('/api/products');
      setProducts(await productsRes.json());
    } catch {
      setError('Error al actualizar producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        const res = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Error al eliminar producto');
        // Refrescar lista
        const productsRes = await fetch('/api/products');
        setProducts(await productsRes.json());
      } catch {
        setError('Error al eliminar producto');
      }
    }
  };

  const openEditForm = (product: Product) => {
    setEditProduct(product);
    setForm({ 
      name: product.name, 
      description: product.description, 
      price: String(product.price), 
      stock: String(product.stock) 
    });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
        
        <div className="relative z-10 p-8">
          {/* Header con glassmorphism */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Gestión de Productos
                </h1>
                <p className="text-blue-200/80 mt-2">Administra el catálogo de productos de IT360</p>
              </div>
              <a 
                href="/admin" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12l6-6M3 12l6 6" />
                </svg>
                Ir al dashboard
              </a>
            </div>
          </div>

          {/* Botón Nuevo Producto */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Productos</h2>
            <button
              onClick={() => { 
                setShowForm(true); 
                setEditProduct(null); 
                setForm({ name: '', description: '', price: '', stock: '' }); 
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Producto
            </button>
          </div>

          {/* Formulario con glassmorphism */}
          {showForm && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl animate-fadeIn">
              <h3 className="text-xl font-bold text-white mb-6">
                {editProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <form onSubmit={editProduct ? handleEditProduct : handleAddProduct} className="space-y-6 max-w-2xl">
                {error && (
                  <div className="backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-red-200">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                      placeholder="Nombre del producto"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Precio</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Descripción</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="Descripción del producto"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editProduct ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { 
                      setShowForm(false); 
                      setEditProduct(null); 
                      setForm({ name: '', description: '', price: '', stock: '' }); 
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabla de productos */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <Table
              data={products}
              columns={[
                { key: 'name', label: 'Nombre' },
                { key: 'description', label: 'Descripción' },
                { key: 'price', label: 'Precio' },
                { key: 'stock', label: 'Stock' },
              ]}
              actions={(row) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(row)}
                    className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs font-medium backdrop-blur-sm border border-white/20"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(row.id.toString())}
                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs font-medium backdrop-blur-sm border border-white/20"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
} 