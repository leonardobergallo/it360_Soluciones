"use client";
import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import PriceCalculator from '@/components/PriceCalculator';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  basePrice?: number;
  markup?: number;
  stock: number;
  category: string;
  image?: string;
  active?: boolean;
}

interface BulkEditForm {
  selectedProducts: string[];
  basePrice?: number;
  markup?: number;
  stock?: number;
  active?: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    basePrice: '', 
    markup: '', 
    stock: '', 
    category: '' 
  });
  const [bulkForm, setBulkForm] = useState<BulkEditForm>({
    selectedProducts: [],
    basePrice: undefined,
    markup: undefined,
    stock: undefined,
    active: undefined
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        console.log('Productos cargados:', data);
        setProducts(data);
      } else {
        console.error('Error cargando productos:', res.status);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) {
      setError('Los campos nombre, descripción, precio y stock son obligatorios');
      return;
    }
    
    setLoading(true);
    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        basePrice: form.basePrice ? parseFloat(form.basePrice) : undefined,
        markup: form.markup ? parseFloat(form.markup) : undefined,
        stock: parseInt(form.stock),
        category: form.category || 'general'
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (!res.ok) throw new Error('Error al crear producto');
      
      setSuccess('Producto creado exitosamente');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', basePrice: '', markup: '', stock: '', category: '' });
      setError(null);
      fetchProducts();
    } catch (error) {
      setError('Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock || !editProduct) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    setLoading(true);
    try {
      const productData = {
        id: editProduct.id,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        basePrice: form.basePrice ? parseFloat(form.basePrice) : undefined,
        markup: form.markup ? parseFloat(form.markup) : undefined,
        stock: parseInt(form.stock),
        category: form.category || 'general'
      };

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (!res.ok) throw new Error('Error al actualizar producto');
      
      setSuccess('Producto actualizado exitosamente');
      setEditProduct(null);
      setShowForm(false);
      setForm({ name: '', description: '', price: '', basePrice: '', markup: '', stock: '', category: '' });
      setError(null);
      fetchProducts();
    } catch (error) {
      setError('Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkForm.selectedProducts.length === 0) {
      setError('Debes seleccionar al menos un producto');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        productIds: bulkForm.selectedProducts,
        updates: {
          ...(bulkForm.basePrice !== undefined && { basePrice: bulkForm.basePrice }),
          ...(bulkForm.markup !== undefined && { markup: bulkForm.markup }),
          ...(bulkForm.stock !== undefined && { stock: bulkForm.stock }),
          ...(bulkForm.active !== undefined && { active: bulkForm.active })
        }
      };

      const res = await fetch('/api/products/bulk-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) throw new Error('Error al actualizar productos');
      
      setSuccess(`${bulkForm.selectedProducts.length} productos actualizados exitosamente`);
      setShowBulkEdit(false);
      setBulkForm({ selectedProducts: [], basePrice: undefined, markup: undefined, stock: undefined, active: undefined });
      setError(null);
      fetchProducts();
    } catch (error) {
      setError('Error al actualizar productos');
    } finally {
      setLoading(false);
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
        setSuccess('Producto eliminado exitosamente');
        fetchProducts();
      } catch (error) {
        setError('Error al eliminar producto');
      }
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (!res.ok) throw new Error('Error al actualizar producto');
      setSuccess('Estado del producto actualizado');
      fetchProducts();
    } catch (error) {
      setError('Error al actualizar producto');
    }
  };

  const openEditForm = (product: Product) => {
    setEditProduct(product);
    setForm({ 
      name: product.name, 
      description: product.description, 
      price: String(product.price), 
      basePrice: product.basePrice ? String(product.basePrice) : '',
      markup: product.markup ? String(product.markup) : '',
      stock: String(product.stock),
      category: product.category || ''
    });
    setShowForm(true);
  };

  const toggleProductSelection = (productId: string) => {
    setBulkForm(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  const selectAllProducts = () => {
    setBulkForm(prev => ({
      ...prev,
      selectedProducts: products.map(p => p.id)
    }));
  };

  const clearSelection = () => {
    setBulkForm(prev => ({
      ...prev,
      selectedProducts: []
    }));
  };

  const calculateFinalPrice = (basePrice: number, markup: number) => {
    return basePrice * (1 + markup / 100);
  };

  // Limpiar mensajes después de 3 segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header con título y botones */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
            <p className="text-gray-600">Administrá el catálogo de productos con markup y edición en lote</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ← Ir al dashboard
            </Link>
            <button
              onClick={() => setShowBulkEdit(true)}
              disabled={products.length === 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-sm hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edición en Lote
            </button>
            <button
              onClick={() => { 
                setShowForm(true); 
                setEditProduct(null); 
                setForm({ name: '', description: '', price: '', basePrice: '', markup: '', stock: '', category: '' }); 
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-sm hover:bg-green-700 transition-all duration-300"
            >
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Mensajes de éxito y error */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Formulario de edición en lote */}
        {showBulkEdit && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edición en Lote</h2>
            <form onSubmit={handleBulkEdit} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={selectAllProducts}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Seleccionar Todos
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                >
                  Limpiar Selección
                </button>
                <span className="text-sm text-gray-600">
                  {bulkForm.selectedProducts.length} productos seleccionados
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Base</label>
                  <input
                    type="number"
                    step="0.01"
                    value={bulkForm.basePrice || ''}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, basePrice: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Precio base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Markup (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bulkForm.markup || ''}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, markup: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Porcentaje markup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={bulkForm.stock || ''}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, stock: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Cantidad stock"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={bulkForm.active === undefined ? '' : bulkForm.active ? 'true' : 'false'}
                    onChange={(e) => setBulkForm(prev => ({ 
                      ...prev, 
                      active: e.target.value === '' ? undefined : e.target.value === 'true' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Sin cambiar</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || bulkForm.selectedProducts.length === 0}
                  className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Actualizando...' : `Actualizar ${bulkForm.selectedProducts.length} productos`}
                </button>
                <button
                  type="button"
                  onClick={() => { 
                    setShowBulkEdit(false); 
                    setBulkForm({ selectedProducts: [], basePrice: undefined, markup: undefined, stock: undefined, active: undefined }); 
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario individual */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={editProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Categoría del producto"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Descripción del producto"
                  required
                />
              </div>
              
              {/* Calculadora de Precios */}
              <PriceCalculator
                basePrice={Number(form.basePrice) || 0}
                markup={Number(form.markup) || 0}
                category={form.category}
                onPriceChange={(price) => setForm({ ...form, price: price.toString() })}
                onMarkupChange={(markup) => setForm({ ...form, markup: markup.toString() })}
                className="mb-6"
              />
              
              {/* Campos manuales como respaldo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Base (Manual)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="basePrice"
                    value={form.basePrice}
                    onChange={e => setForm({ ...form, basePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Precio base sin markup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Markup % (Manual)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="markup"
                    value={form.markup}
                    onChange={e => setForm({ ...form, markup: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Porcentaje markup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Final (Manual)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Precio final"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : (editProduct ? 'Actualizar Producto' : 'Crear Producto')}
                </button>
                <button
                  type="button"
                  onClick={() => { 
                    setShowForm(false); 
                    setEditProduct(null); 
                    setForm({ name: '', description: '', price: '', basePrice: '', markup: '', stock: '', category: '' }); 
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Productos ({products.length})</h2>
              </div>
              {showBulkEdit && (
                <span className="text-white text-sm">
                  {bulkForm.selectedProducts.length} seleccionados
                </span>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {showBulkEdit && (
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={bulkForm.selectedProducts.length === products.length && products.length > 0}
                          onChange={(e) => e.target.checked ? selectAllProducts() : clearSelection()}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </th>
                    )}
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">NOMBRE</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">CATEGORÍA</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">PRECIO BASE</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">MARKUP</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">PRECIO FINAL</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">STOCK</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">ESTADO</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {showBulkEdit && (
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={bulkForm.selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">
                          ${product.basePrice ? product.basePrice.toFixed(2) : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">
                          {product.markup ? `${product.markup}%` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(product)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive(product.id, product.active || false)}
                            className={`px-3 py-1 text-white rounded-lg text-sm font-medium transition-colors ${
                              product.active 
                                ? 'bg-orange-500 hover:bg-orange-600' 
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {product.active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
