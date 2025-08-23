require('dotenv').config();

async function testMercadoPagoAPI() {
  console.log('🧪 Probando API de MercadoPago...\n');

  try {
    console.log('📋 Datos de prueba:');
    console.log('   • Ticket: TKT-522268-474');
    console.log('   • Monto: $329.978');
    console.log('   • Descripción: Monitor 24" Full HD x1, Teclado Mecánico x1');
    console.log('   • Cliente: Cliente de Prueba Pago');
    console.log('   • Email: it360tecnologia@gmail.com\n');

    const response = await fetch('http://localhost:3000/api/payment/mercadopago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketNumber: 'TKT-522268-474',
        amount: 329.978,
        description: 'Monitor 24" Full HD x1, Teclado Mecánico x1',
        customerEmail: 'it360tecnologia@gmail.com',
        customerName: 'Cliente de Prueba Pago'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ API de MercadoPago funcionando correctamente!');
      console.log('📊 Respuesta:');
      console.log(`   • Success: ${data.success}`);
      console.log(`   • Mode: ${data.mode}`);
      console.log(`   • Preference ID: ${data.preference_id}`);
      console.log(`   • Init Point: ${data.init_point}`);
      
      console.log('\n🔗 Link de pago generado:');
      console.log(`   ${data.init_point}`);
      
      console.log('\n💡 Próximos pasos:');
      console.log('   1. Haz clic en el link de arriba');
      console.log('   2. Deberías ser redirigido a MercadoPago');
      console.log('   3. Completa el proceso de pago');
      console.log('   4. Serás redirigido de vuelta a tu sitio');
      
    } else {
      console.log('❌ Error en la API de MercadoPago:');
      console.log(`   • Status: ${response.status}`);
      console.log(`   • Error: ${data.error}`);
      
      if (data.error && data.error.includes('Token')) {
        console.log('\n🔧 Solución: Verifica las variables de entorno de MercadoPago');
        console.log('   • MERCADOPAGO_ACCESS_TOKEN');
        console.log('   • MERCADOPAGO_PUBLIC_KEY');
      }
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

// Función para usar fetch en Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Ejecutar la prueba
testMercadoPagoAPI().catch(console.error);
