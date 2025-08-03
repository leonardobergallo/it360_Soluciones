const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPurchaseRequests() {
  try {
    console.log('🔍 Verificando solicitudes de compra...\n');

    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos\n');

    // Verificar todos los tickets
    const allTickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total de tickets en la base de datos: ${allTickets.length}\n`);

    if (allTickets.length === 0) {
      console.log('❌ No hay tickets en la base de datos');
      return;
    }

    // Filtrar tickets de compra
    const purchaseTickets = allTickets.filter(ticket => ticket.tipo === 'compra');
    console.log(`🛒 Tickets de compra encontrados: ${purchaseTickets.length}\n`);

    if (purchaseTickets.length === 0) {
      console.log('❌ No hay tickets de compra');
      console.log('\n📋 Tipos de tickets disponibles:');
      const tipos = [...new Set(allTickets.map(t => t.tipo))];
      tipos.forEach(tipo => {
        const count = allTickets.filter(t => t.tipo === tipo).length;
        console.log(`  • ${tipo}: ${count}`);
      });
      return;
    }

    // Mostrar detalles de cada ticket de compra
    purchaseTickets.forEach((ticket, index) => {
      console.log(`📦 Solicitud de Compra #${index + 1}:`);
      console.log(`   Número: ${ticket.ticketNumber}`);
      console.log(`   Cliente: ${ticket.nombre}`);
      console.log(`   Email: ${ticket.email}`);
      console.log(`   Teléfono: ${ticket.telefono || 'No especificado'}`);
      console.log(`   Estado: ${ticket.estado}`);
      console.log(`   Prioridad: ${ticket.prioridad}`);
      console.log(`   Fecha: ${ticket.createdAt.toLocaleString()}`);
      console.log(`   Asunto: ${ticket.asunto}`);
      console.log(`   Descripción: ${ticket.descripcion.substring(0, 100)}...`);
      console.log('');
    });

    // Estadísticas por estado
    const estados = {};
    purchaseTickets.forEach(ticket => {
      estados[ticket.estado] = (estados[ticket.estado] || 0) + 1;
    });

    console.log('📈 Estadísticas por estado:');
    Object.entries(estados).forEach(([estado, count]) => {
      console.log(`   • ${estado}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPurchaseRequests(); 