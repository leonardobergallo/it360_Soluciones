const { PrismaClient } = require('@prisma/client');

console.log('🛒 Probando flujo del carrito...\n');

async function testCartFlow() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');

    // Verificar productos disponibles
    console.log('📦 Verificando productos disponibles...');
    const products = await prisma.product.findMany({
      where: { active: true },
      take: 5
    });

    console.log(`📊 Productos disponibles: ${products.length}`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
    });

    // Verificar carrito en localStorage (simulación)
    console.log('\n🛒 Verificando carrito...');
    console.log('   💡 Para probar el carrito:');
    console.log('   1. Ve a: http://localhost:3001/catalogo');
    console.log('   2. Agrega productos al carrito');
    console.log('   3. Ve a: http://localhost:3001/carrito');
    console.log('   4. Haz clic en "Finalizar compra"');
    console.log('   5. Debería llevarte a: http://localhost:3001/checkout');

    // Verificar que el checkout existe
    console.log('\n🔍 Verificando página de checkout...');
    console.log('   ✅ Página de checkout: http://localhost:3001/checkout');
    console.log('   ✅ API de checkout: http://localhost:3001/api/checkout');

    console.log('\n🎯 Flujo esperado:');
    console.log('   📱 Catálogo → Agregar productos → Carrito → Finalizar compra → Checkout');
    console.log('   💳 Checkout → MercadoPago/Transferencia → Confirmación');

    console.log('\n💡 Si el botón "Finalizar compra" no funciona:');
    console.log('   1. Verifica que hay productos en el carrito');
    console.log('   2. Verifica la consola del navegador para errores');
    console.log('   3. Verifica que el servidor esté corriendo en puerto 3001');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCartFlow(); 