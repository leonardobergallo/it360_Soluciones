import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnvironmentVariables() {
  console.log('🔍 Verificando variables de entorno...\n');

  // Variables requeridas
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    IT360_EMAIL: process.env.IT360_EMAIL,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
    MERCADOPAGO_PUBLIC_KEY: process.env.MERCADOPAGO_PUBLIC_KEY,
    MERCADOPAGO_CLIENT_ID: process.env.MERCADOPAGO_CLIENT_ID,
    MERCADOPAGO_CLIENT_SECRET: process.env.MERCADOPAGO_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV
  };

  console.log('📋 Estado de las variables de entorno:');
  console.log('=====================================');

  const missingVars = [];
  const presentVars = [];

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (value) {
      console.log(`✅ ${key}: ${key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN') ? '***CONFIGURADA***' : value}`);
      presentVars.push(key);
    } else {
      console.log(`❌ ${key}: NO CONFIGURADA`);
      missingVars.push(key);
    }
  });

  console.log('\n📊 Resumen:');
  console.log(`✅ Variables configuradas: ${presentVars.length}`);
  console.log(`❌ Variables faltantes: ${missingVars.length}`);

  if (missingVars.length > 0) {
    console.log('\n🚨 Variables que necesitas configurar:');
    missingVars.forEach(varName => {
      console.log(`   • ${varName}`);
    });
    
    console.log('\n🔧 Solución:');
    console.log('1. Ve a tu proyecto en Vercel Dashboard');
    console.log('2. Ve a Settings > Environment Variables');
    console.log('3. Agrega las variables faltantes');
    console.log('4. Haz redeploy del proyecto');
  }

  // Verificar conexión a la base de datos si DATABASE_URL está presente
  if (process.env.DATABASE_URL) {
    console.log('\n🔌 Probando conexión a la base de datos...');
    try {
      await prisma.$connect();
      console.log('✅ Conexión a la base de datos exitosa');
      
      // Verificar productos
      const productCount = await prisma.product.count();
      console.log(`📦 Productos en la base de datos: ${productCount}`);
      
      // Verificar servicios
      const serviceCount = await prisma.service.count();
      console.log(`🔧 Servicios en la base de datos: ${serviceCount}`);
      
    } catch (error) {
      console.error('❌ Error conectando a la base de datos:', error.message);
      console.log('\n🔧 Posibles soluciones:');
      console.log('   • Verifica que la base de datos Neon esté activa');
      console.log('   • Verifica que las credenciales sean correctas');
      console.log('   • Asegúrate de que el esquema esté sincronizado');
    } finally {
      await prisma.$disconnect();
    }
  } else {
    console.log('\n⚠️  No se puede probar la conexión a la base de datos porque DATABASE_URL no está configurado');
  }

  console.log('\n🎯 Estado general:');
  if (missingVars.length === 0) {
    console.log('✅ Todas las variables están configuradas correctamente');
  } else {
    console.log(`❌ Faltan ${missingVars.length} variables de entorno`);
  }
}

checkEnvironmentVariables().catch(console.error);
