'use client';

import { useState, useEffect } from 'react';

interface PriceCalculatorProps {
  basePrice?: number;
  markup?: number;
  category?: string;
  onPriceChange?: (price: number) => void;
  onMarkupChange?: (markup: number) => void;
  className?: string;
}

// Tramos de precios optimizados
const PRICING_TIERS = [
  { max: 25000, markup: 75, name: "Básico", color: "bg-green-100 text-green-800" },
  { max: 60000, markup: 60, name: "Económico", color: "bg-blue-100 text-blue-800" },
  { max: 120000, markup: 50, name: "Intermedio", color: "bg-yellow-100 text-yellow-800" },
  { max: 250000, markup: 45, name: "Premium", color: "bg-orange-100 text-orange-800" },
  { max: 500000, markup: 40, name: "Alto", color: "bg-red-100 text-red-800" },
  { max: 1000000, markup: 35, name: "Lujo", color: "bg-purple-100 text-purple-800" },
  { max: Infinity, markup: 30, name: "Ultra", color: "bg-gray-100 text-gray-800" }
];

// Ajustes por categoría
const CATEGORY_ADJUSTMENTS = {
  "Celulares": { factor: 1.05, name: "Alta rotación" },
  "Monitores": { factor: 1.03, name: "Demanda estable" },
  "Periferico": { factor: 1.08, name: "Accesorios" },
  "Accesorio": { factor: 1.10, name: "Márgenes altos" },
  "Almacena": { factor: 1.02, name: "Productos básicos" },
  "Redes": { factor: 1.06, name: "Especialización" },
  "Tablets": { factor: 1.04, name: "Tecnología" },
  "Impresora": { factor: 1.07, name: "Consumibles" },
  "Parlantes": { factor: 1.09, name: "Audio premium" },
  "Cocina": { factor: 1.12, name: "Electrodomésticos" },
  "Muebles": { factor: 1.15, name: "Muebles" },
  "Otros": { factor: 1.00, name: "Sin ajuste" }
};

export default function PriceCalculator({ 
  basePrice = 0, 
  markup = 0, 
  category = "Otros",
  onPriceChange,
  onMarkupChange,
  className = ""
}: PriceCalculatorProps) {
  const [localBasePrice, setLocalBasePrice] = useState(basePrice);
  const [localMarkup, setLocalMarkup] = useState(markup);
  const [suggestedMarkup, setSuggestedMarkup] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [margin, setMargin] = useState(0);
  const [tierInfo, setTierInfo] = useState<any>(null);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);

  // Calcular sugerencia de markup basada en tramos
  const calculateSuggestedMarkup = (price: number) => {
    for (const tier of PRICING_TIERS) {
      if (price <= tier.max) {
        return tier.markup;
      }
    }
    return 30; // Default para precios muy altos
  };

  // Aplicar ajuste por categoría
  const applyCategoryAdjustment = (baseMarkup: number, cat: string) => {
    const adjustment = CATEGORY_ADJUSTMENTS[cat as keyof typeof CATEGORY_ADJUSTMENTS];
    return adjustment ? baseMarkup * adjustment.factor : baseMarkup;
  };

  // Redondear precio
  const roundPrice = (price: number) => {
    return Math.round(price / 100) * 100;
  };

  // Actualizar cálculos cuando cambien los valores
  useEffect(() => {
    const base = Number(localBasePrice) || 0;
    const mk = Number(localMarkup) || 0;
    
    // Calcular precio final
    const price = base * (1 + mk / 100);
    const roundedPrice = roundPrice(price);
    
    // Calcular margen
    const marginValue = base > 0 ? ((roundedPrice - base) / base) * 100 : 0;
    
    setFinalPrice(roundedPrice);
    setMargin(marginValue);
    
    // Notificar cambios
    if (onPriceChange) onPriceChange(roundedPrice);
    if (onMarkupChange) onMarkupChange(mk);
  }, [localBasePrice, localMarkup, onPriceChange, onMarkupChange]);

  // Actualizar sugerencia cuando cambie el precio base
  useEffect(() => {
    const base = Number(localBasePrice) || 0;
    const suggested = calculateSuggestedMarkup(base);
    const adjusted = applyCategoryAdjustment(suggested, category);
    
    setSuggestedMarkup(adjusted);
    
    // Encontrar información del tramo
    const tier = PRICING_TIERS.find(t => base <= t.max);
    setTierInfo(tier);
    
    // Información de categoría
    const catInfo = CATEGORY_ADJUSTMENTS[category as keyof typeof CATEGORY_ADJUSTMENTS];
    setCategoryInfo(catInfo);
  }, [localBasePrice, category]);

  // Sincronizar con props externas
  useEffect(() => {
    setLocalBasePrice(basePrice);
  }, [basePrice]);

  useEffect(() => {
    setLocalMarkup(markup);
  }, [markup]);

  const handleApplySuggestion = () => {
    setLocalMarkup(suggestedMarkup);
  };

  const getMarginColor = (margin: number) => {
    if (margin < 20) return "text-red-600";
    if (margin < 40) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🧮 Calculadora de Precios
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entrada de datos */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Base (ARS)
            </label>
            <input
              type="number"
              value={localBasePrice}
              onChange={(e) => setLocalBasePrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Markup (%)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={localMarkup}
                onChange={(e) => setLocalMarkup(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              <button
                type="button"
                onClick={handleApplySuggestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Sugerir
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Precio Final:</span>
              <span className="text-xl font-bold text-green-600">
                ${finalPrice.toLocaleString('es-AR')}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Margen:</span>
              <span className={`text-lg font-semibold ${getMarginColor(margin)}`}>
                {margin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Información del tramo */}
          {tierInfo && (
            <div className={`p-3 rounded-lg ${tierInfo.color}`}>
              <div className="text-sm font-medium">
                Tramo: {tierInfo.name}
              </div>
              <div className="text-xs opacity-75">
                Hasta ${tierInfo.max.toLocaleString('es-AR')} → +{tierInfo.markup}%
              </div>
            </div>
          )}

          {/* Información de categoría */}
          {categoryInfo && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Categoría: {category}
              </div>
              <div className="text-xs text-blue-600">
                {categoryInfo.name} (x{categoryInfo.factor})
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sugerencia de markup */}
      {suggestedMarkup > 0 && Math.abs(suggestedMarkup - localMarkup) > 1 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-yellow-800">
                💡 Sugerencia: {suggestedMarkup.toFixed(1)}% markup
              </span>
              <div className="text-xs text-yellow-600">
                Basado en tramo de precio y categoría
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplySuggestion}
              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Advertencias */}
      {margin < 20 && margin > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            ⚠️ Margen bajo: {margin.toFixed(1)}%. Considera aumentar el markup.
          </div>
        </div>
      )}

      {margin > 100 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="text-sm text-orange-800">
            ⚠️ Margen alto: {margin.toFixed(1)}%. Verifica competitividad.
          </div>
        </div>
      )}
    </div>
  );
}
