const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Iconos por categoría
const CATEGORY_ICONS = {
  'Celulares': '📱',
  'Tablets': '📱',
  'Accesorio': '🎧',
  'Accesorios': '🎧',
  'Monitores': '🖥️',
  'Parlantes': '🔊',
  'Cocina': '☕',
  'Domótica': '🏠',
  'Gaming': '🎮',
  'Herramientas': '🔧',
  'Laptops': '💻',
  'Muebles': '🪑',
  'Almacena': '💾',
  'Almacenamiento': '💾',
  'Redes': '📡',
  'Impresora': '🖨️',
  'Impresoras': '🖨️',
  'Periferico': '🖱️',
  'Periféricos': '🖱️',
  'Otros': '📦',
  'Memoria': '💾',
  'Prueba': '📦',
  'services': '🔧',
  'PCs Armadas / AIOs': '💻',
  'Adaptadores': '🔌',
  'Teclados C/Cable': '⌨️',
  'Impresora Multifuncion Inyec Tinta': '🖨️',
  'Smartwatch y Smartband': '⌚',
  'Mouses C/Cable': '🖱️',
  'Micro Socket 1200': '🔧',
  'Iluminacion': '💡',
  'Accesorios y Gadgets Geeks': '🎮',
  'Muebles Sillas': '🪑',
  'Bazar y Hogar': '🏠',
  'Placas / Puertos / Controladoras / Hub usb': '🔌',
  'Conectividad Placas De Red': '📡',
  'Conectividad Ir Y Bluetooth': '📡'
};

async function convertAllToIcons() {
  try {
    console.log('🎨 CONVIRTIENDO TODOS LOS PRODUCTOS A ICONOS POR CATEGORÍA');
    console.log('=' .repeat(70));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, category: true, image: true }
    });
    
    console.log(`📦 Productos a procesar: ${products.length}`);
    console.log('');
    
    let updated = 0;
    const categoryStats = {};
    
    for (const product of products) {
      try {
        // Asignar icono por categoría a TODOS los productos
        const icon = CATEGORY_ICONS[product.category] || '📦';
        const iconData = `ICON:${icon}`;
        
        await prisma.product.update({
          where: { id: product.id },
          data: { image: iconData }
        });
        
        // Estadísticas
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = 0;
        }
        categoryStats[product.category]++;
        
        updated++;
        
        if (updated <= 10) { // Mostrar solo los primeros 10
          console.log(`✅ ${product.name} (${product.category}) → ${icon}`);
        }
        
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE CONVERSIÓN');
    console.log('=' .repeat(50));
    console.log(`✅ Productos actualizados: ${updated}`);
    console.log(`📦 Total productos: ${products.length}`);
    
    console.log('\n📈 ICONOS ASIGNADOS POR CATEGORÍA:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      const icon = CATEGORY_ICONS[category] || '📦';
      console.log(`   ${icon} ${category}: ${count} productos`);
    });
    
    console.log('\n💡 VENTAJAS DEL ESTÁNDAR:');
    console.log('   ✅ Consistencia visual en todo el catálogo');
    console.log('   ✅ Iconos informativos por categoría');
    console.log('   ✅ Carga rápida sin imágenes');
    console.log('   ✅ Fácil mantenimiento');
    console.log('   ✅ Escalable para nuevos productos');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
convertAllToIcons();
