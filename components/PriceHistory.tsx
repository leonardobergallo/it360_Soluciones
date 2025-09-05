'use client';

import { useState, useEffect } from 'react';

interface PriceChange {
  id: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  oldBasePrice?: number;
  newBasePrice?: number;
  oldMarkup?: number;
  newMarkup?: number;
  changeType: 'price' | 'base_price' | 'markup' | 'bulk_update';
  reason?: string;
  changedBy: string;
  changedAt: string;
  metadata?: any;
}

interface PriceHistoryProps {
  productId?: string;
  limit?: number;
  className?: string;
}

export default function PriceHistory({ productId, limit = 50, className = "" }: PriceHistoryProps) {
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'price' | 'base_price' | 'markup' | 'bulk_update'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'product' | 'change_type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Datos de ejemplo (en producción vendrían de la API)
  const mockData: PriceChange[] = [
    {
      id: '1',
      productId: 'prod-1',
      productName: 'iPhone 15 Pro 128GB',
      oldPrice: 850000,
      newPrice: 920000,
      oldBasePrice: 500000,
      newBasePrice: 500000,
      oldMarkup: 70,
      newMarkup: 84,
      changeType: 'markup',
      reason: 'Ajuste por inflación',
      changedBy: 'admin@it360.com',
      changedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      productId: 'prod-2',
      productName: 'Monitor LG 27GP750-B',
      oldPrice: 450000,
      newPrice: 480000,
      oldBasePrice: 300000,
      newBasePrice: 320000,
      oldMarkup: 50,
      newMarkup: 50,
      changeType: 'base_price',
      reason: 'Actualización de costos de proveedor',
      changedBy: 'admin@it360.com',
      changedAt: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      productId: 'prod-3',
      productName: 'Teclado Mecánico Logitech',
      oldPrice: 15000,
      newPrice: 18000,
      oldBasePrice: 12000,
      newBasePrice: 12000,
      oldMarkup: 25,
      newMarkup: 50,
      changeType: 'price',
      reason: 'Aumento de demanda',
      changedBy: 'admin@it360.com',
      changedAt: '2024-01-13T09:15:00Z'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPriceChanges(mockData);
      setLoading(false);
    }, 1000);
  }, [productId]);

  const filteredChanges = priceChanges
    .filter(change => {
      if (productId && change.productId !== productId) return false;
      if (filter !== 'all' && change.changeType !== filter) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime();
          break;
        case 'product':
          comparison = a.productName.localeCompare(b.productName);
          break;
        case 'change_type':
          comparison = a.changeType.localeCompare(b.changeType);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    })
    .slice(0, limit);

  const getChangeTypeLabel = (type: string) => {
    const labels = {
      'price': 'Precio Final',
      'base_price': 'Precio Base',
      'markup': 'Markup',
      'bulk_update': 'Actualización Masiva'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getChangeTypeColor = (type: string) => {
    const colors = {
      'price': 'bg-blue-100 text-blue-800',
      'base_price': 'bg-green-100 text-green-800',
      'markup': 'bg-purple-100 text-purple-800',
      'bulk_update': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatChangeAmount = (oldValue: number, newValue: number, isPercentage = false) => {
    const change = newValue - oldValue;
    const changePercent = oldValue > 0 ? (change / oldValue) * 100 : 0;
    
    if (isPercentage) {
      return {
        amount: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
        percent: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
        isIncrease: change > 0
      };
    }
    
    return {
      amount: `${change > 0 ? '+' : ''}$${change.toLocaleString('es-AR')}`,
      percent: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
      isIncrease: change > 0
    };
  };

  const getChangeIcon = (isIncrease: boolean) => {
    return isIncrease ? '📈' : '📉';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-6 text-center">
          <div className="text-red-600 text-4xl mb-2">❌</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📊 Historial de Cambios de Precios
            </h3>
            <p className="text-gray-600">
              Seguimiento de modificaciones en precios y márgenes
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredChanges.length} cambios registrados
          </div>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Cambio
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los cambios</option>
              <option value="price">Precio Final</option>
              <option value="base_price">Precio Base</option>
              <option value="markup">Markup</option>
              <option value="bulk_update">Actualización Masiva</option>
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
              <option value="date">Fecha</option>
              <option value="product">Producto</option>
              <option value="change_type">Tipo de Cambio</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Más reciente primero</option>
              <option value="asc">Más antiguo primero</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de cambios */}
      <div className="divide-y divide-gray-200">
        {filteredChanges.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No se encontraron cambios de precios
          </div>
        ) : (
          filteredChanges.map((change) => {
            const priceChange = formatChangeAmount(change.oldPrice, change.newPrice);
            const basePriceChange = change.oldBasePrice && change.newBasePrice 
              ? formatChangeAmount(change.oldBasePrice, change.newBasePrice)
              : null;
            const markupChange = change.oldMarkup && change.newMarkup
              ? formatChangeAmount(change.oldMarkup, change.newMarkup, true)
              : null;

            return (
              <div key={change.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {change.productName}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getChangeTypeColor(change.changeType)}`}>
                        {getChangeTypeLabel(change.changeType)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      {/* Precio Final */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-1">Precio Final</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            ${change.oldPrice.toLocaleString('es-AR')}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${change.newPrice.toLocaleString('es-AR')}
                          </span>
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${priceChange.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{getChangeIcon(priceChange.isIncrease)}</span>
                          <span>{priceChange.amount} ({priceChange.percent})</span>
                        </div>
                      </div>

                      {/* Precio Base */}
                      {basePriceChange && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-gray-700 mb-1">Precio Base</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              ${change.oldBasePrice!.toLocaleString('es-AR')}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${change.newBasePrice!.toLocaleString('es-AR')}
                            </span>
                          </div>
                          <div className={`text-xs flex items-center gap-1 ${basePriceChange.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{getChangeIcon(basePriceChange.isIncrease)}</span>
                            <span>{basePriceChange.amount} ({basePriceChange.percent})</span>
                          </div>
                        </div>
                      )}

                      {/* Markup */}
                      {markupChange && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-gray-700 mb-1">Markup</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {change.oldMarkup!.toFixed(1)}%
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-sm font-medium text-gray-900">
                              {change.newMarkup!.toFixed(1)}%
                            </span>
                          </div>
                          <div className={`text-xs flex items-center gap-1 ${markupChange.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{getChangeIcon(markupChange.isIncrease)}</span>
                            <span>{markupChange.amount}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {change.reason && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Motivo:</span> {change.reason}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>{new Date(change.changedAt).toLocaleDateString('es-AR')}</div>
                    <div>{new Date(change.changedAt).toLocaleTimeString('es-AR')}</div>
                    <div className="text-xs mt-1">por {change.changedBy}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {filteredChanges.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            Mostrando {filteredChanges.length} de {priceChanges.length} cambios
            {limit < priceChanges.length && (
              <span className="ml-2">
                • <button className="text-blue-600 hover:text-blue-800">Ver todos</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
