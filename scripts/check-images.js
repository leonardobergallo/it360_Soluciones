const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkImages() {
  try {
    console.log('🔍 VERIFICANDO IMÁGENES DE PRODUCTOS');
    console.log('=' .repeat(50));
    
    const products = await prisma.product.findMany({
      take: 10,
      select: { name: true, category: true, image: true }
    });
    
    console.log('📦 MUESTRA DE PRODUCTOS CON SUS IMÁGENES:');
    console.log('');
    
    products.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Categoría: ${p.category}`);
      console.log(`   Imagen: ${p.image}`);
      console.log('');
    });
    
    // Contar por categoría
    const categoryCount = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true }
    });
    
    console.log('📊 PRODUCTOS POR CATEGORÍA:');
    categoryCount.forEach(cat => {
      console.log(`   ${cat.category}: ${cat._count.category} productos`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages();
