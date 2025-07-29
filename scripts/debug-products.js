const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugProducts() {
  console.log('🔍 Debuggeando productos...\n');

  try {
    // 1. Verificar productos en la base de datos
    console.log('📋 1. Verificando productos en la base de datos...');
    const products = await prisma.product.findMany({
      where: {
        active: true
      }
    });
    console.log(`   ✅ Encontrados ${products.length} productos activos`);

    if (products.length === 0) {
      console.log('❌ No hay productos activos en la base de datos');
      return;
    }

    // 2. Mostrar detalles de cada producto
    console.log('\n📦 2. Detalles de productos:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      • Precio: $${product.price}`);
      console.log(`      • Categoría: ${product.category}`);
      console.log(`      • Activo: ${product.active}`);
      console.log(`      • Stock: ${product.stock}`);
      console.log(`      • ID: ${product.id}`);
      console.log('');
    });

    // 3. Verificar rangos de precios
    console.log('💰 3. Análisis de precios:');
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    console.log(`   • Precio mínimo: $${minPrice}`);
    console.log(`   • Precio máximo: $${maxPrice}`);
    console.log(`   • Precio promedio: $${Math.round(avgPrice)}`);
    console.log(`   • Rango recomendado: $0 - $${Math.ceil(maxPrice * 1.1)}`);

    // 4. Verificar categorías
    console.log('\n🏷️ 4. Categorías disponibles:');
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
      const count = products.filter(p => p.category === category).length;
      console.log(`   • ${category}: ${count} productos`);
    });

    // 5. Simular filtros
    console.log('\n🔍 5. Simulando filtros:');
    
    // Filtro por precio (rango anterior problemático)
    const oldPriceFilter = products.filter(p => p.price >= 0 && p.price <= 10000);
    console.log(`   • Filtro precio $0-$10,000: ${oldPriceFilter.length} productos`);
    
    // Filtro por precio (rango corregido)
    const newPriceFilter = products.filter(p => p.price >= 0 && p.price <= 200000);
    console.log(`   • Filtro precio $0-$200,000: ${newPriceFilter.length} productos`);
    
    // Sin filtros
    console.log(`   • Sin filtros: ${products.length} productos`);

    // 6. Verificar productos que no pasarían el filtro anterior
    const blockedByOldFilter = products.filter(p => p.price > 10000);
    if (blockedByOldFilter.length > 0) {
      console.log('\n🚫 6. Productos bloqueados por filtro anterior:');
      blockedByOldFilter.forEach(product => {
        console.log(`   • ${product.name} - $${product.price} (${product.category})`);
      });
    }

    console.log('\n✅ Debug completado');
    console.log('\n💡 Recomendaciones:');
    console.log('   1. El rango de precios ya fue corregido a $0-$200,000');
    console.log('   2. Todos los productos deberían mostrarse ahora');
    console.log('   3. Verifica en http://localhost:3000/catalogo');

  } catch (error) {
    console.error('❌ Error durante el debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProducts(); 