const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixImagePaths() {
  try {
    console.log('🔧 Corrigiendo rutas de imágenes...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany();
    console.log(`📦 Total de productos encontrados: ${products.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Solo actualizar productos que tengan rutas incorrectas
      if (product.image && product.image.startsWith('/public/images/')) {
        const newPath = product.image.replace('/public/images/', '/images/');
        
        await prisma.product.update({
          where: { id: product.id },
          data: { image: newPath }
        });
        
        console.log(`✅ Corregido: ${product.name}`);
        console.log(`   📸 Ruta anterior: ${product.image}`);
        console.log(`   📸 Nueva ruta: ${newPath}`);
        updated++;
      } else {
        console.log(`⏭️  Saltado: ${product.name} (ruta correcta o sin imagen)`);
        skipped++;
      }
    }

    console.log(`\n🎉 Corrección completada!`);
    console.log(`   ✅ Productos actualizados: ${updated}`);
    console.log(`   ⏭️  Productos saltados: ${skipped}`);
    console.log(`   📊 Total procesados: ${products.length}`);

    // Mostrar algunos ejemplos de rutas corregidas
    console.log('\n📋 Ejemplos de rutas corregidas:');
    console.log('   • /public/images/xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg');
    console.log('   → /images/xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg');
    console.log('   • /public/images/apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg');
    console.log('   → /images/apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg');

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixImagePaths(); 