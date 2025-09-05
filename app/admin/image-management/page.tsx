"use client";

import AdminLayout from '@/components/AdminLayout';
import ImageManager from '@/components/ImageManager';
import { useState, useEffect } from 'react';

interface ImageStats {
  totalProducts: number;
  withCustomImages: number;
  withDefaultImages: number;
  withoutImages: number;
  incorrectImages: number;
}

export default function ImageManagementPage() {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImageStats();
  }, []);

  const fetchImageStats = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        
        const stats: ImageStats = {
          totalProducts: products.length,
          withCustomImages: products.filter(p => 
            p.image && !p.image.includes('/servicio-') && !p.image.includes('unsplash')
          ).length,
          withDefaultImages: products.filter(p => 
            p.image && (p.image.includes('/servicio-') || p.image.includes('unsplash'))
          ).length,
          withoutImages: products.filter(p => !p.image).length,
          incorrectImages: products.filter(p => 
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
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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
                onClick={fetchImageStats}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                🔄 Actualizar
              </button>
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

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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
