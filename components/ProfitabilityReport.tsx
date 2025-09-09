'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  basePrice?: number;
  markup?: number;
  category: string;
  stock: number;
  active: boolean;
}

interface ProfitabilityStats {
  totalProducts: number;
  totalBaseValue: number;
  totalFinalValue: number;
  averageMarkup: number;
  totalProfit: number;
  profitMargin: number;
  byCategory: Record<string, {
    count: number;
    totalBase: number;
    totalFinal: number;
    averageMarkup: number;
    profit: number;
  }>;
  lowMarginProducts: Product[];
  highMarginProducts: Product[];
}

interface ProfitabilityReportProps {
  products: Product[];
  className?: string;
}

export default function ProfitabilityReport({ products, className = "" }: ProfitabilityReportProps) {
  const [stats, setStats] = useState<ProfitabilityStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'markup' | 'profit' | 'category'>('markup');

  // Calcular estadísticas
  useEffect(() => {
    if (!products.length) {
      setStats(null);
      return;
    }

    const activeProducts = products.filter(p => p.active);
    const totalProducts = activeProducts.length;
    
    let totalBaseValue = 0;
    let totalFinalValue = 0;
    let totalMarkup = 0;
    let validMarkupCount = 0;
    
    const byCategory: Record<string, any> = {};
    const lowMarginProducts: Product[] = [];
    const highMarginProducts: Product[] = [];

    activeProducts.forEach(product => {
      const basePrice = product.basePrice || product.price;
      const finalPrice = product.price;
      const markup = product.markup || 0;
      
      totalBaseValue += basePrice;
      totalFinalValue += finalPrice;
      
      if (markup > 0) {
        totalMarkup += markup;
        validMarkupCount++;
      }

      // Por categoría
      if (!byCategory[product.category]) {
        byCategory[product.category] = {
          count: 0,
          totalBase: 0,
          totalFinal: 0,
          averageMarkup: 0,
          profit: 0
        };
      }
      
      byCategory[product.category].count++;
      byCategory[product.category].totalBase += basePrice;
      byCategory[product.category].totalFinal += finalPrice;
      byCategory[product.category].profit += (finalPrice - basePrice);

      // Productos con márgenes extremos
      const profitMargin = basePrice > 0 ? ((finalPrice - basePrice) / basePrice) * 100 : 0;
      
      if (profitMargin < 20 && profitMargin > 0) {
        lowMarginProducts.push(product);
      }
      
      if (profitMargin > 80) {
        highMarginProducts.push(product);
      }
    });

    // Calcular promedios por categoría
    Object.keys(byCategory).forEach(category => {
      const cat = byCategory[category];
      cat.averageMarkup = cat.count > 0 ? cat.profit / cat.totalBase * 100 : 0;
    });

    const totalProfit = totalFinalValue - totalBaseValue;
    const profitMargin = totalBaseValue > 0 ? (totalProfit / totalBaseValue) * 100 : 0;
    const averageMarkup = validMarkupCount > 0 ? totalMarkup / validMarkupCount : 0;

    setStats({
      totalProducts,
      totalBaseValue,
      totalFinalValue,
      averageMarkup,
      totalProfit,
      profitMargin,
      byCategory,
      lowMarginProducts: lowMarginProducts.slice(0, 10), // Top 10
      highMarginProducts: highMarginProducts.slice(0, 10) // Top 10
    });
  }, [products]);

  if (!stats) {
    return (
      <div className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`}>
        <div className="text-center text-gray-500">
          No hay datos suficientes para generar el reporte
        </div>
      </div>
    );
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products.filter(p => p.active)
    : products.filter(p => p.active && p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'markup':
        return (b.markup || 0) - (a.markup || 0);
      case 'profit':
        const profitA = (a.price - (a.basePrice || a.price));
        const profitB = (b.price - (b.basePrice || b.price));
        return profitB - profitA;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const getMarginColor = (margin: number) => {
    if (margin < 20) return "text-red-600 bg-red-50";
    if (margin < 40) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          📊 Reporte de Rentabilidad
        </h2>
        <p className="text-gray-600">
          Análisis de márgenes y rentabilidad por producto y categoría
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalProducts}
            </div>
            <div className="text-sm text-blue-800">Productos Activos</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalProfit.toLocaleString('es-AR')}
            </div>
            <div className="text-sm text-green-800">Ganancia Total</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.profitMargin.toFixed(1)}%
            </div>
            <div className="text-sm text-purple-800">Margen Promedio</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.averageMarkup.toFixed(1)}%
            </div>
            <div className="text-sm text-orange-800">Markup Promedio</div>
          </div>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {Object.keys(stats.byCategory).map(category => (
                <option key={category} value={category}>
                  {category} ({stats.byCategory[category].count})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="markup">Markup</option>
              <option value="profit">Ganancia</option>
              <option value="name">Nombre</option>
              <option value="category">Categoría</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Final
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Markup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ganancia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.slice(0, 50).map((product) => {
              const basePrice = product.basePrice || product.price;
              const finalPrice = product.price;
              const markup = product.markup || 0;
              const profit = finalPrice - basePrice;
              const margin = basePrice > 0 ? (profit / basePrice) * 100 : 0;
              
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${basePrice.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${finalPrice.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {markup.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${profit.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMarginColor(margin)}`}>
                      {margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Alertas de productos con márgenes extremos */}
      {(stats.lowMarginProducts.length > 0 || stats.highMarginProducts.length > 0) && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            ⚠️ Productos con Márgenes Extremos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.lowMarginProducts.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">
                  🔴 Márgenes Bajos (&lt;20%)
                </h4>
                <ul className="space-y-1">
                  {stats.lowMarginProducts.map(product => {
                    const basePrice = product.basePrice || product.price;
                    const margin = basePrice > 0 ? ((product.price - basePrice) / basePrice) * 100 : 0;
                    return (
                      <li key={product.id} className="text-sm text-red-700">
                        {product.name}: {margin.toFixed(1)}%
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {stats.highMarginProducts.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  🟢 Márgenes Altos (&gt;80%)
                </h4>
                <ul className="space-y-1">
                  {stats.highMarginProducts.map(product => {
                    const basePrice = product.basePrice || product.price;
                    const margin = basePrice > 0 ? ((product.price - basePrice) / basePrice) * 100 : 0;
                    return (
                      <li key={product.id} className="text-sm text-green-700">
                        {product.name}: {margin.toFixed(1)}%
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
