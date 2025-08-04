const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProductsWithMarkup() {
  try {
    console.log('🔄 Actualizando productos con campos de markup...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany();
    console.log(`📦 Encontrados ${products.length} productos para actualizar\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      try {
        // Si el producto ya tiene basePrice o markup, saltarlo
        if (product.basePrice !== null || product.markup !== null) {
          console.log(`⏭️  Saltando: ${product.name} (ya tiene markup configurado)`);
          skippedCount++;
          continue;
        }

        // Establecer precio base como el precio actual
        const basePrice = product.price;
        // Establecer markup inicial en 0%
        const markup = 0;

        await prisma.product.update({
          where: { id: product.id },
          data: {
            basePrice: basePrice,
            markup: markup
          }
        });

        console.log(`✅ Actualizado: ${product.name}`);
        console.log(`   💰 Precio base: $${basePrice.toFixed(2)}`);
        console.log(`   📈 Markup: ${markup}%`);
        console.log(`   💵 Precio final: $${product.price.toFixed(2)}\n`);

        updatedCount++;
      } catch (error) {
        console.error(`❌ Error actualizando ${product.name}:`, error.message);
      }
    }

    console.log('🎉 Proceso completado!');
    console.log(`📊 Resumen:`);
    console.log(`   ✅ Productos actualizados: ${updatedCount}`);
    console.log(`   ⏭️  Productos saltados: ${skippedCount}`);
    console.log(`   📦 Total procesados: ${products.length}`);

  } catch (error) {
    console.error('❌ Error en el proceso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
updateProductsWithMarkup(); 