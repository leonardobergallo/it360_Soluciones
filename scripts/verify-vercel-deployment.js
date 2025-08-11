import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyVercelDeployment() {
  console.log('🔍 Verificando configuración para Vercel...\n');

  // 1. Verificar variables de entorno
  console.log('📋 Variables de entorno requeridas:');
  console.log('   • DATABASE_URL (Neon PostgreSQL)');
  console.log('   • NEXTAUTH_SECRET');
  console.log('   • NEXTAUTH_URL (debe ser tu dominio de Vercel)');
  console.log('   • RESEND_API_KEY');
  console.log('   • MERCADOPAGO_ACCESS_TOKEN');
  console.log('   • MERCADOPAGO_PUBLIC_KEY');
  console.log('   • MERCADOPAGO_CLIENT_ID');
  console.log('   • MERCADOPAGO_CLIENT_SECRET\n');

  // 2. Verificar conexión a la base de datos
  try {
    console.log('🔌 Probando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');

    // 3. Verificar productos en la base de datos
    const productCount = await prisma.product.count();
    console.log(`📦 Productos en la base de datos: ${productCount}`);

    if (productCount === 0) {
      console.log('⚠️  No hay productos en la base de datos');
      console.log('   Ejecuta: npm run seed-products');
    } else {
      const sampleProducts = await prisma.product.findMany({
        take: 3,
        select: { id: true, name: true, price: true, active: true }
      });
      console.log('📋 Muestra de productos:');
      sampleProducts.forEach(p => {
        console.log(`   • ${p.name} - $${p.price} (ID: ${p.id}, Activo: ${p.active})`);
      });
    }

    // 4. Verificar servicios
    const serviceCount = await prisma.service.count();
    console.log(`🔧 Servicios en la base de datos: ${serviceCount}\n`);

  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    console.log('\n🔧 Soluciones posibles:');
    console.log('   1. Verifica que DATABASE_URL esté configurado en Vercel');
    console.log('   2. Asegúrate de que la base de datos Neon esté activa');
    console.log('   3. Verifica que las credenciales sean correctas');
  }

  // 5. Verificar configuración de Prisma
  console.log('🔧 Verificando configuración de Prisma...');
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Prisma Client generado correctamente');
  } catch (error) {
    console.error('❌ Error con Prisma Client:', error.message);
    console.log('   Ejecuta: npx prisma generate');
  }

  await prisma.$disconnect();

  console.log('\n📝 Pasos para configurar Vercel:');
  console.log('   1. Ve a tu proyecto en Vercel Dashboard');
  console.log('   2. Ve a Settings > Environment Variables');
  console.log('   3. Agrega todas las variables del archivo .env.local');
  console.log('   4. Asegúrate de que NEXTAUTH_URL sea tu dominio de Vercel');
  console.log('   5. Redeploy el proyecto');
  console.log('\n🔗 Comandos útiles:');
  console.log('   • npm run build (para probar build localmente)');
  console.log('   • npm run seed-products (para agregar productos de prueba)');
  console.log('   • npx prisma generate (para regenerar Prisma Client)');
}

verifyVercelDeployment().catch(console.error);
