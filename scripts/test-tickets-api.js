const fetch = require('node-fetch');

async function testTicketsAPI() {
  try {
    console.log('🧪 Probando API de tickets...\n');

    // Probar GET /api/tickets
    console.log('📡 Probando GET /api/tickets...');
    
    const response = await fetch('http://localhost:3001/api/tickets');
    
    console.log(`   • Status: ${response.status}`);
    console.log(`   • OK: ${response.ok}`);
    
    if (response.ok) {
      const tickets = await response.json();
      console.log(`   • Tickets encontrados: ${tickets.length}`);
      
      if (tickets.length > 0) {
        console.log('\n📋 Primeros 3 tickets:');
        tickets.slice(0, 3).forEach((ticket, index) => {
          console.log(`   ${index + 1}. ${ticket.ticketNumber} - ${ticket.nombre} (${ticket.estado})`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log(`   • Error: ${errorText}`);
    }

    // Probar POST /api/tickets (crear ticket de prueba)
    console.log('\n📡 Probando POST /api/tickets...');
    
    const testTicket = {
      nombre: 'Test API',
      email: 'test@api.com',
      telefono: '+54 9 342 123-4567',
      empresa: 'Test Company',
      tipo: 'general',
      categoria: 'general',
      asunto: 'Prueba de API',
      descripcion: 'Este es un ticket de prueba para verificar que la API funciona correctamente.',
      urgencia: 'normal'
    };

    const postResponse = await fetch('http://localhost:3001/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testTicket)
    });

    console.log(`   • Status: ${postResponse.status}`);
    console.log(`   • OK: ${postResponse.ok}`);

    if (postResponse.ok) {
      const result = await postResponse.json();
      console.log(`   • Ticket creado: ${result.ticket.ticketNumber}`);
      console.log('✅ API de tickets funciona correctamente');
    } else {
      const errorText = await postResponse.text();
      console.log(`   • Error: ${errorText}`);
      console.log('❌ API de tickets tiene problemas');
    }

  } catch (error) {
    console.error('❌ Error probando API:', error.message);
    console.log('\n💡 Posibles causas:');
    console.log('   1. El servidor no está corriendo (npm run dev)');
    console.log('   2. El puerto 3001 está ocupado');
    console.log('   3. Hay un error en la API');
  }
}

testTicketsAPI();
