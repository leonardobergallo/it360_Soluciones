// Script para verificar la importación de productos
async function verifyImport() {
  console.log('🔍 VERIFICANDO IMPORTACIÓN DE PRODUCTOS');
  console.log('=====================================\n');

  try {
    // Importar Prisma Client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Obtener todos los productos de la categoría "Monitores"
    const products = await prisma.product.findMany({
      where: {
        category: "Monitores"
      },
      orderBy: {
        price: 'desc'
      }
    });

    console.log(`📊 Total de monitores en la base de datos: ${products.length}`);
    console.log('\n📋 PRODUCTOS IMPORTADOS:');
    console.log('========================');

    if (products.length === 0) {
      console.log('❌ No se encontraron productos en la categoría "Monitores"');
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString('es-AR')}`);
        console.log(`   📦 Stock: ${product.stock}`);
        console.log(`   📂 Categoría: ${product.category}`);
        console.log(`   📝 Descripción: ${product.description.substring(0, 50)}...`);
        console.log('');
      });
    }

    // Obtener estadísticas generales
    const totalProducts = await prisma.product.count();
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    console.log('📈 ESTADÍSTICAS GENERALES:');
    console.log('==========================');
    console.log(`📦 Total de productos en la base de datos: ${totalProducts}`);
    console.log('\n📂 Productos por categoría:');
    categories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat._count.category} productos`);
    });

    // Cerrar conexión de Prisma
    await prisma.$disconnect();

  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

// Ejecutar la verificación
verifyImport(); 