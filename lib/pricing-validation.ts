/**
 * Validaciones y utilidades para el sistema de precios
 */

export interface PricingValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PricingLimits {
  minMarkup: number;
  maxMarkup: number;
  minPrice: number;
  maxPrice: number;
  minMargin: number;
  maxMargin: number;
}

// Límites por defecto
export const DEFAULT_PRICING_LIMITS: PricingLimits = {
  minMarkup: 15,    // Mínimo 15% de markup
  maxMarkup: 200,   // Máximo 200% de markup
  minPrice: 100,    // Precio mínimo $100
  maxPrice: 10000000, // Precio máximo $10M
  minMargin: 10,    // Mínimo 10% de margen
  maxMargin: 150    // Máximo 150% de margen
};

// Límites por categoría
export const CATEGORY_PRICING_LIMITS: Record<string, Partial<PricingLimits>> = {
  "Celulares": {
    minMarkup: 20,
    maxMarkup: 80,
    minMargin: 15
  },
  "Monitores": {
    minMarkup: 25,
    maxMarkup: 70,
    minMargin: 20
  },
  "Periferico": {
    minMarkup: 30,
    maxMarkup: 100,
    minMargin: 25
  },
  "Accesorio": {
    minMarkup: 40,
    maxMarkup: 150,
    minMargin: 30
  },
  "Almacena": {
    minMarkup: 15,
    maxMarkup: 60,
    minMargin: 12
  },
  "Redes": {
    minMarkup: 25,
    maxMarkup: 80,
    minMargin: 20
  },
  "Tablets": {
    minMarkup: 20,
    maxMarkup: 70,
    minMargin: 15
  },
  "Impresora": {
    minMarkup: 20,
    maxMarkup: 90,
    minMargin: 15
  },
  "Parlantes": {
    minMarkup: 35,
    maxMarkup: 120,
    minMargin: 25
  },
  "Cocina": {
    minMarkup: 30,
    maxMarkup: 100,
    minMargin: 25
  },
  "Muebles": {
    minMarkup: 40,
    maxMarkup: 150,
    minMargin: 30
  }
};

/**
 * Valida un precio y sus componentes
 */
export function validatePricing(
  basePrice: number,
  finalPrice: number,
  markup: number,
  category: string = "Otros",
  customLimits?: Partial<PricingLimits>
): PricingValidationResult {
  const result: PricingValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Combinar límites por defecto con límites de categoría y personalizados
  const limits = {
    ...DEFAULT_PRICING_LIMITS,
    ...CATEGORY_PRICING_LIMITS[category],
    ...customLimits
  };

  // Validaciones básicas
  if (basePrice <= 0) {
    result.errors.push("El precio base debe ser mayor a 0");
    result.isValid = false;
  }

  if (finalPrice <= 0) {
    result.errors.push("El precio final debe ser mayor a 0");
    result.isValid = false;
  }

  if (markup < 0) {
    result.errors.push("El markup no puede ser negativo");
    result.isValid = false;
  }

  // Validaciones de límites
  if (basePrice < limits.minPrice) {
    result.warnings.push(`Precio base muy bajo: $${basePrice.toLocaleString()}. Mínimo recomendado: $${limits.minPrice.toLocaleString()}`);
  }

  if (basePrice > limits.maxPrice) {
    result.warnings.push(`Precio base muy alto: $${basePrice.toLocaleString()}. Máximo recomendado: $${limits.maxPrice.toLocaleString()}`);
  }

  if (finalPrice < limits.minPrice) {
    result.warnings.push(`Precio final muy bajo: $${finalPrice.toLocaleString()}. Mínimo recomendado: $${limits.minPrice.toLocaleString()}`);
  }

  if (finalPrice > limits.maxPrice) {
    result.warnings.push(`Precio final muy alto: $${finalPrice.toLocaleString()}. Máximo recomendado: $${limits.maxPrice.toLocaleString()}`);
  }

  // Validaciones de markup
  if (markup < limits.minMarkup) {
    result.errors.push(`Markup muy bajo: ${markup.toFixed(1)}%. Mínimo para ${category}: ${limits.minMarkup}%`);
    result.isValid = false;
  }

  if (markup > limits.maxMarkup) {
    result.warnings.push(`Markup muy alto: ${markup.toFixed(1)}%. Máximo recomendado para ${category}: ${limits.maxMarkup}%`);
  }

  // Validaciones de consistencia
  const calculatedMarkup = basePrice > 0 ? ((finalPrice - basePrice) / basePrice) * 100 : 0;
  const calculatedFinalPrice = basePrice * (1 + markup / 100);
  const margin = basePrice > 0 ? ((finalPrice - basePrice) / basePrice) * 100 : 0;

  if (Math.abs(calculatedMarkup - markup) > 1) {
    result.warnings.push(`Inconsistencia: markup declarado (${markup.toFixed(1)}%) vs calculado (${calculatedMarkup.toFixed(1)}%)`);
  }

  if (Math.abs(calculatedFinalPrice - finalPrice) > 1) {
    result.warnings.push(`Inconsistencia: precio final declarado vs calculado`);
  }

  // Validaciones de margen
  if (margin < limits.minMargin) {
    result.errors.push(`Margen muy bajo: ${margin.toFixed(1)}%. Mínimo para ${category}: ${limits.minMargin}%`);
    result.isValid = false;
  }

  if (margin > limits.maxMargin) {
    result.warnings.push(`Margen muy alto: ${margin.toFixed(1)}%. Máximo recomendado para ${category}: ${limits.maxMargin}%`);
  }

  // Sugerencias
  if (markup < limits.minMarkup * 1.2) {
    result.suggestions.push(`Considera aumentar el markup a al menos ${Math.ceil(limits.minMarkup * 1.2)}% para mejorar la rentabilidad`);
  }

  if (margin < limits.minMargin * 1.5) {
    result.suggestions.push(`El margen actual (${margin.toFixed(1)}%) está cerca del mínimo. Considera revisar costos o aumentar precios`);
  }

  if (markup > limits.maxMarkup * 0.8) {
    result.suggestions.push(`El markup está cerca del máximo recomendado. Verifica la competitividad en el mercado`);
  }

  return result;
}

/**
 * Calcula el precio óptimo basado en tramos y categoría
 */
export function calculateOptimalPrice(
  basePrice: number,
  category: string = "Otros"
): { finalPrice: number; markup: number; tier: string } {
  // Tramos de precios optimizados
  const PRICING_TIERS = [
    { max: 25000, markup: 75, name: "Básico" },
    { max: 60000, markup: 60, name: "Económico" },
    { max: 120000, markup: 50, name: "Intermedio" },
    { max: 250000, markup: 45, name: "Premium" },
    { max: 500000, markup: 40, name: "Alto" },
    { max: 1000000, markup: 35, name: "Lujo" },
    { max: Infinity, markup: 30, name: "Ultra" }
  ];

  // Ajustes por categoría
  const CATEGORY_ADJUSTMENTS = {
    "Celulares": 1.05,
    "Monitores": 1.03,
    "Periferico": 1.08,
    "Accesorio": 1.10,
    "Almacena": 1.02,
    "Redes": 1.06,
    "Tablets": 1.04,
    "Impresora": 1.07,
    "Parlantes": 1.09,
    "Cocina": 1.12,
    "Muebles": 1.15,
    "Otros": 1.00
  };

  // Encontrar tramo
  let tier = PRICING_TIERS[PRICING_TIERS.length - 1];
  for (const t of PRICING_TIERS) {
    if (basePrice <= t.max) {
      tier = t;
      break;
    }
  }

  // Aplicar ajuste por categoría
  const adjustment = CATEGORY_ADJUSTMENTS[category as keyof typeof CATEGORY_ADJUSTMENTS] || 1.00;
  const finalMarkup = tier.markup * adjustment;
  const finalPrice = basePrice * (1 + finalMarkup / 100);

  return {
    finalPrice: Math.round(finalPrice / 100) * 100, // Redondear a múltiplos de 100
    markup: Math.round(finalMarkup * 10) / 10, // Redondear a 1 decimal
    tier: tier.name
  };
}

/**
 * Valida un rango de precios para múltiples productos
 */
export function validateBulkPricing(
  products: Array<{
    basePrice: number;
    finalPrice: number;
    markup: number;
    category: string;
  }>
): {
  valid: number;
  invalid: number;
  warnings: number;
  results: Array<{ index: number; validation: PricingValidationResult }>;
} {
  const results = products.map((product, index) => ({
    index,
    validation: validatePricing(
      product.basePrice,
      product.finalPrice,
      product.markup,
      product.category
    )
  }));

  const valid = results.filter(r => r.validation.isValid).length;
  const invalid = results.filter(r => !r.validation.isValid).length;
  const warnings = results.filter(r => r.validation.warnings.length > 0).length;

  return {
    valid,
    invalid,
    warnings,
    results
  };
}

/**
 * Genera un reporte de validación en formato legible
 */
export function generateValidationReport(validation: PricingValidationResult): string {
  let report = "";

  if (validation.isValid) {
    report += "✅ Precio válido\n";
  } else {
    report += "❌ Precio inválido\n";
  }

  if (validation.errors.length > 0) {
    report += "\n🚨 Errores:\n";
    validation.errors.forEach(error => {
      report += `  • ${error}\n`;
    });
  }

  if (validation.warnings.length > 0) {
    report += "\n⚠️ Advertencias:\n";
    validation.warnings.forEach(warning => {
      report += `  • ${warning}\n`;
    });
  }

  if (validation.suggestions.length > 0) {
    report += "\n💡 Sugerencias:\n";
    validation.suggestions.forEach(suggestion => {
      report += `  • ${suggestion}\n`;
    });
  }

  return report;
}
