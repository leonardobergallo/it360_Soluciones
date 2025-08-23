require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTickets() {
  try {
    console.log('🔍 Verificando tickets en la base de datos...\n');

    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');

    // Contar tickets
    const ticketCount = await prisma.ticket.count();
    console.log(`📊 Total de tickets: ${ticketCount}`);

    if (ticketCount === 0) {
      console.log('⚠️  No hay tickets en la base de datos');
      console.log('💡 Esto puede ser normal si no se han enviado formularios de contacto');
    } else {
      // Mostrar tickets recientes
      const recentTickets = await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          ticketNumber: true,
          nombre: true,
          email: true,
          tipo: true,
          estado: true,
          createdAt: true
        }
      });

      console.log('\n📋 Tickets más recientes:');
      console.log('='.repeat(80));
      
      recentTickets.forEach((ticket, index) => {
        console.log(`${index + 1}. Ticket: ${ticket.ticketNumber}`);
        console.log(`   👤 Nombre: ${ticket.nombre}`);
        console.log(`   📧 Email: ${ticket.email}`);
        console.log(`   🏷️ Tipo: ${ticket.tipo}`);
        console.log(`   📊 Estado: ${ticket.estado}`);
        console.log(`   ⏰ Creado: ${ticket.createdAt.toLocaleString('es-AR')}`);
        console.log('');
      });
    }

    // Verificar contactos
    const contactCount = await prisma.contact.count();
    console.log(`📧 Total de contactos: ${contactCount}`);

    if (contactCount > 0) {
      const recentContacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });

      console.log('\n📋 Contactos más recientes:');
      console.log('='.repeat(80));
      
      recentContacts.forEach((contact, index) => {
        console.log(`${index + 1}. Contacto: ${contact.name}`);
        console.log(`   📧 Email: ${contact.email}`);
        console.log(`   ⏰ Creado: ${contact.createdAt.toLocaleString('es-AR')}`);
        console.log('');
      });
    }

    // Verificar usuarios
    const userCount = await prisma.user.count();
    console.log(`👥 Total de usuarios: ${userCount}`);

    // Verificar productos
    const productCount = await prisma.product.count();
    console.log(`📦 Total de productos: ${productCount}`);

    // Verificar servicios
    const serviceCount = await prisma.service.count();
    console.log(`🔧 Total de servicios: ${serviceCount}`);

    console.log('\n✅ Verificación completada');
    console.log('\n📋 Resumen:');
    console.log(`   • Tickets: ${ticketCount}`);
    console.log(`   • Contactos: ${contactCount}`);
    console.log(`   • Usuarios: ${userCount}`);
    console.log(`   • Productos: ${productCount}`);
    console.log(`   • Servicios: ${serviceCount}`);

    if (ticketCount === 0) {
      console.log('\n💡 Para probar el sistema:');
      console.log('   1. Ve a http://localhost:3000/contacto');
      console.log('   2. Completa el formulario de contacto');
      console.log('   3. Envía el formulario');
      console.log('   4. Ejecuta este script nuevamente para verificar');
    }

  } catch (error) {
    console.error('❌ Error verificando tickets:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que la base de datos esté conectada');
    console.log('   2. Ejecuta: npx prisma db push');
    console.log('   3. Ejecuta: npx prisma generate');
    console.log('   4. Reinicia el servidor: npm run dev');
  } finally {
    await prisma.$disconnect();
  }
}

checkTickets();
