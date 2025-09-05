const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Mapeo de categorías a imágenes que SÍ existen
const CATEGORY_IMAGES = {
  'Celulares': '/images/xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg',
  'Tablets': '/images/xiaomi-redmi-pad-se-8-7-6-128-grey.jpg',
  'Accesorio': '/images/apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg',
  'Accesorios': '/images/apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg',
  'Monitores': '/images/klip-xtreme-soporte-monitor-17-a-27-pulg-p-escrito.png',
  'Parlantes': '/images/jbl-wave-flex-black.png',
  'Cocina': '/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png',
  'Domótica': '/images/nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg',
  'Gaming': '/images/sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg',
  'Herramientas': '/images/nisuta-kit-de-herramientas-60-piezas-ns-k8918.png',
  'Laptops': '/images/gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1.jpg',
  'Muebles': '/images/xtech-escritorio-un-nivel-natural-beige-am100xtk20.png',
  'Almacena': '/images/oferta.jpg',
  'Almacenamiento': '/images/oferta.jpg',
  'Redes': '/images/oferta.jpg',
  'Impresora': '/images/oferta.jpg',
  'Impresoras': '/images/oferta.jpg',
  'Periferico': '/images/oferta.jpg',
  'Periféricos': '/images/oferta.jpg',
  'Otros': '/images/oferta.jpg',
  'Memoria': '/images/oferta.jpg',
  'Prueba': '/images/oferta.jpg',
  'services': '/images/oferta.jpg'
};

async function fixBrokenImages() {
  try {
    console.log('🔧 CORRIGIENDO IMÁGENES ROTAS');
    console.log('=' .repeat(50));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, category: true, image: true }
    });
    
    console.log(`📦 Productos a verificar: ${products.length}`);
    console.log('');
    
    let fixed = 0;
    let alreadyValid = 0;
    const categoryStats = {};
    
    for (const product of products) {
      let needsFix = false;
      let reason = '';
      
      // Verificar si la imagen está rota
      if (!product.image) {
        needsFix = true;
        reason = 'Sin imagen';
      } else if (product.image.startsWith('/images/')) {
        const imagePath = path.join('public', product.image);
        if (!fs.existsSync(imagePath)) {
          needsFix = true;
          reason = 'Archivo no existe';
        }
      } else if (!product.image.startsWith('http')) {
        needsFix = true;
        reason = 'Ruta inválida';
      }
      
      if (needsFix) {
        // Asignar imagen por categoría
        const categoryImage = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES['Otros'];
        
        await prisma.product.update({
          where: { id: product.id },
          data: { image: categoryImage }
        });
        
        // Estadísticas
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = 0;
        }
        categoryStats[product.category]++;
        
        fixed++;
        
        if (fixed <= 10) { // Mostrar solo los primeros 10
          console.log(`✅ ${product.name} (${product.category}) - ${reason}`);
        }
      } else {
        alreadyValid++;
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE CORRECCIÓN');
    console.log('=' .repeat(40));
    console.log(`✅ Imágenes corregidas: ${fixed}`);
    console.log(`🖼️ Imágenes ya válidas: ${alreadyValid}`);
    console.log(`📦 Total productos: ${products.length}`);
    
    console.log('\n📈 CORRECCIONES POR CATEGORÍA:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} productos`);
    });
    
    console.log('\n💡 IMÁGENES ASIGNADAS:');
    Object.entries(CATEGORY_IMAGES).forEach(([category, image]) => {
      console.log(`   ${category}: ${image}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixBrokenImages();
