/**
 * Script para importar productos desde lista (1).xls
 * Aplica el mismo sistema de cálculo de precios que implementamos anteriormente
 */

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

// Tipo de cambio USD a ARS (mismo que usamos antes)
const USD_TO_ARS = 1000; // 1 USD = 1000 ARS

// Markup por categoría (mismo sistema que implementamos)
const CATEGORY_MARKUPS = {
  'PCs Armadas / AIOs': 0.15,      // 15%
  'Adaptadores': 0.40,             // 40%
  'Impresora Multifuncion Inyec Tinta': 0.25, // 25%
  'Monitores': 0.30,               // 30%
  'Celulares': 0.20,               // 20%
  'Tablets': 0.25,                 // 25%
  'Accesorios': 0.35,              // 35%
  'Parlantes': 0.40,               // 40%
  'Cocina': 0.45,                  // 45%
  'Domótica': 0.50,                // 50%
  'Gaming': 0.25,                  // 25%
  'Herramientas': 0.50,            // 50%
  'Laptops': 0.20,                 // 20%
  'Muebles': 0.55,                 // 55%
  'Almacenamiento': 0.35,          // 35%
  'Redes': 0.40,                   // 40%
  'Impresoras': 0.30,              // 30%
  'Periféricos': 0.45,             // 45%
  'Otros': 0.35                    // 35%
};

// Función para limpiar texto
function cleanText(text) {
  if (!text) return '';
  return text.toString().trim();
}

// Función para mapear categoría desde rubro
function mapCategory(rubro) {
  if (!rubro) return 'Otros';
  
  const rubroLower = rubro.toLowerCase();
  
  if (rubroLower.includes('pc') || rubroLower.includes('armada') || rubroLower.includes('aio')) {
    return 'Laptops';
  } else if (rubroLower.includes('adaptador') || rubroLower.includes('cable') || rubroLower.includes('conector')) {
    return 'Accesorios';
  } else if (rubroLower.includes('impresora')) {
    return 'Impresoras';
  } else if (rubroLower.includes('monitor')) {
    return 'Monitores';
  } else if (rubroLower.includes('celular') || rubroLower.includes('smartphone')) {
    return 'Celulares';
  } else if (rubroLower.includes('tablet')) {
    return 'Tablets';
  } else if (rubroLower.includes('parlante') || rubroLower.includes('audio')) {
    return 'Parlantes';
  } else if (rubroLower.includes('cocina') || rubroLower.includes('electrodoméstico')) {
    return 'Cocina';
  } else if (rubroLower.includes('domótica') || rubroLower.includes('inteligente')) {
    return 'Domótica';
  } else if (rubroLower.includes('gaming') || rubroLower.includes('juego')) {
    return 'Gaming';
  } else if (rubroLower.includes('herramienta') || rubroLower.includes('kit')) {
    return 'Herramientas';
  } else if (rubroLower.includes('laptop') || rubroLower.includes('notebook')) {
    return 'Laptops';
  } else if (rubroLower.includes('mueble') || rubroLower.includes('silla') || rubroLower.includes('escritorio')) {
    return 'Muebles';
  } else if (rubroLower.includes('almacenamiento') || rubroLower.includes('disco') || rubroLower.includes('ssd') || rubroLower.includes('hdd')) {
    return 'Almacenamiento';
  } else if (rubroLower.includes('red') || rubroLower.includes('router') || rubroLower.includes('switch')) {
    return 'Redes';
  } else if (rubroLower.includes('periférico') || rubroLower.includes('mouse') || rubroLower.includes('teclado')) {
    return 'Periféricos';
  } else {
    return 'Otros';
  }
}

// Función para calcular precio final (mismo sistema que implementamos)
function calculateFinalPrice(usdPrice, category) {
  const markup = CATEGORY_MARKUPS[category] || CATEGORY_MARKUPS['Otros'];
  const basePriceARS = usdPrice * USD_TO_ARS;
  const finalPrice = basePriceARS * (1 + markup);
  
  // Redondear a múltiplos de 100 para precios más limpios
  return Math.round(finalPrice / 100) * 100;
}

// Función para asignar imagen por defecto
function assignDefaultImage(category) {
  const defaultImages = {
    'Laptops': '/images/gateway-acer-ultra-slim-r7-3700u-16gb-1tb-ssd.jpg',
    'Monitores': '/images/monitor-lg-24-led-hd-20mk400.jpg',
    'Impresoras': '/images/brother-impresora-laser-mono-mfc-l2750dw.jpg',
    'Accesorios': '/images/cable-usb-a-type-c-1-8mts-black-noganet.jpg',
    'Celulares': '/images/xiaomi-redmi-a5-4gb-128gb-ocean-blue.jpg',
    'Tablets': '/images/xiaomi-redmi-pad-se-8-7.jpg',
    'Parlantes': '/images/jbl-flip-6.jpg',
    'Cocina': '/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.jpg',
    'Domótica': '/images/nexxt-bombilla-led-inteligente-wifi-220v-a19.jpg',
    'Gaming': '/images/sony-ps5-playstation-5-slim-1tb-digital.jpg',
    'Herramientas': '/images/nisuta-kit-de-herramientas-60-piezas.jpg',
    'Muebles': '/images/xtech-escritorio-un-nivel-natural-beige.jpg',
    'Almacenamiento': '/images/wd-ssd-nvme-1tb.jpg',
    'Redes': '/images/router-wifi-6.jpg',
    'Periféricos': '/images/mouse-gaming-logitech.jpg',
    'Otros': '/images/cable-usb-a-type-c-1-8mts-black-noganet.jpg'
  };
  
  return defaultImages[category] || defaultImages['Otros'];
}

async function importFromLista() {
  try {
    console.log('📋 IMPORTANDO PRODUCTOS DESDE LISTA (1).XLS');
    console.log('=' .repeat(60));
    console.log(`💱 Tipo de cambio: 1 USD = ${USD_TO_ARS} ARS`);
    console.log('');
    
    // Leer archivo XLS
    const workbook = XLSX.readFile('lista (1).xls');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 Registros leídos: ${data.length}`);
    console.log('');
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const errorList = [];
    
    // Procesar cada producto
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Extraer datos del producto
        const codigo = cleanText(row['Cód.']);
        const descripcion = cleanText(row['Descripción']);
        const rubro = cleanText(row['Rubro']);
        const marca = cleanText(row['Marca']);
        const precioUSD = parseFloat(row['Precios con IVA (DOLAR (U$S))']);
        
        // Validar datos requeridos
        if (!descripcion || !precioUSD || precioUSD <= 0) {
          skipped++;
          continue;
        }
        
        // Crear nombre del producto
        const productName = `${marca ? marca + ' ' : ''}${descripcion}`;
        
        // Mapear categoría
        const category = mapCategory(rubro);
        
        // Calcular precios usando el mismo sistema que implementamos
        const finalPrice = calculateFinalPrice(precioUSD, category);
        const basePrice = precioUSD * USD_TO_ARS;
        const markup = ((finalPrice - basePrice) / basePrice) * 100;
        
        // Asignar imagen por defecto
        const image = assignDefaultImage(category);
        
        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findFirst({
          where: {
            name: {
              contains: descripcion.substring(0, 30),
              mode: 'insensitive'
            }
          }
        });
        
        if (existingProduct) {
          skipped++;
          continue;
        }
        
        // Crear producto
        await prisma.product.create({
          data: {
            name: productName,
            description: descripcion,
            price: finalPrice,
            basePrice: Math.round(basePrice),
            markup: Math.round(markup * 10) / 10,
            stock: 10, // Stock por defecto
            category: category,
            image: image,
            active: true
          }
        });
        
        console.log(`✅ Importado: ${productName}`);
        console.log(`   🏷️  Categoría: ${category}`);
        console.log(`   💵 Precio USD: $${precioUSD.toFixed(2)}`);
        console.log(`   💰 Precio base ARS: $${basePrice.toLocaleString('es-AR')}`);
        console.log(`   📈 Markup: ${markup.toFixed(1)}%`);
        console.log(`   💵 Precio final ARS: $${finalPrice.toLocaleString('es-AR')}`);
        console.log('');
        
        imported++;
        
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
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
importFromLista();
