/**
 * Importa productos desde macheo_productos_top3_ARS.csv aplicando
 * MARKUP POR TRAMOS DE COSTO (ARS) y upserteando en Prisma.
 *
 * Requisitos:
 *   npm i csv-parse
 *   (y obviamente @prisma/client ya instalado y migrado)
 *
 * Uso:
 *   node import-from-macheo-tiered.js
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// === Configuración de archivos ===
const CSV_PATH = process.env.CSV_PATH || "macheo_productos_top3.csv";

// === Tramos de costo (ARS) y porcentajes (ej. 0.80 = +80%) ===
// 0–$30.000      → +80%
// $30.000–$80.000 → +65%
// $80.000–$150.000 → +60%
// $150.000–$300.000 → +55%
// $300.000–$700.000 → +50%
// $700.000–$1.200.000 → +40%
// $1.200.000+ → +35%
const TIERS = [
  { max:  30000,   pct: 0.80 },
  { max:  80000,   pct: 0.65 },
  { max: 150000,   pct: 0.60 },
  { max: 300000,   pct: 0.55 },
  { max: 700000,   pct: 0.50 },
  { max:1200000,   pct: 0.40 },
  { max: Infinity, pct: 0.35 }
];

// === Redondeo del precio final ===
// "none"  → 2 decimales
// "100"   → múltiplo de $100
// "1000"  → múltiplo de $1000
const ROUNDING = process.env.ROUNDING || "100";

// === Defaults razonables ===
const DEFAULT_STOCK   = Number(process.env.DEFAULT_STOCK || 10);
const DEFAULT_IMAGE   = process.env.DEFAULT_IMAGE || "/icono.png";
const DEFAULT_ACTIVE  = process.env.DEFAULT_ACTIVE ? process.env.DEFAULT_ACTIVE === "true" : true;

// Heurística simple de categoría (ajustala a tu taxonomía si querés)
function inferCategory(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("monitor")) return "Monitores";
  if (t.includes("impresora") || t.includes("printer")) return "Impresora";
  if (t.includes("parlante") || t.includes("speaker") || t.includes("flip 6")) return "Parlantes";
  if (t.includes("auricular") || t.includes("airpods") || t.includes("wh-1000") || t.includes("headset")) return "Accesorio";
  if (t.includes("tablet") || t.includes("ipad")) return "Tablets";
  if (t.includes("iphone") || t.includes("samsung galaxy") || t.includes("motorola") || t.includes("redmi") || t.includes("celular") || t.includes("smartphone")) return "Celulares";
  if (t.includes("ssd") || t.includes("hdd") || t.includes("disco") || t.includes("nvme") || t.includes("wd") || t.includes("seagate") || t.includes("sandisk")) return "Almacena";
  if (t.includes("teclado") || t.includes("mouse") || t.includes("mecánico") || t.includes("logitech") || t.includes("g502")) return "Periferico";
  if (t.includes("router") || t.includes("switch") || t.includes("wifi")) return "Redes";
  if (t.includes("cafetera") || t.includes("exprimidor") || t.includes("molinillo") || t.includes("tostadora") || t.includes("kit vino")) return "Cocina";
  if (t.includes("silla") || t.includes("escritorio") || t.includes("soporte monitor")) return "Muebles";
  return "Otros";
}

// Devuelve porcentaje de markup según costo base (ARS)
function resolveTieredMarkup(baseARS) {
  const x = Number(baseARS) || 0;
  for (const tier of TIERS) {
    if (x <= tier.max) return tier.pct;
  }
  return 0.35;
}

// Redondeo del precio final
function roundPrice(price) {
  if (ROUNDING === "100")  return Math.round(price / 100) * 100;
  if (ROUNDING === "1000") return Math.round(price / 1000) * 1000;
  return Math.round(price * 100) / 100; // none (2 decimales)
}

async function main() {
  console.log("🚀 Importando desde:", path.resolve(CSV_PATH));

  // Leer CSV (separador auto)
  const raw = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true });

  // Campos esperados desde tu macheo:
  // Producto_JS | Match_Excel | Marca | PrecioUSD | Similaridad | PrecioARS
  let creados = 0;
  let actualizados = 0;
  const errores = [];

  for (const r of rows) {
    const name        = String(r["Producto_JS"] || "").trim();
    const matchExcel  = String(r["Match_Excel"] || "").trim();
    const marca       = String(r["Marca"] || "").trim();
    const baseARS     = Number(r["PrecioARS"] || 0);

    if (!name) continue; // requiere un nombre para upsert

    // Descripción: lo que vino del excel + marca, si hay
    const description = matchExcel + (marca && marca !== "nan" ? ` [Marca: ${marca}]` : "");

    // Categoría inferida (si ya tenés una exacta, reemplazá!)
    const category = inferCategory(`${name} ${matchExcel}`);

    // Markup por tramos + precio final
    const mk = resolveTieredMarkup(baseARS);
    const priceFinal = roundPrice(baseARS * (1 + mk));

    try {
      // upsert por name (asumimos constraint único por name en el modelo Prisma)
      const res = await prisma.product.upsert({
        where: { name },
        update: {
          description,
          price: priceFinal,
          basePrice: Math.round(baseARS * 100) / 100,
          markup: Math.round(mk * 1000) / 10, // en %
          stock: DEFAULT_STOCK,
          category,
          image: DEFAULT_IMAGE,
          active: DEFAULT_ACTIVE
        },
        create: {
          name,
          description,
          price: priceFinal,
          basePrice: Math.round(baseARS * 100) / 100,
          markup: Math.round(mk * 1000) / 10, // en %
          stock: DEFAULT_STOCK,
          category,
          image: DEFAULT_IMAGE,
          active: DEFAULT_ACTIVE
        }
      });

      if (res && res.createdAt && res.updatedAt && res.createdAt.getTime() === res.updatedAt.getTime()) {
        // prisma no diferencia fácil; usamos un truco simple:
        // si necesitás métricas exactas, primero intentá findUnique y decidí create/update.
        creados++;
        console.log(`🆕 Creado: ${name} → $${priceFinal.toLocaleString("es-AR")}`);
      } else {
        actualizados++;
        console.log(`🔄 Actualizado: ${name} → $${priceFinal.toLocaleString("es-AR")}`);
      }
    } catch (e) {
      errores.push(`${name}: ${e.message}`);
      console.log(`❌ Error con "${name}": ${e.message}`);
    }
  }

  console.log("\n📊 Resumen");
  console.log(`✅ Creados: ${creados}`);
  console.log(`🔄 Actualizados: ${actualizados}`);
  console.log(`⚠️ Errores: ${errores.length}`);
  if (errores.length) {
    console.log("— Detalle de errores —");
    errores.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  }
}

main()
  .catch(async (e) => {
    console.error("❌ Error general:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
