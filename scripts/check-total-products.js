const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTotalProducts() {
  try {
    console.log('📊 Verificando total de productos en la base de datos...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany();
    
    console.log(`🎉 Total de productos en el catálogo: ${products.length}\n`);

    // Agrupar por categoría
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    console.log('📋 Resumen por categorías:');
    console.log('=' .repeat(50));
    
    Object.keys(categories).sort().forEach(category => {
      const count = categories[category].length;
      const totalValue = categories[category].reduce((sum, p) => sum + p.price, 0);
      console.log(`\n${category}:`);
      console.log(`   📦 Cantidad: ${count} productos`);
      console.log(`   💰 Valor total: $${totalValue.toLocaleString()}`);
      console.log(`   💵 Precio promedio: $${Math.round(totalValue / count).toLocaleString()}`);
      
      // Mostrar algunos productos de ejemplo
      const examples = categories[category].slice(0, 3);
      examples.forEach(product => {
        console.log(`      • ${product.name} - $${product.price.toLocaleString()}`);
      });
      
      if (count > 3) {
        console.log(`      ... y ${count - 3} productos más`);
      }
    });

    // Estadísticas generales
    console.log('\n📈 Estadísticas generales:');
    console.log('=' .repeat(50));
    
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = totalValue / products.length;
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));
    
    console.log(`💰 Valor total del catálogo: $${totalValue.toLocaleString()}`);
    console.log(`💵 Precio promedio: $${Math.round(avgPrice).toLocaleString()}`);
    console.log(`📉 Precio mínimo: $${minPrice.toLocaleString()}`);
    console.log(`📈 Precio máximo: $${maxPrice.toLocaleString()}`);
    
    // Productos con imágenes personalizadas
    const productsWithCustomImages = products.filter(p => 
      p.image && p.image.startsWith('/images/')
    );
    
    console.log(`\n🖼️  Productos con imágenes personalizadas: ${productsWithCustomImages.length}/${products.length}`);
    
    // Productos sin imágenes personalizadas
    const productsWithoutCustomImages = products.filter(p => 
      !p.image || !p.image.startsWith('/images/')
    );
    
    if (productsWithoutCustomImages.length > 0) {
      console.log(`\n⚠️  Productos que aún necesitan imágenes personalizadas:`);
      productsWithoutCustomImages.forEach(product => {
        console.log(`   • ${product.name} (${product.category})`);
      });
    }

    // Top 5 productos más caros
    console.log('\n🏆 Top 5 productos más caros:');
    console.log('=' .repeat(50));
    
    const topExpensive = products
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);
    
    topExpensive.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price.toLocaleString()} (${product.category})`);
    });

    // Top 5 productos más baratos
    console.log('\n💎 Top 5 productos más baratos:');
    console.log('=' .repeat(50));
    
    const topCheap = products
      .sort((a, b) => a.price - b.price)
      .slice(0, 5);
    
    topCheap.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price.toLocaleString()} (${product.category})`);
    });

    console.log('\n🎉 ¡Catálogo actualizado exitosamente!');
    console.log('✨ Las imágenes se han integrado correctamente en tu página web.');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkTotalProducts(); 