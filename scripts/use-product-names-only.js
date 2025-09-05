/**
 * Script para usar solo el nombre del producto como "imagen"
 * 
 * Este script:
 * 1. Asigna un valor que indique que se use el nombre
 * 2. Modifica el frontend para mostrar el nombre en lugar de imagen
 * 3. Es la solución más simple y práctica
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function useProductNamesOnly() {
  try {
    console.log('📝 CONFIGURANDO SISTEMA DE NOMBRES DE PRODUCTOS');
    console.log('=' .repeat(60));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true }
    });
    
    console.log(`📦 Productos a procesar: ${products.length}`);
    console.log('');
    
    let updated = 0;
    const categoryStats = {};
    
    for (const product of products) {
      try {
        // Asignar un valor especial que indique "usar nombre"
        await prisma.product.update({
          where: { id: product.id },
          data: { image: 'USE_NAME' }
        });
        
        // Estadísticas
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = 0;
        }
        categoryStats[product.category]++;
        
        updated++;
        
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE CONFIGURACIÓN');
    console.log('=' .repeat(50));
    console.log(`✅ Productos actualizados: ${updated}`);
    
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   📝 ${category}: ${count} productos`);
    });
    
    console.log('\n💡 VENTAJAS DE ESTE ENFOQUE:');
    console.log('   ✅ No necesitas ninguna imagen');
    console.log('   ✅ El nombre del producto es más informativo');
    console.log('   ✅ Carga más rápida');
    console.log('   ✅ Fácil de implementar');
    
    console.log('\n🔧 PRÓXIMOS PASOS:');
    console.log('   1. Modificar el componente del catálogo');
    console.log('   2. Mostrar el nombre del producto en lugar de imagen');
    console.log('   3. Usar iconos por categoría como decoración');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
useProductNamesOnly();
