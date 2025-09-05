/**
 * Script para importar más productos desde el archivo macheo_productos_top3.csv
 * 
 * Este script:
 * 1. Lee el archivo CSV con productos y precios en dólares
 * 2. Crea productos únicos que no existan en la base de datos
 * 3. Convierte los precios a pesos argentinos
 * 4. Asigna imágenes automáticamente
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

// Tipo de cambio USD a ARS
const USD_TO_ARS = 1000; // 1 USD = 1000 ARS

// Markup por categoría
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

// Función para inferir categoría desde el nombre del producto
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
  } else if (name.includes('laptop') || name.includes('notebook') || name.includes('macbook') || name.includes('thinkpad') || name.includes('inspiron') || name.includes('gateway') || name.includes('pc armada')) {
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

// Función para calcular precio final
function calculateFinalPrice(usdPrice, category) {
  const markup = CATEGORY_MARKUPS[category] || CATEGORY_MARKUPS['Otros'];
  const basePriceARS = usdPrice * USD_TO_ARS;
  const finalPrice = basePriceARS * (1 + markup);
  
  // Redondear a múltiplos de 100
  return Math.round(finalPrice / 100) * 100;
}

// Función para asignar imagen automáticamente
function assignImage(productName, category) {
  const name = productName.toLowerCase();
  
  // Buscar coincidencias específicas
  if (name.includes('monitor')) {
    return '/images/monitor-lg-24-led-hd-20mk400.jpg';
  } else if (name.includes('impresora')) {
    return '/images/brother-impresora-laser-mono-mfc-l2750dw.jpg';
  } else if (name.includes('pc') || name.includes('armada')) {
    return '/images/gateway-acer-ultra-slim-r7-3700u-16gb-1tb-ssd.jpg';
  } else if (name.includes('adaptador') || name.includes('cable')) {
    return '/images/cable-usb-a-type-c-1-8mts-black-noganet.jpg';
  } else if (name.includes('iphone')) {
    return '/images/apple-iphone-15-pro.jpg';
  } else if (name.includes('samsung galaxy')) {
    return '/images/samsung-galaxy-s24.jpg';
  } else if (name.includes('xiaomi')) {
    return '/images/xiaomi-redmi-a5-4gb-128gb-ocean-blue.jpg';
  } else if (name.includes('apple watch')) {
    return '/images/apple-watch-series-9-gps-41mm.jpg';
  } else if (name.includes('airpods')) {
    return '/images/apple-airpods-pro.jpg';
  } else if (name.includes('auricular')) {
    return '/images/lenovo-auricular-bt-lp3-pro-black.jpg';
  } else if (name.includes('parlante')) {
    return '/images/jbl-flip-6.jpg';
  } else if (name.includes('cafetera')) {
    return '/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.jpg';
  } else if (name.includes('nexxt')) {
    return '/images/nexxt-bombilla-led-inteligente-wifi-220v-a19.jpg';
  } else if (name.includes('ps5')) {
    return '/images/sony-ps5-playstation-5-slim-1tb-digital.jpg';
  } else if (name.includes('herramientas')) {
    return '/images/nisuta-kit-de-herramientas-60-piezas.jpg';
  } else if (name.includes('escritorio') || name.includes('silla')) {
    return '/images/xtech-escritorio-un-nivel-natural-beige.jpg';
  } else if (name.includes('ssd') || name.includes('hdd')) {
    return '/images/wd-ssd-nvme-1tb.jpg';
  } else if (name.includes('router')) {
    return '/images/router-wifi-6.jpg';
  } else if (name.includes('mouse')) {
    return '/images/mouse-gaming-logitech.jpg';
  } else {
    // Imagen por defecto según categoría
    const defaultImages = {
      'Laptops': '/images/gateway-acer-ultra-slim-r7-3700u-16gb-1tb-ssd.jpg',
      'Monitores': '/images/monitor-lg-24-led-hd-20mk400.jpg',
      'Impresora': '/images/brother-impresora-laser-mono-mfc-l2750dw.jpg',
      'Accesorio': '/images/cable-usb-a-type-c-1-8mts-black-noganet.jpg',
      'Celulares': '/images/xiaomi-redmi-a5-4gb-128gb-ocean-blue.jpg',
      'Tablets': '/images/xiaomi-redmi-pad-se-8-7.jpg',
      'Parlantes': '/images/jbl-flip-6.jpg',
      'Cocina': '/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.jpg',
      'Domótica': '/images/nexxt-bombilla-led-inteligente-wifi-220v-a19.jpg',
      'Gaming': '/images/sony-ps5-playstation-5-slim-1tb-digital.jpg',
      'Herramientas': '/images/nisuta-kit-de-herramientas-60-piezas.jpg',
      'Muebles': '/images/xtech-escritorio-un-nivel-natural-beige.jpg',
      'Almacena': '/images/wd-ssd-nvme-1tb.jpg',
      'Redes': '/images/router-wifi-6.jpg',
      'Periferico': '/images/mouse-gaming-logitech.jpg',
      'Otros': '/images/cable-usb-a-type-c-1-8mts-black-noganet.jpg'
    };
    
    return defaultImages[category] || defaultImages['Otros'];
  }
}

async function importMoreFromCSV() {
  try {
    console.log('📋 IMPORTANDO MÁS PRODUCTOS DESDE CSV');
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
    
    // Obtener productos existentes
    const existingProducts = await prisma.product.findMany({
      select: { name: true }
    });
    
    const existingNames = existingProducts.map(p => p.name.toLowerCase());
    console.log(`📦 Productos existentes: ${existingNames.length}`);
    console.log('');
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const errorList = [];
    
    // Procesar cada producto del CSV
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      
      try {
        // Extraer datos del producto
        const productName = row.Producto_JS;
        const matchExcel = row.Match_Excel;
        const marca = row.Marca;
        const precioUSD = parseFloat(row.PrecioUSD);
        
        // Validar datos requeridos
        if (!productName || !precioUSD || precioUSD <= 0) {
          skipped++;
          continue;
        }
        
        // Crear nombre completo del producto
        const fullProductName = `${marca ? marca + ' ' : ''}${matchExcel}`;
        
        // Verificar si el producto ya existe
        const exists = existingNames.some(existingName => 
          existingName.includes(productName.toLowerCase()) ||
          existingName.includes(matchExcel.toLowerCase()) ||
          fullProductName.toLowerCase().includes(existingName)
        );
        
        if (exists) {
          skipped++;
          continue;
        }
        
        // Inferir categoría
        const category = inferCategory(fullProductName);
        
        // Calcular precios
        const finalPrice = calculateFinalPrice(precioUSD, category);
        const basePrice = precioUSD * USD_TO_ARS;
        const markup = ((finalPrice - basePrice) / basePrice) * 100;
        
        // Asignar imagen
        const image = assignImage(fullProductName, category);
        
        // Crear producto
        await prisma.product.create({
          data: {
            name: fullProductName,
            description: matchExcel,
            price: finalPrice,
            basePrice: Math.round(basePrice),
            markup: Math.round(markup * 10) / 10,
            stock: 10, // Stock por defecto
            category: category,
            image: image,
            active: true
          }
        });
        
        console.log(`✅ Importado: ${fullProductName}`);
        console.log(`   🏷️  Categoría: ${category}`);
        console.log(`   💵 Precio USD: $${precioUSD.toFixed(2)}`);
        console.log(`   💰 Precio base ARS: $${basePrice.toLocaleString('es-AR')}`);
        console.log(`   📈 Markup: ${markup.toFixed(1)}%`);
        console.log(`   💵 Precio final ARS: $${finalPrice.toLocaleString('es-AR')}`);
        console.log('');
        
        imported++;
        
        // Agregar a la lista de existentes para evitar duplicados
        existingNames.push(fullProductName.toLowerCase());
        
      } catch (error) {
        console.error(`❌ Error en fila ${i + 1}:`, error.message);
        errorList.push({ row: i + 1, error: error.message });
        errors++;
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE IMPORTACIÓN');
    console.log('=' .repeat(50));
    console.log(`✅ Productos importados: ${imported}`);
    console.log(`⏭️  Productos saltados: ${skipped}`);
    console.log(`❌ Errores: ${errors}`);
    
    if (errorList.length > 0) {
      console.log('\n⚠️  ERRORES ENCONTRADOS:');
      errorList.forEach((error, index) => {
        console.log(`${index + 1}. Fila ${error.row}: ${error.error}`);
      });
    }
    
    // Mostrar estadísticas finales
    const totalProducts = await prisma.product.count();
    console.log(`\n📦 Total de productos en la base de datos: ${totalProducts}`);
    
    // Mostrar estadísticas por categoría
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    const categoryStats = {};
    const allProducts = await prisma.product.findMany({
      where: { active: true }
    });
    
    allProducts.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = 0;
      }
      categoryStats[product.category]++;
    });
    
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} productos`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
importMoreFromCSV();
