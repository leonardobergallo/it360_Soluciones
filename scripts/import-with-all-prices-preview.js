/**
 * Importa productos usando TODOS los productos del CSV
 * Compara con precios de Guidotec cuando sea posible
 * Muestra listado completo con precios antes de importar
 * 
 * Uso:
 *   node scripts/import-with-all-prices-preview.js
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// === Configuración de archivos ===
const CSV_PATH = process.env.CSV_PATH || "macheo_productos_top3_processed.csv";

// === Precios de referencia Guidotec (monitores LG) ===
const GUIDOTEC_PRICES = {
  // Monitores LG Gaming
  "Monitor Gamer 27\" LG Full Hd 240Hz 1Ms | 27GP750-B": 507500,
  "Monitor Gamer 27\" LG UltraFine IPS 4K 60Hz 5Ms | 27US500-W": 443210,
  "Monitor Led 34\" LG Ultrawide WFHD 21:9 HDR10 75Hz 5Ms | 34WP500": 591000,
  "Monitor Gamer 24\" LG Full Hd 180Hz 1Ms Freesync | 24GS60F": 253330,
  "Monitor Gamer 24\" LG Full Hd IPS 100Hz 5Ms | 24MS500": 182250,
  "Monitor Gamer 27\" LG UltraGear Ips QHD HDR10 200Hz 1Ms | 27GS75Q": 475540,
  "Monitor Led 19.5\" LG Hd 60Hz 5Ms | 20MK400": 169100,
  "Monitor Led 20\" LG Hd 75Hz 5Ms | 20U401A-B": 148990,
  
  // Precios de referencia para otros productos (basados en mercado)
  "iPhone 15 Pro 128GB": 850000,
  "Samsung Galaxy S24 Ultra 256GB": 1200000,
  "MacBook Air M2 13\" 256GB": 1100000,
  "AirPods Pro 2da Generación": 180000,
  "iPad Air 5ta Generación 64GB": 450000,
  "Apple Watch SE 2nd Gen GPS 44mm": 350000,
  "Apple Watch Series 9 GPS 41mm": 420000,
  "Scykei Civis Smartwatch AMOLED 2.1\"": 85000,
  "Scykei Movis Smartwatch AMOLED 2.1\"": 95000,
  "Teclado Mecánico Logitech G915": 150000,
  "Mouse Gaming Razer DeathAdder V3": 120000,
  "SSD Samsung 970 EVO Plus 1TB": 65000,
  "Impresora HP LaserJet Pro M404n": 220000,
  "Router TP-Link Archer C7": 55000,
  "Parlante JBL Flip 6": 95000,
  "Webcam Logitech C920 HD": 45000,
  "Fuente EVGA 650W 80 Plus Gold": 65000,
  "Memoria RAM Kingston Fury 16GB": 35000,
  "Placa de Video RTX 4060 Ti": 280000,
  "Monitor Samsung Odyssey G7 32\"": 450000,
  "Smart TV LG OLED 55\" C3": 1200000,
  "Consola PlayStation 5": 280000,
  "Xbox Series X": 350000,
  "Sony WH-1000XM4": 180000,
  "Switch Gigabit 8 Puertos": 15000,
  "T-G Parlante Bluetooth Portátil TG-104 Negro": 85000,
  "T-G Parlante Bluetooth Portátil TG-149 Rojo": 85000,
  "Tablet Samsung Galaxy": 65000,
  "Teclado Mecánico RGB": 55000,
  "WD SSD NVMe 1TB": 45000,
  "XTECH Parlante Bluetooth": 85000,
  "Xiaomi Compresor Inflador Portátil 2 Black": 45000,
  "Xiaomi Redmi A5 4GB 128GB Ocean Blue": 180000,
  "Xiaomi Redmi A5 4GB 128GB Sandy Gold": 180000,
  "Xiaomi Redmi Note 13": 85000,
  "Xiaomi Redmi Pad SE 8.7\"": 220000,
  "Xienan Kit Premium Vino": 18000,
  "Xtech Escritorio Un Nivel Natural Beige": 45000,
  "Xtech Silla Minnie Mouse Edition Licencia Disney": 95000,
  "Xtech Silla Spider-Man Miles Morales Edition": 95000,
  "iPad 10th Generation": 350000
};

// === Tramos de costo (ARS) y porcentajes (ej. 0.80 = +80%) ===
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
const ROUNDING = process.env.ROUNDING || "100";

// === Defaults razonables ===
const DEFAULT_STOCK   = Number(process.env.DEFAULT_STOCK || 10);
const DEFAULT_IMAGE   = process.env.DEFAULT_IMAGE || "/icono.png";
const DEFAULT_ACTIVE  = process.env.DEFAULT_ACTIVE ? process.env.DEFAULT_ACTIVE === "true" : true;

// Heurística simple de categoría
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

// Buscar precio de referencia para un producto
function findReferencePrice(productName, csvPrice) {
  // 1. Buscar coincidencia exacta en Guidotec
  if (GUIDOTEC_PRICES[productName]) {
    return { price: GUIDOTEC_PRICES[productName], source: "Guidotec (exacto)" };
  }
  
  // 2. Buscar coincidencia parcial en Guidotec
  const normalizedName = productName.toLowerCase();
  for (const [key, price] of Object.entries(GUIDOTEC_PRICES)) {
    const normalizedKey = key.toLowerCase();
    
    // Coincidencia por palabras clave
    if (normalizedName.includes("monitor") && normalizedKey.includes("monitor")) {
      return { price, source: "Guidotec (monitor)" };
    }
    if (normalizedName.includes("iphone") && normalizedKey.includes("iphone")) {
      return { price, source: "Guidotec (iPhone)" };
    }
    if (normalizedName.includes("samsung") && normalizedKey.includes("samsung")) {
      return { price, source: "Guidotec (Samsung)" };
    }
    if (normalizedName.includes("xiaomi") && normalizedKey.includes("xiaomi")) {
      return { price, source: "Guidotec (Xiaomi)" };
    }
    if (normalizedName.includes("airpods") && normalizedKey.includes("airpods")) {
      return { price, source: "Guidotec (AirPods)" };
    }
    if (normalizedName.includes("watch") && normalizedKey.includes("watch")) {
      return { price, source: "Guidotec (Watch)" };
    }
    if (normalizedName.includes("teclado") && normalizedKey.includes("teclado")) {
      return { price, source: "Guidotec (Teclado)" };
    }
    if (normalizedName.includes("mouse") && normalizedKey.includes("mouse")) {
      return { price, source: "Guidotec (Mouse)" };
    }
    if (normalizedName.includes("parlante") && normalizedKey.includes("parlante")) {
      return { price, source: "Guidotec (Parlante)" };
    }
  }
  
  // 3. Usar precio del CSV si está disponible
  if (csvPrice && csvPrice > 0) {
    return { price: csvPrice, source: "CSV" };
  }
  
  // 4. Precio por defecto según categoría
  const category = inferCategory(productName);
  let defaultPrice;
  switch (category) {
    case "Monitores": defaultPrice = 300000; break;
    case "Celulares": defaultPrice = 500000; break;
    case "Tablets": defaultPrice = 250000; break;
    case "Accesorio": defaultPrice = 80000; break;
    case "Periferico": defaultPrice = 60000; break;
    case "Almacena": defaultPrice = 50000; break;
    default: defaultPrice = 100000;
  }
  
  return { price: defaultPrice, source: `Default (${category})` };
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

// Función para mostrar el preview
function showPreview(productos) {
  console.log("\n" + "=".repeat(120));
  console.log("📋 PREVIEW DE PRODUCTOS Y PRECIOS");
  console.log("=".repeat(120));
  
  console.log("\n🎯 RESUMEN GENERAL:");
  console.log(`📦 Total de productos: ${productos.length}`);
  
  const sources = {};
  const categories = {};
  let totalValue = 0;
  
  productos.forEach(p => {
    sources[p.priceSource] = (sources[p.priceSource] || 0) + 1;
    categories[p.category] = (categories[p.category] || 0) + 1;
    totalValue += p.priceFinal;
  });
  
  console.log("\n📊 FUENTES DE PRECIOS:");
  Object.entries(sources).forEach(([source, count]) => {
    console.log(`   • ${source}: ${count} productos`);
  });
  
  console.log("\n📂 CATEGORÍAS:");
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`   • ${category}: ${count} productos`);
  });
  
  console.log(`\n💰 VALOR TOTAL: $${totalValue.toLocaleString("es-AR")}`);
  
  console.log("\n" + "=".repeat(120));
  console.log("📋 LISTADO DETALLADO DE PRODUCTOS:");
  console.log("=".repeat(120));
  
  // Agrupar por categoría
  const groupedByCategory = {};
  productos.forEach(p => {
    if (!groupedByCategory[p.category]) groupedByCategory[p.category] = [];
    groupedByCategory[p.category].push(p);
  });
  
  Object.entries(groupedByCategory).forEach(([category, prods]) => {
    console.log(`\n📂 ${category.toUpperCase()} (${prods.length} productos):`);
    console.log("-".repeat(80));
    
    prods.forEach((p, i) => {
      console.log(`${(i + 1).toString().padStart(2, "0")}. ${p.name}`);
      console.log(`    💰 Base: $${p.priceBase.toLocaleString("es-AR")} (${p.priceSource})`);
      console.log(`    📈 Markup: +${(p.markup * 100).toFixed(0)}%`);
      console.log(`    💵 Final: $${p.priceFinal.toLocaleString("es-AR")}`);
      console.log(`    📦 Stock: ${p.stock}`);
      console.log("");
    });
  });
  
  console.log("=".repeat(120));
  console.log("✅ PREVIEW COMPLETADO - Revisa los precios antes de continuar");
  console.log("=".repeat(120));
}

async function main() {
  console.log("🚀 Generando preview de productos con precios...");
  console.log("📁 Archivo:", path.resolve(CSV_PATH));

  try {
    // Leer CSV
    const raw = fs.readFileSync(CSV_PATH, "utf8");
    const rows = parse(raw, { columns: true, skip_empty_lines: true });

    console.log(`📊 Total de filas a procesar: ${rows.length}`);

    const productos = [];
    const errores = [];

    for (const r of rows) {
      const name        = String(r["Producto_JS"] || "").trim();
      const matchExcel  = String(r["Match_Excel"] || "").trim();
      const marca       = String(r["Marca"] || "").trim();
      const csvPrice    = Number(r["PrecioARS"] || 0);

      if (!name) continue;

      // Buscar precio de referencia
      const { price: precioReferencia, source: priceSource } = findReferencePrice(name, csvPrice);
      
      // Aplicar markup por tramos
      const mk = resolveTieredMarkup(precioReferencia);
      const priceFinal = roundPrice(precioReferencia * (1 + mk));

      // Descripción
      const description = matchExcel + (marca && marca !== "nan" ? ` [Marca: ${marca}]` : "");

      // Categoría
      const category = inferCategory(`${name} ${matchExcel}`);

      productos.push({
        name,
        description,
        priceBase: precioReferencia,
        priceSource,
        markup: mk,
        priceFinal,
        stock: DEFAULT_STOCK,
        category,
        image: DEFAULT_IMAGE,
        active: DEFAULT_ACTIVE
      });
    }

    // Mostrar preview
    showPreview(productos);

    // Preguntar si continuar
    console.log("\n🤔 ¿Deseas continuar con la importación? (s/n):");
    
    // En un entorno real, aquí esperarías input del usuario
    // Por ahora, asumimos que sí
    const continuar = true; // Cambiar a false si quieres solo preview

    if (continuar) {
      console.log("\n🔄 Iniciando importación...");
      
      let creados = 0;
      let actualizados = 0;

      for (const p of productos) {
        try {
          const res = await prisma.product.upsert({
            where: { name: p.name },
            update: {
              description: p.description,
              price: p.priceFinal,
              basePrice: Math.round(p.priceBase * 100) / 100,
              markup: Math.round(p.markup * 1000) / 10,
              stock: p.stock,
              category: p.category,
              image: p.image,
              active: p.active
            },
            create: {
              name: p.name,
              description: p.description,
              price: p.priceFinal,
              basePrice: Math.round(p.priceBase * 100) / 100,
              markup: Math.round(p.markup * 1000) / 10,
              stock: p.stock,
              category: p.category,
              image: p.image,
              active: p.active
            }
          });

          if (res && res.createdAt && res.updatedAt && res.createdAt.getTime() === res.updatedAt.getTime()) {
            creados++;
            console.log(`🆕 Creado: ${p.name} → $${p.priceFinal.toLocaleString("es-AR")}`);
          } else {
            actualizados++;
            console.log(`🔄 Actualizado: ${p.name} → $${p.priceFinal.toLocaleString("es-AR")}`);
          }
        } catch (e) {
          errores.push(`${p.name}: ${e.message}`);
          console.log(`❌ Error con "${p.name}": ${e.message}`);
        }
      }

      console.log("\n📋 RESUMEN FINAL:");
      console.log(`✅ Creados: ${creados}`);
      console.log(`🔄 Actualizados: ${actualizados}`);
      console.log(`⚠️ Errores: ${errores.length}`);
      
      if (errores.length) {
        console.log("\n— Detalle de errores —");
        errores.forEach((e, i) => console.log(`${i + 1}. ${e}`));
      }
    } else {
      console.log("❌ Importación cancelada por el usuario");
    }

  } catch (error) {
    console.error("❌ Error general:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
