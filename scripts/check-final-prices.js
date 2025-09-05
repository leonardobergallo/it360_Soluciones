const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkFinalPrices() {
  try {
    console.log('💰 VERIFICACIÓN FINAL DE PRECIOS');
    console.log('=' .repeat(50));
    
    const zeroPrice = await prisma.product.count({ where: { price: 0 } });
    const validPrice = await prisma.product.count({ where: { price: { gt: 0 } } });
    const total = await prisma.product.count();
    
    console.log(`📦 Total de productos: ${total}`);
    console.log(`✅ Productos con precio válido: ${validPrice}`);
    console.log(`❌ Productos con precio $0: ${zeroPrice}`);
    console.log('');
    
    if (zeroPrice > 0) {
      console.log('⚠️  Productos que aún tienen precio $0:');
      const zeroProducts = await prisma.product.findMany({
        where: { price: 0 },
        select: { name: true, category: true }
      });
      
      zeroProducts.forEach(product => {
        console.log(`   - ${product.name} (${product.category})`);
      });
    }
    
    // Mostrar rango de precios
    const minPrice = await prisma.product.findFirst({
      where: { price: { gt: 0 } },
      orderBy: { price: 'asc' },
      select: { name: true, price: true }
    });
    
    const maxPrice = await prisma.product.findFirst({
      where: { price: { gt: 0 } },
      orderBy: { price: 'desc' },
      select: { name: true, price: true }
    });
    
    if (minPrice && maxPrice) {
      console.log('');
      console.log('📊 RANGO DE PRECIOS:');
      console.log(`   💰 Precio mínimo: $${minPrice.price.toLocaleString('es-AR')} (${minPrice.name})`);
      console.log(`   💰 Precio máximo: $${maxPrice.price.toLocaleString('es-AR')} (${maxPrice.name})`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFinalPrices();
