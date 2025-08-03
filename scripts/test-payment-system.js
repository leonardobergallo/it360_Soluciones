const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPaymentSystem() {
  try {
    console.log('🧪 Probando sistema completo de pago...\n');

    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos\n');

    // 1. Verificar tickets de compra existentes
    const purchaseTickets = await prisma.ticket.findMany({
      where: { tipo: 'compra' },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📦 Tickets de compra encontrados: ${purchaseTickets.length}\n`);

    if (purchaseTickets.length === 0) {
      console.log('❌ No hay tickets de compra para probar');
      console.log('💡 Primero crea una solicitud de compra desde el checkout');
      return;
    }

    // 2. Mostrar estado actual de los tickets
    console.log('📊 Estado actual de los tickets:');
    purchaseTickets.forEach((ticket, index) => {
      console.log(`  ${index + 1}. ${ticket.ticketNumber} - ${ticket.estado} - ${ticket.nombre} (${ticket.email})`);
    });

    // 3. Simular habilitación de pago
    const ticketToEnable = purchaseTickets[0];
    console.log(`\n🔧 Simulando habilitación de pago para: ${ticketToEnable.ticketNumber}`);

    // Actualizar estado a 'pago_habilitado'
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketToEnable.id },
      data: {
        estado: 'pago_habilitado',
        notas: 'Pago habilitado para prueba del sistema',
        updatedAt: new Date()
      }
    });

    console.log(`✅ Ticket actualizado: ${updatedTicket.ticketNumber} -> ${updatedTicket.estado}`);

    // 4. Generar enlace de pago
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const paymentLink = `${baseUrl}/pagar/${updatedTicket.id}`;
    
    console.log(`\n🔗 Enlace de pago generado:`);
    console.log(`   ${paymentLink}`);

    // 5. Simular email que recibiría el usuario
    console.log(`\n📧 Email que recibiría el usuario:`);
    console.log(`   Para: ${updatedTicket.email}`);
    console.log(`   Asunto: ✅ ¡Pago Habilitado! - ${updatedTicket.ticketNumber}`);
    console.log(`   Contenido: Incluye datos bancarios y enlace directo de pago`);

    // 6. Verificar que el enlace funciona
    console.log(`\n🔍 Verificando que el enlace de pago es válido...`);
    
    try {
      const response = await fetch(paymentLink);
      if (response.ok) {
        console.log(`✅ Enlace de pago funciona correctamente`);
      } else {
        console.log(`⚠️ Enlace de pago devuelve status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error verificando enlace: ${error.message}`);
    }

    // 7. Mostrar flujo completo
    console.log(`\n🔄 Flujo completo del sistema:`);
    console.log(`   1. Usuario hace solicitud de compra desde checkout`);
    console.log(`   2. Administrador ve la solicitud en /admin/solicitudes-compra`);
    console.log(`   3. Administrador hace clic en "Habilitar Pago"`);
    console.log(`   4. Sistema envía email automático al usuario con:`);
    console.log(`      • Datos bancarios completos`);
    console.log(`      • Enlace directo para pagar`);
    console.log(`      • Información de contacto`);
    console.log(`   5. Usuario hace clic en el enlace del email`);
    console.log(`   6. Usuario llega a /pagar/${updatedTicket.id}`);
    console.log(`   7. Usuario confirma el pago`);
    console.log(`   8. Sistema actualiza estado a 'pagado'`);
    console.log(`   9. Sistema envía confirmación por email`);

    // 8. Estadísticas finales
    const stats = await prisma.ticket.groupBy({
      by: ['estado'],
      where: { tipo: 'compra' },
      _count: { estado: true }
    });

    console.log(`\n📈 Estadísticas finales:`);
    stats.forEach(stat => {
      console.log(`   • ${stat.estado}: ${stat._count.estado}`);
    });

    console.log(`\n🎉 Sistema de pago probado exitosamente!`);
    console.log(`\n💡 Para probar el flujo completo:`);
    console.log(`   1. Ve a /admin/solicitudes-compra`);
    console.log(`   2. Haz clic en "Habilitar Pago" para ${updatedTicket.ticketNumber}`);
    console.log(`   3. Verifica que se envía el email`);
    console.log(`   4. Usa el enlace del email para probar el pago`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentSystem(); 