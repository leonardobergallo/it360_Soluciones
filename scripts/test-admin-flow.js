require('dotenv').config({ path: '.env' });

async function testAdminFlow() {
  try {
    console.log('🧪 Probando flujo completo del admin...\n');

    // 1. Verificar tickets de compra existentes
    console.log('📋 Verificando tickets de compra...');
    
    const ticketsResponse = await fetch('http://localhost:3000/api/tickets');
    
    if (!ticketsResponse.ok) {
      throw new Error(`Error al obtener tickets: ${ticketsResponse.status}`);
    }

    const tickets = await ticketsResponse.json();
    
    // Filtrar solo tickets de compra
    const ticketsCompra = tickets.filter(ticket => ticket.tipo === 'compra');
    
    console.log(`✅ Tickets de compra encontrados: ${ticketsCompra.length}`);
    
    if (ticketsCompra.length === 0) {
      console.log('❌ No hay tickets de compra para probar');
      return;
    }

    // 2. Mostrar tickets disponibles
    console.log('\n📋 Tickets de compra disponibles:');
    ticketsCompra.forEach((ticket, index) => {
      console.log(`  ${index + 1}. ${ticket.ticketNumber} - ${ticket.estado} - ${ticket.nombre} (${ticket.email})`);
    });

    // 3. Seleccionar un ticket para habilitar
    const ticketToEnable = ticketsCompra[0];
    console.log(`\n🎯 Seleccionando ticket: ${ticketToEnable.ticketNumber}`);

    // 4. Simular habilitación de pago
    console.log('\n🔧 Simulando habilitación de pago...');
    
    const habilitarResponse = await fetch('http://localhost:3000/api/admin/habilitar-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId: ticketToEnable.id,
        metodoPago: 'TRANSFERENCIA_BANCARIA'
      }),
    });

    if (!habilitarResponse.ok) {
      const errorData = await habilitarResponse.text();
      console.log('⚠️ Error al habilitar pago:', habilitarResponse.status);
      console.log('Respuesta:', errorData);
      
      // Si hay error, mostrar información del ticket
      console.log('\n📋 Información del ticket:');
      console.log(`   • ID: ${ticketToEnable.id}`);
      console.log(`   • Número: ${ticketToEnable.ticketNumber}`);
      console.log(`   • Estado: ${ticketToEnable.estado}`);
      console.log(`   • Tipo: ${ticketToEnable.tipo}`);
      console.log(`   • Descripción: ${ticketToEnable.descripcion.substring(0, 100)}...`);
      
      return;
    }

    const habilitarData = await habilitarResponse.json();
    console.log('✅ Pago habilitado exitosamente!');
    console.log(`   • Mensaje: ${habilitarData.message}`);

    // 5. Verificar que el ticket se actualizó
    console.log('\n🔍 Verificando actualización del ticket...');
    
    const ticketUpdatedResponse = await fetch(`http://localhost:3000/api/tickets/${ticketToEnable.ticketNumber}`);
    
    if (ticketUpdatedResponse.ok) {
      const ticketUpdated = await ticketUpdatedResponse.json();
      console.log(`✅ Ticket actualizado: ${ticketUpdated.estado}`);
    }

    // 6. Mostrar información del email que se enviaría
    console.log('\n📧 Email que se enviaría al cliente:');
    console.log(`   • Para: ${ticketToEnable.email}`);
    console.log(`   • Asunto: ✅ ¡Pago Habilitado! - ${ticketToEnable.ticketNumber}`);
    console.log(`   • Contenido: Incluye enlace directo de pago`);
    console.log(`   • Enlace: http://localhost:3000/pagar/${ticketToEnable.ticketNumber}`);

    // 7. Mostrar estadísticas
    console.log('\n📊 Estadísticas finales:');
    const pendientes = ticketsCompra.filter(t => t.estado === 'abierto' || t.estado === 'pendiente').length;
    const habilitados = ticketsCompra.filter(t => t.estado === 'pago_habilitado').length;
    const rechazados = ticketsCompra.filter(t => t.estado === 'rechazado').length;
    
    console.log(`   • Pendientes: ${pendientes}`);
    console.log(`   • Pagos Habilitados: ${habilitados}`);
    console.log(`   • Rechazadas: ${rechazados}`);

    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Ve al panel admin: http://localhost:3000/admin/solicitudes-compra');
    console.log('   2. Verifica que aparece el ticket habilitado');
    console.log('   3. Revisa el email del cliente para el enlace de pago');
    console.log('   4. Prueba el enlace de pago');

    console.log('\n✅ Flujo del admin probado exitosamente!');

  } catch (error) {
    console.error('❌ Error probando flujo del admin:', error.message);
  }
}

testAdminFlow();
