require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Probando conexión a la base de datos...');
  console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'No encontrado');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Probar conexión básica
    console.log('📡 Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión establecida exitosamente');

    // Probar una consulta simple
    console.log('🔍 Probando consulta de productos...');
    const productCount = await prisma.product.count();
    console.log(`✅ Productos encontrados: ${productCount}`);

    // Probar consulta de usuarios
    console.log('🔍 Probando consulta de usuarios...');
    const userCount = await prisma.user.count();
    console.log(`✅ Usuarios encontrados: ${userCount}`);

    // Probar consulta de carrito
    console.log('🔍 Probando consulta de carrito...');
    const cartCount = await prisma.cart.count();
    console.log(`✅ Carritos encontrados: ${cartCount}`);

    console.log('🎉 Todas las pruebas pasaron exitosamente');

  } catch (error) {
    console.error('❌ Error en la conexión:', error);
    
    if (error.code === 'P1001') {
      console.error('🔧 Error de conexión a la base de datos');
      console.error('💡 Verifica que:');
      console.error('   - La URL de la base de datos sea correcta');
      console.error('   - La base de datos esté accesible');
      console.error('   - Las credenciales sean válidas');
    } else if (error.code === 'P1002') {
      console.error('🔧 Error de autenticación');
      console.error('💡 Verifica las credenciales de la base de datos');
    } else if (error.code === 'P1003') {
      console.error('🔧 Base de datos no encontrada');
      console.error('💡 Verifica que la base de datos exista');
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

testDatabaseConnection();
