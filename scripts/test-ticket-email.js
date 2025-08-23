require('dotenv').config();

async function testTicketEmail() {
  console.log('🎫 Probando creación de ticket y envío de emails...\n');

  try {
    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Usuario de Prueba',
        email: 'it360tecnologia@gmail.com',
        telefono: '03425089906',
        empresa: 'IT360 Soluciones',
        tipo: 'soporte',
        categoria: 'tecnico',
        asunto: 'Prueba del sistema de emails con Resend',
        descripcion: 'Este es un ticket de prueba para verificar que el sistema de emails esté funcionando correctamente con Resend.',
        urgencia: 'normal'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ticket creado exitosamente!');
      console.log(`   • Número: ${data.ticket.ticketNumber}`);
      console.log(`   • ID: ${data.ticket.id}`);
      console.log(`   • Asunto: ${data.ticket.asunto}`);
      console.log(`   • Fecha: ${new Date(data.ticket.createdAt).toLocaleString('es-AR')}`);
      
      console.log('\n📧 Verificando emails...');
      console.log('   • Email de notificación al administrador: Debería haber llegado');
      console.log('   • Email de confirmación al cliente: Debería haber llegado');
      console.log('\n🎉 ¡Prueba completada! Revisa tu bandeja de entrada.');
    } else {
      const error = await response.json();
      console.log('❌ Error creando ticket:', error);
    }

  } catch (error) {
    console.log('❌ Error en la prueba:', error.message);
  }
}

// Función para usar fetch en Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Ejecutar la prueba
testTicketEmail().catch(console.error);
