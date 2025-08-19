require('dotenv').config({ path: '.env' });

async function testPaymentLink() {
  try {
    console.log('🧪 Probando enlace de pago corregido...\n');

    // Usar el ticket de compra que se acaba de crear
    const ticketNumber = 'TKT-325042-387';
    
    console.log(`📋 Usando ticket de compra: ${ticketNumber}`);

    // 1. Verificar que el ticket existe
    console.log('\n🔍 Verificando ticket...');
    
    const ticketResponse = await fetch(`http://localhost:3000/api/tickets/${ticketNumber}`);
    
    if (!ticketResponse.ok) {
      throw new Error(`Error al obtener ticket: ${ticketResponse.status}`);
    }

    const ticket = await ticketResponse.json();
    console.log('✅ Ticket encontrado:');
    console.log(`   • Nombre: ${ticket.nombre}`);
    console.log(`   • Email: ${ticket.email}`);
    console.log(`   • Tipo: ${ticket.tipo}`);
    console.log(`   • Estado: ${ticket.estado}`);

    // 2. Habilitar el pago
    console.log('\n💳 Habilitando pago...');
    
    const habilitarResponse = await fetch('http://localhost:3000/api/admin/habilitar-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId: ticket.id,
        metodoPago: 'TRANSFERENCIA_BANCARIA'
      })
    });

    if (!habilitarResponse.ok) {
      throw new Error(`Error al habilitar pago: ${habilitarResponse.status}`);
    }

    const habilitarResult = await habilitarResponse.json();
    console.log('✅ Pago habilitado exitosamente');
    console.log(`   • Mensaje: ${habilitarResult.message}`);

    // 3. Verificar el enlace de pago
    console.log('\n🔗 Verificando enlace de pago...');
    
    const paymentUrl = `http://localhost:3000/pagar/${ticketNumber}`;
    console.log(`   • URL de pago: ${paymentUrl}`);
    
    const paymentResponse = await fetch(paymentUrl);
    
    if (paymentResponse.ok) {
      console.log('✅ Página de pago accesible');
      console.log(`   • Status: ${paymentResponse.status}`);
    } else {
      console.log('❌ Error en página de pago');
      console.log(`   • Status: ${paymentResponse.status}`);
    }

    // 4. Mostrar instrucciones
    console.log('\n🎯 INSTRUCCIONES PARA PROBAR:');
    console.log('   1. Abre tu email en it360tecnologia@gmail.com');
    console.log('   2. Busca el email con asunto: "🎫 Nuevo Ticket..."');
    console.log('   3. Haz clic en el botón "💳 PAGAR AHORA"');
    console.log('   4. El enlace debería llevarte a:');
    console.log(`      ${paymentUrl}`);
    console.log('   5. Verifica que la página carga correctamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPaymentLink();
