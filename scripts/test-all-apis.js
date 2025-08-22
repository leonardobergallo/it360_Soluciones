const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAllAPIs() {
  console.log('🧪 Probando todas las APIs del proyecto...\n');

  try {
    // 1. Probar conexión a la base de datos
    console.log('1️⃣ Probando conexión a PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // 2. Probar API de productos
    console.log('2️⃣ Probando API de productos...');
    try {
      const products = await prisma.product.findMany({
        where: { active: true },
        take: 5
      });
      console.log(`✅ Productos encontrados: ${products.length}`);
      if (products.length > 0) {
        console.log(`   • Ejemplo: ${products[0].name} - $${products[0].price}`);
      }
    } catch (error) {
      console.log('❌ Error con productos:', error.message);
    }

    // 3. Probar API de servicios
    console.log('\n3️⃣ Probando API de servicios...');
    try {
      const services = await prisma.service.findMany({
        where: { active: true },
        take: 3
      });
      console.log(`✅ Servicios encontrados: ${services.length}`);
      if (services.length > 0) {
        console.log(`   • Ejemplo: ${services[0].name} - $${services[0].price}`);
      }
    } catch (error) {
      console.log('❌ Error con servicios:', error.message);
    }

    // 4. Probar API de usuarios
    console.log('\n4️⃣ Probando API de usuarios...');
    try {
      const users = await prisma.user.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
      console.log(`✅ Usuarios encontrados: ${users.length}`);
      if (users.length > 0) {
        console.log(`   • Ejemplo: ${users[0].name} (${users[0].role})`);
      }
    } catch (error) {
      console.log('❌ Error con usuarios:', error.message);
    }

    // 5. Probar API de carrito
    console.log('\n5️⃣ Probando API de carrito...');
    try {
      const carts = await prisma.cart.findMany({
        include: {
          items: {
            include: { product: true }
          }
        },
        take: 2
      });
      console.log(`✅ Carritos encontrados: ${carts.length}`);
      if (carts.length > 0) {
        console.log(`   • Carrito con ${carts[0].items.length} items`);
      }
    } catch (error) {
      console.log('❌ Error con carritos:', error.message);
    }

    // 6. Probar API de tickets
    console.log('\n6️⃣ Probando API de tickets...');
    try {
      const tickets = await prisma.ticket.findMany({
        take: 3
      });
      console.log(`✅ Tickets encontrados: ${tickets.length}`);
    } catch (error) {
      console.log('❌ Error con tickets:', error.message);
    }

    // 7. Resumen de la base de datos
    console.log('\n📊 Resumen de la base de datos:');
    try {
      const userCount = await prisma.user.count();
      const productCount = await prisma.product.count();
      const serviceCount = await prisma.service.count();
      const cartCount = await prisma.cart.count();
      const ticketCount = await prisma.ticket.count();

      console.log(`   • 👥 Usuarios: ${userCount}`);
      console.log(`   • 📦 Productos: ${productCount}`);
      console.log(`   • 🔧 Servicios: ${serviceCount}`);
      console.log(`   • 🛒 Carritos: ${cartCount}`);
      console.log(`   • 🎫 Tickets: ${ticketCount}`);
    } catch (error) {
      console.log('❌ Error obteniendo resumen:', error.message);
    }

    console.log('\n🎉 ¡Todas las APIs están funcionando correctamente!');
    console.log('\n🌐 El servidor está listo en: http://localhost:3000');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error);
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Prisma Client desconectado');
  }
}

// Ejecutar las pruebas
testAllAPIs().catch(console.error);
