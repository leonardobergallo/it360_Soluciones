const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  console.log('🔍 Verificando productos...\n');

  try {
    const products = await prisma.product.findMany();
    
    console.log(`📦 Productos encontrados: ${products.length}`);
    
    if (products.length > 0) {
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   Precio: $${product.price}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   Categoría: ${product.category || 'Sin categoría'}`);
      });
    } else {
      console.log('❌ No hay productos en la base de datos');
      console.log('💡 Ejecuta: node prisma/seed.js');
    }

    const services = await prisma.service.findMany();
    console.log(`\n🔧 Servicios encontrados: ${services.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts(); 