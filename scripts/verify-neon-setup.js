const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function verifyNeonSetup() {
  console.log('🔍 Verificando configuración de Neon...');
  
  // Verificar variables de entorno
  console.log('\n📋 Variables de entorno:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Configurada' : '❌ No configurada');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Configurada' : '❌ No configurada');
  
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ Error: DATABASE_URL no está configurada en el archivo .env');
    console.log('📝 Crea un archivo .env con la siguiente configuración:');
    console.log('DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx-xxxxx.region.aws.neon.tech/it360?sslmode=require"');
    process.exit(1);
  }
  
  // Verificar formato de la URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.includes('neon.tech')) {
    console.warn('\n⚠️ Advertencia: La URL no parece ser de Neon');
    console.log('URL actual:', dbUrl);
  }
  
  if (!dbUrl.includes('sslmode=require')) {
    console.warn('\n⚠️ Advertencia: La URL no incluye sslmode=require');
    console.log('Recomendado: Agregar ?sslmode=require al final de la URL');
  }
  
  // Probar conexión
  console.log('\n🔌 Probando conexión a Neon...');
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa a Neon');
    
    // Verificar tablas
    console.log('\n📊 Verificando estructura de la base de datos...');
    
    try {
      const users = await prisma.user.count();
      console.log('✅ Tabla User: OK');
    } catch (error) {
      console.log('❌ Tabla User: No existe o hay error');
    }
    
    try {
      const products = await prisma.product.count();
      console.log('✅ Tabla Product: OK');
    } catch (error) {
      console.log('❌ Tabla Product: No existe o hay error');
    }
    
    try {
      const services = await prisma.service.count();
      console.log('✅ Tabla Service: OK');
    } catch (error) {
      console.log('❌ Tabla Service: No existe o hay error');
    }
    
    try {
      const sales = await prisma.sale.count();
      console.log('✅ Tabla Sale: OK');
    } catch (error) {
      console.log('❌ Tabla Sale: No existe o hay error');
    }
    
    try {
      const contacts = await prisma.contact.count();
      console.log('✅ Tabla Contact: OK');
    } catch (error) {
      console.log('❌ Tabla Contact: No existe o hay error');
    }
    
    try {
      const carts = await prisma.cart.count();
      console.log('✅ Tabla Cart: OK');
    } catch (error) {
      console.log('❌ Tabla Cart: No existe o hay error');
    }
    
    try {
      const cartItems = await prisma.cartItem.count();
      console.log('✅ Tabla CartItem: OK');
    } catch (error) {
      console.log('❌ Tabla CartItem: No existe o hay error');
    }
    
    try {
      const paymentPreferences = await prisma.paymentPreference.count();
      console.log('✅ Tabla PaymentPreference: OK');
    } catch (error) {
      console.log('❌ Tabla PaymentPreference: No existe o hay error');
    }
    
    console.log('\n🎉 Verificación completada!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Si hay tablas que no existen, ejecuta: npm run db:deploy');
    console.log('2. Para migrar datos de SQLite: npm run migrate:neon');
    console.log('3. Para abrir Prisma Studio: npm run db:studio');
    
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que la URL de Neon sea correcta');
    console.log('2. Asegúrate de que el proyecto esté activo en Neon');
    console.log('3. Verifica la configuración de red/firewall');
    console.log('4. Revisa que la URL incluya sslmode=require');
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  verifyNeonSetup()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { verifyNeonSetup }; 