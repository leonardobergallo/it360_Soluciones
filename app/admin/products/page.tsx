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

interface PriceComparison {
  activeProduct: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
  excelProduct: {
    id: string;
    name: string;
    price: number;
  };
  excelPrice: number;
  currentPrice: number;
  markupApplied: number;
  priceDifference: number;
  similarity: number;
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showPriceAnalysis, setShowPriceAnalysis] = useState(false);
  const [priceComparisons, setPriceComparisons] = useState<PriceComparison[]>([]);
  const [showExcelComparison, setShowExcelComparison] = useState(false);

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
    fetchPriceComparisons();
  }, []);

  const fetchPriceComparisons = async () => {
    try {
      const res = await fetch('/api/products/price-comparison');
      if (res.ok) {
        const data = await res.json();
        setPriceComparisons(data.comparisons || []);
      }
    } catch (error) {
      console.error('Error fetching price comparisons:', error);
    }
  };

  // Efecto para filtrar productos
  useEffect(() => {
    let filtered = [...products];

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtro por estado
    if (selectedStatus) {
      const isActive = selectedStatus === 'active';
      filtered = filtered.filter(product => product.active === isActive);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'basePrice':
          aValue = a.basePrice || 0;
          bValue = b.basePrice || 0;
          break;
        case 'markup':
          aValue = a.markup || 0;
          bValue = b.markup || 0;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

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
      selectedProducts: filteredProducts.map(p => p.id)
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

  // Obtener categorías únicas
  const getUniqueCategories = () => {
    const categories = products.map(p => p.category).filter(Boolean);
    return [...new Set(categories)].sort();
  };

  // Análisis de precios
  const getPriceAnalysis = () => {
    const activeProducts = products.filter(p => p.active);
    const withMarkup = activeProducts.filter(p => p.basePrice && p.markup);
    
    const totalProducts = activeProducts.length;
    const productsWithMarkup = withMarkup.length;
    const avgMarkup = withMarkup.length > 0 
      ? withMarkup.reduce((sum, p) => sum + (p.markup || 0), 0) / withMarkup.length 
      : 0;
    
    const totalValue = activeProducts.reduce((sum, p) => sum + p.price, 0);
    const totalBaseValue = withMarkup.reduce((sum, p) => sum + (p.basePrice || 0), 0);
    const totalMarkupValue = totalValue - totalBaseValue;
    
    return {
      totalProducts,
      productsWithMarkup,
      avgMarkup: avgMarkup.toFixed(1),
      totalValue: totalValue.toFixed(2),
      totalBaseValue: totalBaseValue.toFixed(2),
      totalMarkupValue: totalMarkupValue.toFixed(2),
      markupPercentage: totalBaseValue > 0 ? ((totalMarkupValue / totalBaseValue) * 100).toFixed(1) : '0'
    };
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const getProductComparison = (productId: string): PriceComparison | null => {
    return priceComparisons.find(comp => comp.activeProduct.id === productId) || null;
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
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header con título y botones - Responsive */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
            <p className="text-sm sm:text-base text-gray-600">Administrá el catálogo de productos con markup y edición en lote</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">← Ir al dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
            <button
              onClick={() => setShowBulkEdit(true)}
              disabled={products.length === 0}
              className="px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-sm hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Edición en Lote</span>
              <span className="sm:hidden">Lote</span>
            </button>
            <button
              onClick={() => { 
                setShowForm(true); 
                setEditProduct(null); 
                setForm({ name: '', description: '', price: '', basePrice: '', markup: '', stock: '', category: '' }); 
              }}
              className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-sm hover:bg-green-700 transition-all duration-300 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Nuevo Producto</span>
              <span className="sm:hidden">Nuevo</span>
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

        {/* Panel de búsqueda y filtros - Responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Búsqueda y Filtros</h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowExcelComparison(!showExcelComparison)}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">{showExcelComparison ? 'Ocultar' : 'Mostrar'} Comparación Excel</span>
                <span className="sm:hidden">{showExcelComparison ? 'Ocultar' : 'Mostrar'} Excel</span>
              </button>
              <button
                onClick={() => setShowPriceAnalysis(!showPriceAnalysis)}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">{showPriceAnalysis ? 'Ocultar' : 'Mostrar'} Análisis</span>
                <span className="sm:hidden">{showPriceAnalysis ? 'Ocultar' : 'Mostrar'} Análisis</span>
              </button>
              <button
                onClick={clearFilters}
                className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xs sm:text-sm font-medium transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-4 lg:mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base sm:text-lg"
                placeholder="Buscar por nombre, descripción o categoría..."
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 lg:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Todas las categorías</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Estado</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="name">Nombre</option>
                <option value="price">Precio Final</option>
                <option value="basePrice">Precio Base</option>
                <option value="markup">Markup</option>
                <option value="stock">Stock</option>
                <option value="category">Categoría</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Orden</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600 gap-2">
            <span>
              Mostrando {filteredProducts.length} de {products.length} productos
            </span>
            {(searchTerm || selectedCategory || selectedStatus) && (
              <span className="text-blue-600">
                Filtros activos: {[searchTerm && 'Búsqueda', selectedCategory && 'Categoría', selectedStatus && 'Estado'].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Análisis de precios - Responsive */}
        {showPriceAnalysis && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 sm:p-6 mb-6 lg:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📊 Análisis de Precios y Markup</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{getPriceAnalysis().totalProducts}</div>
                <div className="text-xs sm:text-sm text-gray-600">Productos Activos</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-green-600">{getPriceAnalysis().productsWithMarkup}</div>
                <div className="text-xs sm:text-sm text-gray-600">Con Markup</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">{getPriceAnalysis().avgMarkup}%</div>
                <div className="text-xs sm:text-sm text-gray-600">Markup Promedio</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-orange-600">${getPriceAnalysis().totalMarkupValue}</div>
                <div className="text-xs sm:text-sm text-gray-600">Valor Markup Total</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="text-base sm:text-lg font-semibold text-gray-900">${getPriceAnalysis().totalBaseValue}</div>
                <div className="text-xs sm:text-sm text-gray-600">Valor Base Total</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="text-base sm:text-lg font-semibold text-gray-900">${getPriceAnalysis().totalValue}</div>
                <div className="text-xs sm:text-sm text-gray-600">Valor Final Total</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="text-base sm:text-lg font-semibold text-gray-900">{getPriceAnalysis().markupPercentage}%</div>
                <div className="text-xs sm:text-sm text-gray-600">% Markup General</div>
              </div>
            </div>
          </div>
        )}

        {/* Comparación con precios del Excel - Responsive */}
        {showExcelComparison && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 sm:p-6 mb-6 lg:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📊 Comparación con Precios del Excel</h3>
            <div className="mb-4 text-xs sm:text-sm text-gray-600">
              <p>Comparación entre precios actuales y precios originales del Excel (productos inactivos)</p>
              <p>Total de comparaciones encontradas: <span className="font-semibold text-green-600">{priceComparisons.length}</span></p>
            </div>
            
            {priceComparisons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {priceComparisons.slice(0, 6).map((comparison, index) => (
                  <div key={comparison.activeProduct.id} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border">
                    <h4 className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm line-clamp-2">
                      {comparison.activeProduct.name}
                    </h4>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio Excel:</span>
                        <span className="font-medium text-blue-600">${comparison.excelPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio Actual:</span>
                        <span className="font-medium text-green-600">${comparison.currentPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diferencia:</span>
                        <span className={`font-medium ${comparison.priceDifference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${comparison.priceDifference.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Markup:</span>
                        <span className={`font-medium ${comparison.markupApplied >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {comparison.markupApplied.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                        Similitud: {(comparison.similarity * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <p className="text-sm sm:text-base">No se encontraron comparaciones con productos del Excel</p>
                <p className="text-xs sm:text-sm mt-1">Los productos activos no tienen equivalentes en el Excel</p>
              </div>
            )}
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

        {/* Tabla de productos - Responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Productos ({filteredProducts.length})</h2>
              </div>
              {showBulkEdit && (
                <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
                  {bulkForm.selectedProducts.length} seleccionados
                </span>
              )}
            </div>
          </div>
          
          {/* Vista de escritorio - Tabla completa */}
          <div className="hidden lg:block p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {showBulkEdit && (
                      <th className="text-left py-3 px-2 sm:px-4">
                        <input
                          type="checkbox"
                          checked={bulkForm.selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={(e) => e.target.checked ? selectAllProducts() : clearSelection()}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </th>
                    )}
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[200px]">NOMBRE</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[120px]">CATEGORÍA</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[100px]">PRECIO BASE</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[100px]">MARKUP</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[100px]">PRECIO FINAL</th>
                    {showExcelComparison && (
                      <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[150px]">COMPARACIÓN EXCEL</th>
                    )}
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[80px]">STOCK</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[80px]">ESTADO</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 min-w-[200px]">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {showBulkEdit && (
                        <td className="py-3 px-2 sm:px-4">
                          <input
                            type="checkbox"
                            checked={bulkForm.selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </td>
                      )}
                      <td className="py-3 px-2 sm:px-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{product.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">{product.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium text-sm">
                            ${product.basePrice ? product.basePrice.toFixed(2) : '-'}
                          </span>
                          {product.basePrice && (
                            <span className="text-xs text-gray-500">Base</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex flex-col">
                          <span className={`font-semibold text-sm ${
                            product.markup && product.markup > 0 
                              ? 'text-green-600' 
                              : 'text-gray-400'
                          }`}>
                            {product.markup ? `${product.markup}%` : '-'}
                          </span>
                          {product.markup && product.basePrice && (
                            <span className="text-xs text-gray-500">
                              +${(product.price - product.basePrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-green-600 text-base sm:text-lg">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.basePrice && product.markup && (
                            <span className="text-xs text-gray-500">
                              Final
                            </span>
                          )}
                        </div>
                      </td>
                      {showExcelComparison && (
                        <td className="py-3 px-2 sm:px-4">
                          {(() => {
                            const comparison = getProductComparison(product.id);
                            if (comparison) {
                              return (
                                <div className="flex flex-col space-y-1">
                                  <div className="text-xs">
                                    <span className="text-blue-600 font-medium">
                                      Excel: ${comparison.excelPrice.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="text-xs">
                                    <span className={`font-medium ${
                                      comparison.markupApplied >= 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {comparison.markupApplied.toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {(comparison.similarity * 100).toFixed(0)}% sim
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <span className="text-gray-400 text-xs">Sin comparación</span>
                            );
                          })()}
                        </td>
                      )}
                      <td className="py-3 px-2 sm:px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button
                            onClick={() => openEditForm(product)}
                            className="px-2 sm:px-3 py-1 bg-yellow-500 text-white rounded text-xs sm:text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive(product.id, product.active || false)}
                            className={`px-2 sm:px-3 py-1 text-white rounded text-xs sm:text-sm font-medium transition-colors ${
                              product.active 
                                ? 'bg-orange-500 hover:bg-orange-600' 
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {product.active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded text-xs sm:text-sm font-medium transition-colors"
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

          {/* Vista móvil - Cards */}
          <div className="lg:hidden p-4">
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {/* Header del card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    {showBulkEdit && (
                      <div className="ml-3">
                        <input
                          type="checkbox"
                          checked={bulkForm.selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <span className="text-xs text-gray-500">Categoría</span>
                      <div className="mt-1">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category || 'Sin categoría'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Estado</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Precio Base</span>
                      <div className="text-sm font-medium text-gray-900">
                        ${product.basePrice ? product.basePrice.toFixed(2) : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Markup</span>
                      <div className={`text-sm font-semibold ${
                        product.markup && product.markup > 0 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`}>
                        {product.markup ? `${product.markup}%` : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Precio Final</span>
                      <div className="text-lg font-bold text-green-600">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Stock</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comparación Excel (si está activa) */}
                  {showExcelComparison && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <span className="text-xs text-gray-500">Comparación Excel</span>
                      {(() => {
                        const comparison = getProductComparison(product.id);
                        if (comparison) {
                          return (
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-blue-600 font-medium">
                                  Excel: ${comparison.excelPrice.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className={`font-medium ${
                                  comparison.markupApplied >= 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {comparison.markupApplied.toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="mt-2 text-xs text-gray-400">Sin comparación</div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openEditForm(product)}
                      className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(product.id, product.active || false)}
                      className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium transition-colors ${
                        product.active 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {product.active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
