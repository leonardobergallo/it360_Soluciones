const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function useNamesInsteadOfIcons() {
  try {
    console.log('📝 CAMBIANDO A SISTEMA DE NOMBRES EN LUGAR DE ICONOS');
    console.log('=' .repeat(60));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, category: true, image: true }
    });
    
    console.log(`📦 Productos a procesar: ${products.length}`);
    console.log('');
    
    let updated = 0;
    let kept = 0;
    const categoryStats = {};
    
    for (const product of products) {
      try {
        // Solo cambiar productos que tienen imágenes genéricas o de categoría
        // Mantener productos que tienen imágenes específicas (que contienen guiones o caracteres específicos)
        const hasSpecificImage = product.image && (
          product.image.includes('xiaomi') ||
          product.image.includes('apple-watch') ||
          product.image.includes('jbl-wave') ||
          product.image.includes('moulinex') ||
          product.image.includes('nexxt-bombilla') ||
          product.image.includes('sony-ps5') ||
          product.image.includes('nisuta-kit') ||
          product.image.includes('gateway') ||
          product.image.includes('xtech-escritorio') ||
          product.image.includes('klip-xtreme-soporte')
        );
        
        if (hasSpecificImage) {
          // Mantener la imagen específica
          kept++;
        } else {
          // Cambiar a sistema de nombres
          await prisma.product.update({
            where: { id: product.id },
            data: { image: 'USE_NAME' }
          });
          
          updated++;
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
    console.log('\n📊 RESUMEN DE CAMBIO A NOMBRES');
    console.log('=' .repeat(50));
    console.log(`✅ Productos cambiados a nombres: ${updated}`);
    console.log(`🖼️ Imágenes específicas mantenidas: ${kept}`);
    console.log(`📦 Total productos: ${products.length}`);
    
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   📝 ${category}: ${count} productos`);
    });
    
    console.log('\n💡 VENTAJAS DE ESTE ENFOQUE:');
    console.log('   ✅ Mantiene imágenes específicas cuando son relevantes');
    console.log('   ✅ Usa nombres para productos sin imagen específica');
    console.log('   ✅ Más informativo para el usuario');
    console.log('   ✅ Carga más rápida');
    console.log('   ✅ Fácil de mantener');
    
    console.log('\n🔧 PRÓXIMOS PASOS:');
    console.log('   1. Modificar el componente del catálogo');
    console.log('   2. Mostrar el nombre cuando image = "USE_NAME"');
    console.log('   3. Mantener imágenes cuando son específicas');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
useNamesInsteadOfIcons();
