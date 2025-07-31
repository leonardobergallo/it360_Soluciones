const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

console.log('🔍 Probando conexión a Neon...\n');

async function testNeonConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('📡 Intentando conectar a Neon...');
    console.log('🔗 URL:', process.env.DATABASE_URL ? 'Configurada' : 'No configurada');
    
    await prisma.$connect();
    console.log('✅ ¡Conexión exitosa a Neon!');
    
    // Verificar si hay tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log(`📊 Tablas encontradas: ${tables.length}`);
    if (tables.length > 0) {
      console.log('📋 Tablas:');
      tables.forEach(table => console.log(`   • ${table.table_name}`));
    } else {
      console.log('📝 No hay tablas. Necesitas ejecutar la migración.');
    }
    
  } catch (error) {
    console.log('❌ Error de conexión:');
    console.log('   Mensaje:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 La URL de Neon ha expirado o no es válida.');
      console.log('   Necesitas crear una nueva base de datos en Neon:');
      console.log('   1. Ve a https://console.neon.tech/');
      console.log('   2. Crea un nuevo proyecto');
      console.log('   3. Copia la URL de conexión');
      console.log('   4. Actualiza el archivo .env');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testNeonConnection(); 