const { PrismaClient } = require('@prisma/client');

// Crear una instancia de Prisma Client
const prisma = new PrismaClient();

async function getTickets() {
  try {
    console.log('🔍 Consultando tickets en la base de datos...\n');
    
    // Obtener todos los tickets
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (tickets.length === 0) {
      console.log('❌ No se encontraron tickets en la base de datos.');
      console.log('💡 Para crear tickets de ejemplo, puedes usar: npm run seed-tickets');
      return;
    }

    console.log(`✅ Se encontraron ${tickets.length} ticket(s):\n`);
    
    // Mostrar cada ticket de forma legible
    tickets.forEach((ticket, index) => {
      console.log(`🎫 Ticket ${index + 1}:`);
      console.log(`   Número: ${ticket.ticketNumber}`);
      console.log(`   Tipo: ${ticket.tipo.toUpperCase()}`);
      console.log(`   Estado: ${ticket.estado}`);
      console.log(`   Prioridad: ${ticket.prioridad}`);
      console.log(`   Urgencia: ${ticket.urgencia}`);
      console.log(`   Cliente: ${ticket.nombre}`);
      console.log(`   Email: ${ticket.email}`);
      console.log(`   Teléfono: ${ticket.telefono || 'No especificado'}`);
      if (ticket.empresa) {
        console.log(`   Empresa: ${ticket.empresa}`);
      }
      if (ticket.servicio) {
        console.log(`   Servicio: ${ticket.servicio}`);
      }
      console.log(`   Asunto: ${ticket.asunto}`);
      console.log(`   Categoría: ${ticket.categoria}`);
      console.log(`   Asignado a: ${ticket.asignadoA || 'Sin asignar'}`);
      console.log(`   Creado: ${ticket.createdAt.toLocaleString('es-ES')}`);
      console.log(''); // Línea en blanco para separar tickets
    });

    // Mostrar resumen por tipos
    const tipoCount = {};
    const estadoCount = {};
    const prioridadCount = {};
    
    tickets.forEach(ticket => {
      tipoCount[ticket.tipo] = (tipoCount[ticket.tipo] || 0) + 1;
      estadoCount[ticket.estado] = (estadoCount[ticket.estado] || 0) + 1;
      prioridadCount[ticket.prioridad] = (prioridadCount[ticket.prioridad] || 0) + 1;
    });

    console.log('📊 Resumen por tipos:');
    Object.entries(tipoCount).forEach(([tipo, count]) => {
      console.log(`   ${tipo}: ${count} ticket(s)`);
    });

    console.log('\n📊 Resumen por estados:');
    Object.entries(estadoCount).forEach(([estado, count]) => {
      console.log(`   ${estado}: ${count} ticket(s)`);
    });

    console.log('\n📊 Resumen por prioridad:');
    Object.entries(prioridadCount).forEach(([prioridad, count]) => {
      console.log(`   ${prioridad}: ${count} ticket(s)`);
    });

  } catch (error) {
    console.error('❌ Error al consultar tickets:', error);
  } finally {
    // Cerrar la conexión de Prisma
    await prisma.$disconnect();
  }
}

// Ejecutar la función
getTickets(); 