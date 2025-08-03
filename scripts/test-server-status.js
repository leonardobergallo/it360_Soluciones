import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testServerStatus() {
  console.log('🔍 VERIFICANDO ESTADO DEL SERVIDOR');
  console.log('='.repeat(50));

  try {
    // 1. Verificar conexión a base de datos
    console.log('\n📊 1. Verificando conexión a base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a base de datos exitosa');

    // 2. Verificar tablas principales
    console.log('\n📋 2. Verificando tablas principales...');
    
    const ticketsCount = await prisma.ticket.count();
    console.log(`✅ Tabla Tickets: ${ticketsCount} registros`);
    
    const contactsCount = await prisma.contact.count();
    console.log(`✅ Tabla Contacts: ${contactsCount} registros`);
    
    const usersCount = await prisma.user.count();
    console.log(`✅ Tabla Users: ${usersCount} registros`);

    // 3. Verificar servicios
    console.log('\n🔧 3. Verificando servicios...');
    const servicesCount = await prisma.service.count();
    console.log(`✅ Tabla Services: ${servicesCount} registros`);

    // 4. Verificar productos
    console.log('\n🛍️ 4. Verificando productos...');
    const productsCount = await prisma.product.count();
    console.log(`✅ Tabla Products: ${productsCount} registros`);

    console.log('\n✅ SERVIDOR FUNCIONANDO CORRECTAMENTE');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error verificando servidor:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
testServerStatus(); 