const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

async function testPostgreSQLConnection() {
  console.log('🔍 Probando conexión a PostgreSQL...\n');

  try {
    // 1. Conectar a la base de datos
    console.log('1️⃣ Conectando a PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // 2. Probar una consulta simple
    console.log('2️⃣ Probando consulta simple...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta simple exitosa:', result);

    // 3. Verificar tablas existentes
    console.log('\n3️⃣ Verificando tablas existentes...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('📋 Tablas encontradas:', tables.map(t => t.table_name));

    // 4. Contar registros en tablas principales
    console.log('\n4️⃣ Contando registros...');
    
    try {
      const userCount = await prisma.user.count();
      console.log(`👥 Usuarios: ${userCount}`);
    } catch (error) {
      console.log('❌ Error contando usuarios:', error.message);
    }

    try {
      const productCount = await prisma.product.count();
      console.log(`📦 Productos: ${productCount}`);
    } catch (error) {
      console.log('❌ Error contando productos:', error.message);
    }

    try {
      const serviceCount = await prisma.service.count();
      console.log(`🔧 Servicios: ${serviceCount}`);
    } catch (error) {
      console.log('❌ Error contando servicios:', error.message);
    }

    console.log('\n🎉 ¡Conexión a PostgreSQL exitosa!');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error);
    
    // Proporcionar información de diagnóstico
    console.log('\n🔧 Información de diagnóstico:');
    console.log('   • DATABASE_URL configurado:', !!process.env.DATABASE_URL);
    console.log('   • NODE_ENV:', process.env.NODE_ENV);
    console.log('   • Error específico:', error.message);
    
    if (error.code) {
      console.log('   • Código de error:', error.code);
    }
    
    console.log('\n💡 Soluciones posibles:');
    console.log('   1. Verifica que la base de datos Neon esté activa');
    console.log('   2. Verifica las credenciales en la URL de conexión');
    console.log('   3. Asegúrate de que el proyecto Neon esté activo');
    console.log('   4. Verifica la configuración de red/firewall');
    
  } finally {
    // Desconectar
    await prisma.$disconnect();
    console.log('\n🔌 Prisma Client desconectado');
  }
}

// Ejecutar las pruebas
testPostgreSQLConnection().catch(console.error);
