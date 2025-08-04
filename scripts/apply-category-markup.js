const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuración de markup por categoría
const categoryMarkups = {
  'smartphones': 25,      // 25% markup para smartphones
  'tablets': 20,          // 20% markup para tablets
  'smartwatches': 30,     // 30% markup para smartwatches
  'headphones': 35,       // 35% markup para auriculares
  'gaming': 40,           // 40% markup para gaming
  'home': 25,             // 25% markup para hogar
  'automotive': 30,       // 30% markup para automotriz
  'tools': 45,            // 45% markup para herramientas
  'furniture': 50,        // 50% markup para muebles
  'kitchen': 35,          // 35% markup para cocina
  'security': 30,         // 30% markup para seguridad
  'lighting': 40,         // 40% markup para iluminación
  'general': 20           // 20% markup por defecto
};

async function applyCategoryMarkup() {
  try {
    console.log('🔄 Aplicando markup por categoría...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany();
    console.log(`📦 Encontrados ${products.length} productos para procesar\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      try {
        // Determinar la categoría basada en el nombre del producto
        let category = 'general';
        const productName = product.name.toLowerCase();

        if (productName.includes('xiaomi') || productName.includes('redmi') || productName.includes('phone')) {
          category = 'smartphones';
        } else if (productName.includes('pad') || productName.includes('tablet')) {
          category = 'tablets';
        } else if (productName.includes('watch') || productName.includes('smartwatch') || productName.includes('imiki') || productName.includes('scykei')) {
          category = 'smartwatches';
        } else if (productName.includes('auricular') || productName.includes('headphone') || productName.includes('jbl') || productName.includes('lenovo') || productName.includes('monster') || productName.includes('klip') || productName.includes('alo') || productName.includes('foxbox') || productName.includes('p47')) {
          category = 'headphones';
        } else if (productName.includes('ps5') || productName.includes('gaming') || productName.includes('playstation')) {
          category = 'gaming';
        } else if (productName.includes('bombilla') || productName.includes('led') || productName.includes('iluminación') || productName.includes('nexxt')) {
          category = 'lighting';
        } else if (productName.includes('cámara') || productName.includes('seguridad') || productName.includes('cerradura') || productName.includes('sensor')) {
          category = 'security';
        } else if (productName.includes('cafetera') || productName.includes('exprimidor') || productName.includes('molinillo') || productName.includes('tostadora') || productName.includes('moulinex')) {
          category = 'kitchen';
        } else if (productName.includes('silla') || productName.includes('escritorio') || productName.includes('mueble') || productName.includes('xtech')) {
          category = 'furniture';
        } else if (productName.includes('herramienta') || productName.includes('kit') || productName.includes('nisuta')) {
          category = 'tools';
        } else if (productName.includes('auto') || productName.includes('vehículo') || productName.includes('soporte') || productName.includes('arrancador') || productName.includes('compresor')) {
          category = 'automotive';
        } else if (productName.includes('hamaca') || productName.includes('conservador') || productName.includes('vino') || productName.includes('xienan')) {
          category = 'home';
        }

        const markup = categoryMarkups[category] || categoryMarkups.general;
        const basePrice = product.basePrice || product.price;
        const newPrice = basePrice * (1 + markup / 100);

        // Actualizar el producto
        await prisma.product.update({
          where: { id: product.id },
          data: {
            category: category,
            basePrice: basePrice,
            markup: markup,
            price: newPrice
          }
        });

        console.log(`✅ Actualizado: ${product.name}`);
        console.log(`   📂 Categoría: ${category}`);
        console.log(`   💰 Precio base: $${basePrice.toFixed(2)}`);
        console.log(`   📈 Markup: ${markup}%`);
        console.log(`   💵 Nuevo precio: $${newPrice.toFixed(2)}\n`);

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

    console.log('\n📋 Configuración de markup por categoría:');
    Object.entries(categoryMarkups).forEach(([cat, markup]) => {
      console.log(`   ${cat}: ${markup}%`);
    });

  } catch (error) {
    console.error('❌ Error en el proceso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
applyCategoryMarkup(); 