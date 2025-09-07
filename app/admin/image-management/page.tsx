"use client";

import AdminLayout from '@/components/AdminLayout';
import ImageManager from '@/components/ImageManager';
import ImageUploader from '@/components/ImageUploader';
import { useState, useEffect } from 'react';

interface ImageStats {
  totalProducts: number;
  withCustomImages: number;
  withDefaultImages: number;
  withoutImages: number;
  incorrectImages: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
}

export default function ImageManagementPage() {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
        
        const stats: ImageStats = {
          totalProducts: productsData.length,
          withCustomImages: productsData.filter(p => 
            p.image && p.image.includes('/images/') && !p.image.includes('/servicio-')
          ).length,
          withDefaultImages: productsData.filter(p => 
            p.image && (p.image.includes('/servicio-') || p.image.includes('unsplash'))
          ).length,
          withoutImages: productsData.filter(p => !p.image || p.image === 'USE_NAME').length,
          incorrectImages: productsData.filter(p => 
            p.image && (
              (p.image.includes('apple-watch') && !p.name.toLowerCase().includes('watch')) ||
              (p.image.includes('auricular') && !p.name.toLowerCase().includes('auricular')) ||
              (p.image.includes('monitor') && !p.name.toLowerCase().includes('monitor'))
            )
          ).length
        };
        
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías únicas
  const categories = ['todas', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'todas' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = (imagePath: string) => {
    // Actualizar la lista de productos después de subir una imagen
    fetchData();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando gestión de imágenes...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🖼️ Gestión de Imágenes
              </h1>
              <p className="text-gray-600">
                Administra y corrige las imágenes de los productos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowUploader(!showUploader)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showUploader ? '❌ Cancelar' : '📸 Subir Imagen'}
              </button>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Subidor de imágenes */}
        {showUploader && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📸 Subir Nueva Imagen
              </h2>
              <ImageUploader 
                onUpload={() => {}}
                onUploadComplete={handleImageUpload}
              />
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔍 Filtros
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'todas' ? 'Todas las categorías' : category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar producto
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre del producto..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredProducts.length} de {products.length} productos
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Con Imagen Personalizada</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.withCustomImages}</p>
                  <p className="text-xs text-gray-500">
                    {((stats.withCustomImages / stats.totalProducts) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Con Imagen por Defecto</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.withDefaultImages}</p>
                  <p className="text-xs text-gray-500">
                    {((stats.withDefaultImages / stats.totalProducts) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sin Imagen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.withoutImages}</p>
                  <p className="text-xs text-gray-500">
                    {((stats.withoutImages / stats.totalProducts) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <span className="text-2xl">🔧</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imágenes Incorrectas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.incorrectImages}</p>
                  <p className="text-xs text-gray-500">
                    {((stats.incorrectImages / stats.totalProducts) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestor de imágenes */}
        <ImageManager className="mb-8" />

        {/* Lista de productos filtrados */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              📋 Productos ({filteredProducts.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image && product.image !== 'USE_NAME' ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <p className="text-xs text-gray-500">${product.price.toLocaleString()}</p>
                      <div className="mt-1">
                        {product.image === 'USE_NAME' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Sin imagen
                          </span>
                        ) : product.image && product.image.includes('/images/') ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Con imagen
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Imagen por defecto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Consejos para Gestión de Imágenes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Imágenes Correctas</h4>
              <ul className="space-y-1">
                <li>• Usa imágenes de alta calidad (mínimo 400x400px)</li>
                <li>• Mantén consistencia en el estilo visual</li>
                <li>• Verifica que la imagen corresponda al producto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Optimización</h4>
              <ul className="space-y-1">
                <li>• Comprime las imágenes para web</li>
                <li>• Usa formatos WebP cuando sea posible</li>
                <li>• Mantén nombres de archivo descriptivos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}