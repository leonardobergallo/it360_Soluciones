const { PrismaClient } = require('@prisma/client');

console.log('🔍 Verificando variables de entorno...');
console.log('');

// Verificar variables
const envVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV
};

console.log('📋 Variables de entorno:');
Object.entries(envVars).forEach(([key, value]) => {
  if (key === 'DATABASE_URL' && value) {
    // Ocultar la contraseña por seguridad
    const maskedUrl = value.replace(/:([^:@]+)@/, ':****@');
    console.log(`  ${key}: ${maskedUrl}`);
  } else {
    console.log(`  ${key}: ${value || 'NO DEFINIDA'}`);
  }
});

console.log('');

// Intentar conectar a la base de datos
if (envVars.DATABASE_URL) {
  console.log('🔌 Intentando conectar a la base de datos...');
  
  const prisma = new PrismaClient();
  
  prisma.$connect()
    .then(async () => {
      console.log('✅ Conexión exitosa a la base de datos');
      
      try {
        const userCount = await prisma.user.count();
        console.log(`📊 Usuarios en la base de datos: ${userCount}`);
      } catch (error) {
        console.log('⚠️  Error al contar usuarios:', error.message);
      }
      
      await prisma.$disconnect();
      console.log('🔌 Desconectado de la base de datos');
    })
    .catch((error) => {
      console.log('❌ Error conectando a la base de datos:', error.message);
      process.exit(1);
    });
} else {
  console.log('❌ DATABASE_URL no está definida');
  process.exit(1);
} 