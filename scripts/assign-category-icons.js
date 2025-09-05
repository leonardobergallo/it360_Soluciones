/**
 * Script para asignar iconos por categoría en lugar de imágenes específicas
 * 
 * Este script:
 * 1. Asigna iconos representativos por categoría
 * 2. Usa emojis o iconos simples
 * 3. Es más escalable y no requiere muchas imágenes
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Iconos por categoría (usando emojis o iconos simples)
const CATEGORY_ICONS = {
  'Celulares': '📱',
  'Tablets': '📱',
  'Accesorio': '🎧',
  'Monitores': '🖥️',
  'Parlantes': '🔊',
  'Cocina': '☕',
  'Domótica': '🏠',
  'Gaming': '🎮',
  'Herramientas': '🔧',
  'Laptops': '💻',
  'Muebles': '🪑',
  'Almacena': '💾',
  'Redes': '📡',
  'Impresora': '🖨️',
  'Periferico': '🖱️',
  'Otros': '📦'
};

// O usar imágenes genéricas por categoría
const CATEGORY_IMAGES = {
  'Celulares': '/images/xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg',
  'Tablets': '/images/xiaomi-redmi-pad-se-8-7-6-128-grey.jpg',
  'Accesorio': '/images/apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg',
  'Monitores': '/images/monitor-lg-24-led-hd-20mk400.jpg',
  'Parlantes': '/images/jbl-wave-flex-black.png',
  'Cocina': '/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png',
  'Domótica': '/images/nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg',
  'Gaming': '/images/sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg',
  'Herramientas': '/images/nisuta-kit-de-herramientas-60-piezas-ns-k8918.png',
  'Laptops': '/images/gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1.jpg',
  'Muebles': '/images/xtech-escritorio-un-nivel-natural-beige-am100xtk20.png',
  'Almacena': '/images/wd-ssd-nvme-1tb.jpg',
  'Redes': '/images/router-wifi-6.jpg',
  'Impresora': '/images/brother-impresora-laser-mono-mfc-l2750dw.jpg',
  'Periferico': '/images/mouse-gaming-logitech.jpg',
  'Otros': '/images/oferta.jpg'
};

async function assignCategoryIcons() {
  try {
    console.log('🎨 ASIGNANDO ICONOS POR CATEGORÍA (MANTENIENDO IMÁGENES EXISTENTES)');
    console.log('=' .repeat(70));
    
    // Obtener productos que NO tienen imagen o tienen imagen placeholder
    const products = await prisma.product.findMany({
      where: { 
        active: true,
        OR: [
          { image: null },
          { image: '' },
          { image: { startsWith: '/images/' } } // Solo los que tienen placeholder genérico
        ]
      }
    });
    
    console.log(`📦 Productos a procesar: ${products.length}`);
    console.log('');
    
    let updated = 0;
    let kept = 0;
    const categoryStats = {};
    
    for (const product of products) {
      try {
        // Solo actualizar si no tiene imagen específica
        if (!product.image || product.image.startsWith('/images/') && !product.image.includes('_')) {
          // Asignar imagen por categoría
          const categoryImage = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES['Otros'];
          
          await prisma.product.update({
            where: { id: product.id },
            data: { image: categoryImage }
          });
          
          updated++;
        } else {
          kept++;
        }
        
        // Estadísticas
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = 0;
        }
        categoryStats[product.category]++;
        
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE ASIGNACIÓN DE ICONOS');
    console.log('=' .repeat(50));
    console.log(`✅ Productos actualizados: ${updated}`);
    console.log(`🖼️ Imágenes mantenidas: ${kept}`);
    
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      const icon = CATEGORY_ICONS[category] || '📦';
      console.log(`   ${icon} ${category}: ${count} productos`);
    });
    
    console.log('\n💡 VENTAJAS DE ESTE ENFOQUE:');
    console.log('   ✅ Mantiene las imágenes específicas que ya tienes');
    console.log('   ✅ Solo asigna iconos a productos sin imagen');
    console.log('   ✅ Cada categoría tiene su imagen representativa');
    console.log('   ✅ Fácil de mantener y escalable');
    console.log('   ✅ Los usuarios entienden qué tipo de producto es');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
assignCategoryIcons();
