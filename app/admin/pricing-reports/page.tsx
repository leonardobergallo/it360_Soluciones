"use client";

import AdminLayout from '@/components/AdminLayout';
import ProfitabilityReport from '@/components/ProfitabilityReport';
import { useState, useEffect } from 'react';

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
  active: boolean;
}

export default function PricingReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los productos');
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
            <p className="text-gray-600">Cargando reportes de precios...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
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
                📊 Reportes de Precios
              </h1>
              <p className="text-gray-600">
                Análisis de rentabilidad, márgenes y estrategias de precios
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Resumen rápido */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${products
                    .filter(p => p.active)
                    .reduce((sum, p) => sum + p.price, 0)
                    .toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Markup Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.active && p.markup).length > 0
                    ? (products
                        .filter(p => p.active && p.markup)
                        .reduce((sum, p) => sum + (p.markup || 0), 0) /
                      products.filter(p => p.active && p.markup).length
                      ).toFixed(1)
                    : '0.0'}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(products.filter(p => p.active).map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reporte principal */}
        <ProfitabilityReport 
          products={products}
          className="mb-8"
        />

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Consejos para Optimizar Precios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Márgenes Bajos (&lt;20%)</h4>
              <ul className="space-y-1">
                <li>• Revisar costos de adquisición</li>
                <li>• Considerar aumentar markup</li>
                <li>• Evaluar competitividad</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Márgenes Altos (&gt;80%)</h4>
              <ul className="space-y-1">
                <li>• Verificar precios de mercado</li>
                <li>• Asegurar valor percibido</li>
                <li>• Monitorear ventas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
