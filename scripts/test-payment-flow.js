require('dotenv').config();

async function testPaymentFlow() {
  console.log('🧪 Probando flujo completo de habilitación de pago...\n');

  try {
    // 1. Crear un ticket de prueba
    console.log('1️⃣ Creando ticket de prueba...');
    const ticketResponse = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Cliente de Prueba Pago',
        email: 'it360tecnologia@gmail.com',
        telefono: '03425089906',
        empresa: 'Empresa Test',
        tipo: 'compra',
        categoria: 'productos',
        asunto: 'Prueba de flujo de pago completo',
        descripcion: '• Monitor 24" Full HD x1 - $239.988\n• Teclado Mecánico x1 - $89.990\nTotal: $329.978',
        urgencia: 'normal'
      })
    });
    
    if (!ticketResponse.ok) {
      const error = await ticketResponse.json();
      console.log('❌ Error creando ticket:', error);
      return;
    }

    const ticketData = await ticketResponse.json();
    console.log('✅ Ticket creado:', ticketData.ticket.ticketNumber);

    // 2. Habilitar pago (simulando acción del admin)
    console.log('\n2️⃣ Habilitando pago...');
    const paymentResponse = await fetch('http://localhost:3000/api/admin/habilitar-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId: ticketData.ticket.id,
        metodoPago: 'MERCADOPAGO'
      })
    });

    if (!paymentResponse.ok) {
      const error = await paymentResponse.json();
      console.log('❌ Error habilitando pago:', error);
      return;
    }

    const paymentData = await paymentResponse.json();
    console.log('✅ Pago habilitado:', paymentData.message);

    // 3. Verificar que el email se envió
    console.log('\n3️⃣ Verificando envío de email...');
    console.log('📧 Email debería haber sido enviado a: it360tecnologia@gmail.com');
    console.log('📧 Asunto: "✅ Pago Habilitado - Ticket ' + ticketData.ticket.ticketNumber + ' - IT360 Soluciones"');
    
    // 4. Mostrar link de pago
    console.log('\n4️⃣ Link de pago generado:');
    console.log(`🌐 http://localhost:3000/pagar/${ticketData.ticket.ticketNumber}`);

    console.log('\n🎉 ¡Flujo de pago completado!');
    console.log('📧 Revisa tu bandeja de entrada en it360tecnologia@gmail.com');

  } catch (error) {
    console.log('❌ Error en el flujo:', error.message);
  }
}

// Función para usar fetch en Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Ejecutar la prueba
testPaymentFlow().catch(console.error);
