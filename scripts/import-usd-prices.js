/**
 * Script para importar precios en dólares y convertirlos a pesos argentinos
 * 
 * Este script:
 * 1. Lee el archivo CSV con precios en USD
 * 2. Convierte los precios a pesos argentinos usando tipo de cambio actual
 * 3. Actualiza los productos con precios realistas
 * 4. Aplica markup apropiado por categoría
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

// Tipo de cambio USD a ARS (actualizar según cotización actual)
const USD_TO_ARS = 1000; // 1 USD = 1000 ARS (aproximado)

// Markup por categoría (porcentaje)
const CATEGORY_MARKUPS = {
  'Celulares': 0.20,      // 20%
  'Tablets': 0.25,        // 25%
  'Accesorio': 0.35,      // 35%
  'Monitores': 0.30,      // 30%
  'Parlantes': 0.40,      // 40%
  'Cocina': 0.45,         // 45%
  'Domótica': 0.50,       // 50%
  'Gaming': 0.25,         // 25%
  'Herramientas': 0.50,   // 50%
  'Laptops': 0.20,        // 20%
  'Muebles': 0.55,        // 55%
  'Almacena': 0.35,       // 35%
  'Redes': 0.40,          // 40%
  'Impresora': 0.30,      // 30%
  'Periferico': 0.45,     // 45%
  'Otros': 0.35           // 35%
};

// Función para inferir categoría basada en el nombre del producto
function inferCategory(productName) {
  const name = productName.toLowerCase();
  
  if (name.includes('iphone') || name.includes('samsung galaxy') || name.includes('xiaomi') || name.includes('motorola') || name.includes('celular')) {
    return 'Celulares';
  } else if (name.includes('ipad') || name.includes('tablet') || name.includes('redmi pad')) {
    return 'Tablets';
  } else if (name.includes('apple watch') || name.includes('airpods') || name.includes('auricular') || name.includes('smartwatch') || name.includes('soporte') || name.includes('cargador')) {
    return 'Accesorio';
  } else if (name.includes('monitor') || name.includes('led') || name.includes('gamer')) {
    return 'Monitores';
  } else if (name.includes('parlante') || name.includes('jbl') || name.includes('t-g')) {
    return 'Parlantes';
  } else if (name.includes('cafetera') || name.includes('exprimidor') || name.includes('molinillo') || name.includes('tostadora') || name.includes('moulinex') || name.includes('vino')) {
    return 'Cocina';
  } else if (name.includes('nexxt') || name.includes('bombilla') || name.includes('cámara') || name.includes('sensor') || name.includes('cerradura')) {
    return 'Domótica';
  } else if (name.includes('ps5') || name.includes('playstation') || name.includes('gaming')) {
    return 'Gaming';
  } else if (name.includes('compresor') || name.includes('herramientas') || name.includes('kit') || name.includes('nisuta')) {
    return 'Herramientas';
  } else if (name.includes('laptop') || name.includes('notebook') || name.includes('macbook') || name.includes('thinkpad') || name.includes('inspiron') || name.includes('gateway')) {
    return 'Laptops';
  } else if (name.includes('escritorio') || name.includes('silla') || name.includes('hamaca') || name.includes('xtech')) {
    return 'Muebles';
  } else if (name.includes('ssd') || name.includes('hdd') || name.includes('sandisk') || name.includes('seagate') || name.includes('wd')) {
    return 'Almacena';
  } else if (name.includes('router') || name.includes('switch') || name.includes('wifi') || name.includes('conservador')) {
    return 'Redes';
  } else if (name.includes('impresora') || name.includes('brother') || name.includes('canon') || name.includes('hp')) {
    return 'Impresora';
  } else if (name.includes('mouse') || name.includes('teclado') || name.includes('webcam') || name.includes('cámara web')) {
    return 'Periferico';
  } else {
    return 'Otros';
  }
}

// Función para calcular precio final con markup
function calculateFinalPrice(usdPrice, category) {
  const markup = CATEGORY_MARKUPS[category] || CATEGORY_MARKUPS['Otros'];
  const basePriceARS = usdPrice * USD_TO_ARS;
  const finalPrice = basePriceARS * (1 + markup);
  
  // Redondear a múltiplos de 100 para precios más limpios
  return Math.round(finalPrice / 100) * 100;
}

async function importUSDPrices() {
  try {
    console.log('💵 IMPORTANDO PRECIOS EN DÓLARES');
    console.log('=' .repeat(60));
    console.log(`💱 Tipo de cambio: 1 USD = ${USD_TO_ARS} ARS`);
    console.log('');
    
    const csvData = [];
    const csvFile = 'macheo_productos_top3.csv';
    
    // Leer archivo CSV
    console.log(`📖 Leyendo archivo: ${csvFile}`);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFile)
        .pipe(csv())
        .on('data', (row) => {
          csvData.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`📊 Registros leídos: ${csvData.length}`);
    console.log('');
    
    // Obtener todos los productos de la base de datos
    const products = await prisma.product.findMany({
      where: { active: true }
    });
    
    console.log(`📦 Productos en base de datos: ${products.length}`);
    console.log('');
    
    let updated = 0;
    let notFound = 0;
    const errors = [];
    
    // Procesar cada producto
    for (const product of products) {
      try {
        // Buscar coincidencia en el CSV
        const match = csvData.find(row => {
          const csvProduct = row.Producto_JS.toLowerCase().trim();
          const dbProduct = product.name.toLowerCase().trim();
          
          // Coincidencia exacta o muy similar
          return csvProduct === dbProduct || 
                 csvProduct.includes(dbProduct) || 
                 dbProduct.includes(csvProduct);
        });
        
        if (match) {
          const usdPrice = parseFloat(match.PrecioUSD);
          
          if (usdPrice > 0) {
            // Inferir categoría
            const category = inferCategory(product.name);
            
            // Calcular precio final
            const finalPrice = calculateFinalPrice(usdPrice, category);
            const basePrice = usdPrice * USD_TO_ARS;
            const markup = ((finalPrice - basePrice) / basePrice) * 100;
            
            // Actualizar producto
            await prisma.product.update({
              where: { id: product.id },
              data: {
                price: finalPrice,
                basePrice: Math.round(basePrice),
                markup: Math.round(markup * 10) / 10,
                category: category
              }
            });
            
            console.log(`✅ ${product.name}`);
            console.log(`   💵 Precio USD: $${usdPrice.toFixed(2)}`);
            console.log(`   💰 Precio base ARS: $${basePrice.toLocaleString('es-AR')}`);
            console.log(`   📈 Markup: ${markup.toFixed(1)}%`);
            console.log(`   💵 Precio final ARS: $${finalPrice.toLocaleString('es-AR')}`);
            console.log(`   🏷️  Categoría: ${category}`);
            console.log('');
            
            updated++;
          } else {
            console.log(`⚠️  ${product.name}: Precio USD inválido (${usdPrice})`);
            notFound++;
          }
        } else {
          console.log(`❌ ${product.name}: No encontrado en CSV`);
          notFound++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
        errors.push({ product: product.name, error: error.message });
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE IMPORTACIÓN');
    console.log('=' .repeat(50));
    console.log(`✅ Productos actualizados: ${updated}`);
    console.log(`❌ Productos no encontrados: ${notFound}`);
    console.log(`⚠️  Errores: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  ERRORES ENCONTRADOS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.product}: ${error.error}`);
      });
    }
    
    // Mostrar estadísticas por categoría
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    const categoryStats = {};
    const updatedProducts = await prisma.product.findMany({
      where: { 
        active: true,
        price: { gt: 0 }
      }
    });
    
    updatedProducts.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = { count: 0, totalPrice: 0 };
      }
      categoryStats[product.category].count++;
      categoryStats[product.category].totalPrice += product.price;
    });
    
    Object.entries(categoryStats).forEach(([category, stats]) => {
      const avgPrice = stats.totalPrice / stats.count;
      console.log(`   ${category}: ${stats.count} productos (promedio: $${avgPrice.toLocaleString('es-AR')})`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
importUSDPrices();
