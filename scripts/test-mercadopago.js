require('dotenv').config({ path: '.env' });

async function testMercadoPago() {
  try {
    console.log('🧪 Probando integración de MercadoPago...\n');

    // Verificar variables de entorno
    console.log('🔍 Verificando configuración...');
    console.log(`   • MERCADOPAGO_ACCESS_TOKEN: ${process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   • MERCADOPAGO_PUBLIC_KEY: ${process.env.MERCADOPAGO_PUBLIC_KEY ? '✅ Configurado' : '❌ No configurado'}`);

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.log('\n❌ Error: MERCADOPAGO_ACCESS_TOKEN no configurado');
      return;
    }

    // Datos de prueba
    const testData = {
      ticketNumber: 'TKT-TEST-001',
      amount: 1000.00,
      description: 'Producto de prueba',
      customerEmail: 'test@example.com',
      customerName: 'Cliente Test'
    };

    console.log('\n📝 Enviando solicitud de pago...');
    console.log('   • Datos:', testData);

    const response = await fetch('http://localhost:3000/api/payment/mercadopago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log(`\n📡 Respuesta del servidor:`);
    console.log(`   • Status: ${response.status}`);
    console.log(`   • OK: ${response.ok}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   • Error: ${errorText}`);
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ Respuesta exitosa:');
    console.log(`   • Success: ${data.success}`);
    console.log(`   • Preference ID: ${data.preference_id}`);
    console.log(`   • Init Point: ${data.init_point}`);

    if (data.init_point) {
      console.log('\n🎯 Próximos pasos:');
      console.log('   1. Abre el enlace de MercadoPago:');
      console.log(`      ${data.init_point}`);
      console.log('   2. Completa el proceso de pago');
      console.log('   3. Verifica que redirija correctamente');

      // Abrir el enlace automáticamente (opcional)
      console.log('\n🌐 Abriendo enlace de MercadoPago...');
      const { exec } = require('child_process');
      exec(`start ${data.init_point}`, (error) => {
        if (error) {
          console.log('   • No se pudo abrir automáticamente');
        } else {
          console.log('   • Enlace abierto en el navegador');
        }
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMercadoPago();
