/**
 * Importa productos aplicando MARKUP OPTIMIZADO POR TRAMOS
 * Basado en análisis del mercado argentino 2024
 * 
 * Características:
 * - Tramos optimizados para competitividad
 * - Márgenes ajustados por categoría de producto
 * - Redondeo inteligente
 * - Validaciones de rentabilidad
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// === Configuración ===
const CSV_PATH = process.env.CSV_PATH || "macheo_productos_top3_ARS.csv";
const ROUNDING = process.env.ROUNDING || "100";
const DEFAULT_STOCK = Number(process.env.DEFAULT_STOCK || 10);
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE || "/icono.png";
const DEFAULT_ACTIVE = process.env.DEFAULT_ACTIVE ? process.env.DEFAULT_ACTIVE === "true" : true;

// === TRAMOS OPTIMIZADOS PARA ARGENTINA 2024 ===
// Basados en análisis de competitividad y márgenes sostenibles
const PRICING_TIERS = [
  { max: 25000,   markup: 0.75,  name: "Básico" },      // 0-25k → +75%
  { max: 60000,   markup: 0.60,  name: "Económico" },   // 25k-60k → +60%
  { max: 120000,  markup: 0.50,  name: "Intermedio" },  // 60k-120k → +50%
  { max: 250000,  markup: 0.45,  name: "Premium" },     // 120k-250k → +45%
  { max: 500000,  markup: 0.40,  name: "Alto" },        // 250k-500k → +40%
  { max: 1000000, markup: 0.35,  name: "Lujo" },        // 500k-1M → +35%
  { max: Infinity, markup: 0.30, name: "Ultra" }        // 1M+ → +30%
];

// === AJUSTES POR CATEGORÍA ===
const CATEGORY_ADJUSTMENTS = {
  "Celulares": 1.05,      // +5% por alta rotación
  "Monitores": 1.03,      // +3% por demanda estable
  "Periferico": 1.08,     // +8% por accesorios
  "Accesorio": 1.10,      // +10% por márgenes altos
  "Almacena": 1.02,       // +2% por productos básicos
  "Redes": 1.06,          // +6% por especialización
  "Tablets": 1.04,        // +4% por tecnología
  "Impresora": 1.07,      // +7% por consumibles
  "Parlantes": 1.09,      // +9% por audio premium
  "Cocina": 1.12,         // +12% por electrodomésticos
  "Muebles": 1.15,        // +15% por muebles
  "Otros": 1.00           // Sin ajuste
};

// === LÍMITES DE RENTABILIDAD ===
const MIN_MARKUP = 0.20;  // Mínimo 20% de margen
const MAX_MARKUP = 1.50;  // Máximo 150% de margen

/**
 * Determina el markup base según el tramo de precio
 */
function getBaseMarkup(basePrice) {
  const price = Number(basePrice) || 0;
  
  for (const tier of PRICING_TIERS) {
    if (price <= tier.max) {
      return {
        markup: tier.markup,
        tierName: tier.name,
        tierMax: tier.max
      };
    }
  }
  
  return {
    markup: PRICING_TIERS[PRICING_TIERS.length - 1].markup,
    tierName: PRICING_TIERS[PRICING_TIERS.length - 1].name,
    tierMax: Infinity
  };
}

/**
 * Aplica ajuste por categoría
 */
function applyCategoryAdjustment(baseMarkup, category) {
  const adjustment = CATEGORY_ADJUSTMENTS[category] || 1.00;
  return baseMarkup * adjustment;
}

/**
 * Valida que el markup esté dentro de límites razonables
 */
function validateMarkup(markup) {
  return Math.max(MIN_MARKUP, Math.min(MAX_MARKUP, markup));
}

/**
 * Calcula precio final con todas las optimizaciones
 */
function calculateOptimizedPrice(basePrice, category) {
  const baseMarkupData = getBaseMarkup(basePrice);
  let finalMarkup = applyCategoryAdjustment(baseMarkupData.markup, category);
  finalMarkup = validateMarkup(finalMarkup);
  
  const finalPrice = basePrice * (1 + finalMarkup);
  
  return {
    basePrice: Math.round(basePrice * 100) / 100,
    markup: Math.round(finalMarkup * 1000) / 10, // En porcentaje
    finalPrice: roundPrice(finalPrice),
    tierName: baseMarkupData.tierName,
    categoryAdjustment: CATEGORY_ADJUSTMENTS[category] || 1.00
  };
}

/**
 * Redondeo inteligente del precio final
 */
function roundPrice(price) {
  if (ROUNDING === "100") {
    return Math.round(price / 100) * 100;
  }
  if (ROUNDING === "1000") {
    return Math.round(price / 1000) * 1000;
  }
  if (ROUNDING === "500") {
    return Math.round(price / 500) * 500;
  }
  return Math.round(price * 100) / 100; // 2 decimales
}

/**
 * Categorización mejorada
 */
function inferCategory(text) {
  const t = (text || "").toLowerCase();
  
  // Celulares y smartphones
  if (t.includes("iphone") || t.includes("samsung galaxy") || 
      t.includes("motorola") || t.includes("redmi") || 
      t.includes("celular") || t.includes("smartphone") ||
      t.includes("xiaomi") || t.includes("huawei")) {
    return "Celulares";
  }
  
  // Monitores
  if (t.includes("monitor") || t.includes("pantalla") || 
      t.includes("display") || t.includes("led")) {
    return "Monitores";
  }
  
  // Periféricos
  if (t.includes("teclado") || t.includes("mouse") || 
      t.includes("mecánico") || t.includes("logitech") || 
      t.includes("g502") || t.includes("webcam") ||
      t.includes("micrófono") || t.includes("headset")) {
    return "Periferico";
  }
  
  // Accesorios
  if (t.includes("auricular") || t.includes("airpods") || 
      t.includes("wh-1000") || t.includes("cargador") ||
      t.includes("cable") || t.includes("adaptador") ||
      t.includes("funda") || t.includes("protector")) {
    return "Accesorio";
  }
  
  // Almacenamiento
  if (t.includes("ssd") || t.includes("hdd") || 
      t.includes("disco") || t.includes("nvme") || 
      t.includes("wd") || t.includes("seagate") || 
      t.includes("sandisk") || t.includes("usb") ||
      t.includes("memoria") || t.includes("pendrive")) {
    return "Almacena";
  }
  
  // Redes
  if (t.includes("router") || t.includes("switch") || 
      t.includes("wifi") || t.includes("ethernet") ||
      t.includes("repetidor") || t.includes("antena")) {
    return "Redes";
  }
  
  // Tablets
  if (t.includes("tablet") || t.includes("ipad") || 
      t.includes("surface")) {
    return "Tablets";
  }
  
  // Impresoras
  if (t.includes("impresora") || t.includes("printer") || 
      t.includes("multifunción") || t.includes("scanner")) {
    return "Impresora";
  }
  
  // Audio
  if (t.includes("parlante") || t.includes("speaker") || 
      t.includes("flip 6") || t.includes("sonido") ||
      t.includes("bocina") || t.includes("altavoz")) {
    return "Parlantes";
  }
  
  // Electrodomésticos
  if (t.includes("cafetera") || t.includes("exprimidor") || 
      t.includes("molinillo") || t.includes("tostadora") || 
      t.includes("licuadora") || t.includes("batidora") ||
      t.includes("microondas") || t.includes("heladera")) {
    return "Cocina";
  }
  
  // Muebles
  if (t.includes("silla") || t.includes("escritorio") || 
      t.includes("soporte monitor") || t.includes("mesa") ||
      t.includes("estante") || t.includes("repisa")) {
    return "Muebles";
  }
  
  return "Otros";
}

/**
 * Función principal de importación
 */
async function main() {
  console.log("🚀 Importando con precios optimizados desde:", path.resolve(CSV_PATH));
  console.log("📊 Tramos de precios configurados:");
  PRICING_TIERS.forEach(tier => {
    console.log(`   ${tier.name}: hasta $${tier.max.toLocaleString()} → +${(tier.markup * 100).toFixed(0)}%`);
  });
  console.log("");

  // Leer CSV
  const raw = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true });

  let creados = 0;
  let actualizados = 0;
  const errores = [];
  const estadisticas = {
    porTramo: {},
    porCategoria: {},
    totalBasePrice: 0,
    totalFinalPrice: 0
  };

  for (const r of rows) {
    const name = String(r["Producto_JS"] || "").trim();
    const matchExcel = String(r["Match_Excel"] || "").trim();
    const marca = String(r["Marca"] || "").trim();
    const baseARS = Number(r["PrecioARS"] || 0);

    if (!name || baseARS <= 0) continue;

    // Descripción mejorada
    const description = matchExcel + (marca && marca !== "nan" ? ` [Marca: ${marca}]` : "");

    // Categorización
    const category = inferCategory(`${name} ${matchExcel}`);

    // Cálculo de precios optimizado
    const pricing = calculateOptimizedPrice(baseARS, category);

    // Estadísticas
    estadisticas.totalBasePrice += baseARS;
    estadisticas.totalFinalPrice += pricing.finalPrice;
    
    if (!estadisticas.porTramo[pricing.tierName]) {
      estadisticas.porTramo[pricing.tierName] = 0;
    }
    estadisticas.porTramo[pricing.tierName]++;
    
    if (!estadisticas.porCategoria[category]) {
      estadisticas.porCategoria[category] = 0;
    }
    estadisticas.porCategoria[category]++;

    try {
      const res = await prisma.product.upsert({
        where: { name },
        update: {
          description,
          price: pricing.finalPrice,
          basePrice: pricing.basePrice,
          markup: pricing.markup,
          stock: DEFAULT_STOCK,
          category,
          image: DEFAULT_IMAGE,
          active: DEFAULT_ACTIVE
        },
        create: {
          name,
          description,
          price: pricing.finalPrice,
          basePrice: pricing.basePrice,
          markup: pricing.markup,
          stock: DEFAULT_STOCK,
          category,
          image: DEFAULT_IMAGE,
          active: DEFAULT_ACTIVE
        }
      });

      if (res && res.createdAt && res.updatedAt && res.createdAt.getTime() === res.updatedAt.getTime()) {
        creados++;
        console.log(`🆕 ${name}`);
        console.log(`   💰 Base: $${baseARS.toLocaleString()} → Final: $${pricing.finalPrice.toLocaleString()}`);
        console.log(`   📈 Markup: ${pricing.markup}% (${pricing.tierName})`);
        console.log(`   🏷️  Categoría: ${category} (x${pricing.categoryAdjustment})`);
      } else {
        actualizados++;
        console.log(`🔄 ${name} → $${pricing.finalPrice.toLocaleString()}`);
      }
    } catch (e) {
      errores.push(`${name}: ${e.message}`);
      console.log(`❌ Error con "${name}": ${e.message}`);
    }
  }

  // Mostrar estadísticas finales
  console.log("\n📊 RESUMEN DE IMPORTACIÓN");
  console.log("=" * 50);
  console.log(`✅ Productos creados: ${creados}`);
  console.log(`🔄 Productos actualizados: ${actualizados}`);
  console.log(`⚠️  Errores: ${errores.length}`);
  
  console.log("\n💰 ANÁLISIS FINANCIERO");
  console.log("=" * 30);
  console.log(`💵 Total precio base: $${estadisticas.totalBasePrice.toLocaleString()}`);
  console.log(`💵 Total precio final: $${estadisticas.totalFinalPrice.toLocaleString()}`);
  console.log(`📈 Margen promedio: ${(((estadisticas.totalFinalPrice - estadisticas.totalBasePrice) / estadisticas.totalBasePrice) * 100).toFixed(1)}%`);
  
  console.log("\n📊 DISTRIBUCIÓN POR TRAMOS");
  console.log("=" * 30);
  Object.entries(estadisticas.porTramo).forEach(([tramo, cantidad]) => {
    console.log(`   ${tramo}: ${cantidad} productos`);
  });
  
  console.log("\n🏷️  DISTRIBUCIÓN POR CATEGORÍAS");
  console.log("=" * 30);
  Object.entries(estadisticas.porCategoria).forEach(([categoria, cantidad]) => {
    console.log(`   ${categoria}: ${cantidad} productos`);
  });

  if (errores.length) {
    console.log("\n❌ ERRORES ENCONTRADOS");
    console.log("=" * 20);
    errores.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  }
}

// Ejecutar
main()
  .catch(async (e) => {
    console.error("❌ Error general:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
