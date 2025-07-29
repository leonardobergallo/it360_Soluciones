const { PrismaClient } = require('@prisma/client');

console.log('📊 Mostrando todos los datos...\n');

async function showAllData() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');

    // Mostrar contactos
    console.log('📧 CONTACTOS:');
    console.log('='.repeat(50));
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`📊 Total de contactos: ${contacts.length}`);
    
    if (contacts.length > 0) {
      contacts.forEach((contact, index) => {
        console.log(`\n${index + 1}. ${contact.name} (${contact.email})`);
        console.log(`   📅 Creado: ${contact.createdAt.toLocaleString('es-AR')}`);
        console.log(`   💬 Mensaje: ${contact.message.substring(0, 100)}...`);
      });
    } else {
      console.log('   ❌ No hay contactos');
    }

    // Mostrar presupuestos
    console.log('\n\n📋 PRESUPUESTOS:');
    console.log('='.repeat(50));
    const presupuestos = await prisma.ticket.findMany({
      where: { tipo: 'presupuesto' },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`📊 Total de presupuestos: ${presupuestos.length}`);
    
    if (presupuestos.length > 0) {
      presupuestos.forEach((presupuesto, index) => {
        console.log(`\n${index + 1}. ${presupuesto.nombre} (${presupuesto.email})`);
        console.log(`   🎫 Ticket: ${presupuesto.ticketNumber}`);
        console.log(`   🔧 Servicio: ${presupuesto.servicio}`);
        console.log(`   📅 Creado: ${presupuesto.createdAt.toLocaleString('es-AR')}`);
        console.log(`   📊 Estado: ${presupuesto.estado}`);
      });
    } else {
      console.log('   ❌ No hay presupuestos');
    }

    // Mostrar todos los tickets
    console.log('\n\n🎫 TODOS LOS TICKETS:');
    console.log('='.repeat(50));
    const allTickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`📊 Total de tickets: ${allTickets.length}`);
    
    if (allTickets.length > 0) {
      allTickets.forEach((ticket, index) => {
        console.log(`\n${index + 1}. ${ticket.nombre} (${ticket.email})`);
        console.log(`   🎫 Ticket: ${ticket.ticketNumber}`);
        console.log(`   📋 Tipo: ${ticket.tipo}`);
        console.log(`   📅 Creado: ${ticket.createdAt.toLocaleString('es-AR')}`);
        console.log(`   📊 Estado: ${ticket.estado}`);
      });
    } else {
      console.log('   ❌ No hay tickets');
    }

    console.log('\n🎉 ¡Verificación completada!');
    console.log('\n💡 Para ver estos datos en la web:');
    console.log('   • Contactos: http://localhost:3000/admin/contacts');
    console.log('   • Presupuestos: http://localhost:3000/admin/tickets');
    console.log('   • O ejecuta: npm run dev y navega al panel de admin');

  } catch (error) {
    console.error('❌ Error al obtener datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showAllData(); 