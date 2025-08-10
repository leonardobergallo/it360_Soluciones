import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local' });

async function checkDbConfig() {
  console.log('🔍 Verificando configuración de base de datos...\n');

  // Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log(`   • DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`   • NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

  if (process.env.DATABASE_URL) {
    console.log(`   • URL (primeros 50 chars): ${process.env.DATABASE_URL.substring(0, 50)}...`);
  }

  console.log('');

  // Verificar si podemos importar Prisma
  try {
    console.log('🧪 Probando importación de Prisma...');
    console.log('✅ Prisma importado correctamente');
    
    // Crear instancia
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn']
    });
    
    console.log('✅ Instancia de Prisma creada');
    
    // Probar conexión
    console.log('\n🔌 Probando conexión...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa');
    
    // Probar consulta
    const count = await prisma.service.count();
    console.log(`✅ Consulta exitosa - ${count} servicios encontrados`);
    
    await prisma.$disconnect();
    console.log('✅ Desconexión exitosa');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verificar DATABASE_URL en .env.local');
    console.log('   2. Ejecutar: npx prisma generate');
    console.log('   3. Verificar conexión a la base de datos');
    console.log('   4. Reiniciar el servidor');
  }
}

checkDbConfig();
