const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixImageNames() {
  try {
    console.log('🔧 Corrigiendo nombres de imágenes...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany();
    console.log(`📦 Total de productos encontrados: ${products.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Solo actualizar productos que tengan rutas de imágenes
      if (product.image && product.image.startsWith('/images/')) {
        // Extraer el nombre del archivo y la extensión
        const pathParts = product.image.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        // Verificar si ya tiene el sufijo -1
        if (!fileName.includes('-1.')) {
          // Agregar el sufijo -1 antes de la extensión
          const nameParts = fileName.split('.');
          const extension = nameParts.pop();
          const nameWithoutExt = nameParts.join('.');
          const newFileName = `${nameWithoutExt}-1.${extension}`;
          
          const newPath = `/images/${newFileName}`;
          
          await prisma.product.update({
            where: { id: product.id },
            data: { image: newPath }
          });
          
          console.log(`✅ Corregido: ${product.name}`);
          console.log(`   📸 Ruta anterior: ${product.image}`);
          console.log(`   📸 Nueva ruta: ${newPath}`);
          updated++;
        } else {
          console.log(`⏭️  Saltado: ${product.name} (ya tiene sufijo -1)`);
          skipped++;
        }
      } else {
        console.log(`⏭️  Saltado: ${product.name} (sin imagen o ruta incorrecta)`);
        skipped++;
      }
    }

    console.log(`\n🎉 Corrección completada!`);
    console.log(`   ✅ Productos actualizados: ${updated}`);
    console.log(`   ⏭️  Productos saltados: ${skipped}`);
    console.log(`   📊 Total procesados: ${products.length}`);

    // Mostrar algunos ejemplos de rutas corregidas
    console.log('\n📋 Ejemplos de rutas corregidas:');
    console.log('   • /images/xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg');
    console.log('   → /images/xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga-1.jpg');
    console.log('   • /images/apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg');
    console.log('   → /images/apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo-1.jpg');

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixImageNames(); 