/**
 * Script para corregir las rutas de imágenes y asignar las correctas
 * 
 * Este script:
 * 1. Revisa todas las imágenes disponibles en public/images
 * 2. Corrige las rutas de las imágenes en la base de datos
 * 3. Asigna imágenes reales a los productos
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Función para obtener todas las imágenes disponibles
function getAvailableImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const files = fs.readdirSync(imagesDir);
  
  return files
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
    .map(file => `/images/${file}`)
    .sort();
}

// Función para encontrar la mejor imagen para un producto
function findBestImage(productName, category, availableImages) {
  const name = productName.toLowerCase();
  
  // Buscar coincidencias exactas por nombre
  for (const image of availableImages) {
    const imageName = path.basename(image, path.extname(image)).toLowerCase();
    
    // Coincidencias específicas
    if (name.includes('xiaomi') && imageName.includes('xiaomi')) {
      return image;
    }
    if (name.includes('apple') && imageName.includes('apple')) {
      return image;
    }
    if (name.includes('samsung') && imageName.includes('samsung')) {
      return image;
    }
    if (name.includes('sony') && imageName.includes('sony')) {
      return image;
    }
    if (name.includes('jbl') && imageName.includes('jbl')) {
      return image;
    }
    if (name.includes('lenovo') && imageName.includes('lenovo')) {
      return image;
    }
    if (name.includes('moulinex') && imageName.includes('moulinex')) {
      return image;
    }
    if (name.includes('nexxt') && imageName.includes('nexxt')) {
      return image;
    }
    if (name.includes('foxbox') && imageName.includes('foxbox')) {
      return image;
    }
    if (name.includes('gadnic') && imageName.includes('gadnic')) {
      return image;
    }
    if (name.includes('xtech') && imageName.includes('xtech')) {
      return image;
    }
    if (name.includes('scykei') && imageName.includes('scykei')) {
      return image;
    }
    if (name.includes('nisuta') && imageName.includes('nisuta')) {
      return image;
    }
    if (name.includes('klip') && imageName.includes('klip')) {
      return image;
    }
    if (name.includes('t-g') && imageName.includes('t-g')) {
      return image;
    }
    if (name.includes('xienan') && imageName.includes('xienan')) {
      return image;
    }
    if (name.includes('south port') && imageName.includes('south-port')) {
      return image;
    }
    if (name.includes('alo') && imageName.includes('alo')) {
      return image;
    }
    if (name.includes('p47') && imageName.includes('p47')) {
      return image;
    }
    if (name.includes('monster') && imageName.includes('monster')) {
      return image;
    }
    if (name.includes('imiki') && imageName.includes('imiki')) {
      return image;
    }
    if (name.includes('gateway') && imageName.includes('gateway')) {
      return image;
    }
  }
  
  // Buscar por tipo de producto
  for (const image of availableImages) {
    const imageName = path.basename(image, path.extname(image)).toLowerCase();
    
    if (name.includes('auricular') && imageName.includes('auricular')) {
      return image;
    }
    if (name.includes('parlante') && imageName.includes('parlante')) {
      return image;
    }
    if (name.includes('cafetera') && imageName.includes('cafetera')) {
      return image;
    }
    if (name.includes('exprimidor') && imageName.includes('exprimidor')) {
      return image;
    }
    if (name.includes('molinillo') && imageName.includes('molinillo')) {
      return image;
    }
    if (name.includes('tostadora') && imageName.includes('tostadora')) {
      return image;
    }
    if (name.includes('bombilla') && imageName.includes('bombilla')) {
      return image;
    }
    if (name.includes('cámara') && imageName.includes('camara')) {
      return image;
    }
    if (name.includes('herramientas') && imageName.includes('herramientas')) {
      return image;
    }
    if (name.includes('escritorio') && imageName.includes('escritorio')) {
      return image;
    }
    if (name.includes('silla') && imageName.includes('silla')) {
      return image;
    }
    if (name.includes('hamaca') && imageName.includes('hamaca')) {
      return image;
    }
    if (name.includes('compresor') && imageName.includes('compresor')) {
      return image;
    }
    if (name.includes('soporte') && imageName.includes('soporte')) {
      return image;
    }
    if (name.includes('cargador') && imageName.includes('cargador')) {
      return image;
    }
    if (name.includes('arrancador') && imageName.includes('arrancador')) {
      return image;
    }
    if (name.includes('conservador') && imageName.includes('conservador')) {
      return image;
    }
    if (name.includes('vino') && imageName.includes('vino')) {
      return image;
    }
    if (name.includes('smartwatch') && imageName.includes('smartwatch')) {
      return image;
    }
    if (name.includes('watch') && imageName.includes('watch')) {
      return image;
    }
    if (name.includes('airpods') && imageName.includes('airpods')) {
      return image;
    }
    if (name.includes('earpods') && imageName.includes('earpods')) {
      return image;
    }
  }
  
  // Buscar por categoría
  const categoryImages = {
    'Celulares': ['xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg'],
    'Tablets': ['xiaomi-redmi-pad-se-8-7-6-128-grey.jpg'],
    'Accesorio': ['apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg'],
    'Monitores': ['monitor-lg-24-led-hd-20mk400.jpg'],
    'Parlantes': ['jbl-wave-flex-black.png'],
    'Cocina': ['moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png'],
    'Domótica': ['nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg'],
    'Gaming': ['sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg'],
    'Herramientas': ['nisuta-kit-de-herramientas-60-piezas-ns-k8918.png'],
    'Laptops': ['gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1.jpg'],
    'Muebles': ['xtech-escritorio-un-nivel-natural-beige-am100xtk20.png'],
    'Almacena': ['wd-ssd-nvme-1tb.jpg'],
    'Redes': ['router-wifi-6.jpg'],
    'Impresora': ['brother-impresora-laser-mono-mfc-l2750dw.jpg'],
    'Periferico': ['mouse-gaming-logitech.jpg'],
    'Otros': ['cable-usb-a-type-c-1-8mts-black-noganet.jpg']
  };
  
  if (categoryImages[category]) {
    for (const defaultImage of categoryImages[category]) {
      const found = availableImages.find(img => img.includes(defaultImage));
      if (found) return found;
    }
  }
  
  // Imagen por defecto
  return '/images/oferta.jpg';
}

async function fixImagePaths() {
  try {
    console.log('🖼️  CORRIGIENDO RUTAS DE IMÁGENES');
    console.log('=' .repeat(60));
    
    // Obtener imágenes disponibles
    const availableImages = getAvailableImages();
    console.log(`📸 Imágenes disponibles: ${availableImages.length}`);
    console.log('');
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true }
    });
    
    console.log(`📦 Productos a procesar: ${products.length}`);
    console.log('');
    
    let updated = 0;
    let skipped = 0;
    const errors = [];
    
    for (const product of products) {
      try {
        // Encontrar la mejor imagen para el producto
        const bestImage = findBestImage(product.name, product.category, availableImages);
        
        // Verificar si la imagen actual es diferente
        if (product.image !== bestImage) {
          await prisma.product.update({
            where: { id: product.id },
            data: { image: bestImage }
          });
          
          console.log(`✅ ${product.name}`);
          console.log(`   🏷️  Categoría: ${product.category}`);
          console.log(`   🖼️  Imagen anterior: ${product.image || 'Sin imagen'}`);
          console.log(`   🖼️  Imagen nueva: ${bestImage}`);
          console.log('');
          
          updated++;
        } else {
          skipped++;
        }
        
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
        errors.push({ product: product.name, error: error.message });
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE CORRECCIÓN DE IMÁGENES');
    console.log('=' .repeat(50));
    console.log(`✅ Productos actualizados: ${updated}`);
    console.log(`⏭️  Productos sin cambios: ${skipped}`);
    console.log(`❌ Errores: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  ERRORES ENCONTRADOS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.product}: ${error.error}`);
      });
    }
    
    // Mostrar estadísticas por categoría
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    const categoryStats = {};
    const allProducts = await prisma.product.findMany({
      where: { active: true }
    });
    
    allProducts.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = { count: 0, withImages: 0 };
      }
      categoryStats[product.category].count++;
      if (product.image && product.image !== '/images/oferta.jpg') {
        categoryStats[product.category].withImages++;
      }
    });
    
    Object.entries(categoryStats).forEach(([category, stats]) => {
      const percentage = ((stats.withImages / stats.count) * 100).toFixed(1);
      console.log(`   ${category}: ${stats.withImages}/${stats.count} (${percentage}%)`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixImagePaths();
