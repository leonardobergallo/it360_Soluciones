require('dotenv').config({ path: '.env' });

async function testMercadoPagoDirect() {
  try {
    console.log('🧪 Probando API de MercadoPago directamente...\n');

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.log('❌ Error: MERCADOPAGO_ACCESS_TOKEN no configurado');
      return;
    }

    console.log('✅ Access Token configurado');
    console.log(`   • Token: ${accessToken.substring(0, 20)}...`);

    // Crear preferencia de prueba
    const preference = {
      items: [{
        title: 'Producto de prueba',
        quantity: 1,
        unit_price: 100.00,
        currency_id: 'ARS',
      }],
      payer: {
        name: 'Cliente Test',
        email: 'test@example.com',
      },
      back_urls: {
        success: 'http://localhost:3000/payment/success',
        failure: 'http://localhost:3000/payment/failure',
        pending: 'http://localhost:3000/payment/pending',
      },
      auto_return: 'approved',
      external_reference: 'TEST-001',
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    console.log('\n📝 Enviando preferencia a MercadoPago...');
    console.log('   • URL: https://api.mercadopago.com/checkout/preferences');
    console.log('   • Datos:', JSON.stringify(preference, null, 2));

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    console.log(`\n📡 Respuesta de MercadoPago:`);
    console.log(`   • Status: ${response.status}`);
    console.log(`   • Status Text: ${response.statusText}`);
    console.log(`   • OK: ${response.ok}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   • Error: ${errorText}`);
      
      // Intentar parsear el error como JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.log('   • Error detallado:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('   • Error no es JSON válido');
      }
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ Preferencia creada exitosamente:');
    console.log(`   • ID: ${data.id}`);
    console.log(`   • Init Point: ${data.init_point}`);
    console.log(`   • Sandbox Init Point: ${data.sandbox_init_point}`);

    if (data.init_point) {
      console.log('\n🎯 Enlaces de pago:');
      console.log(`   • Producción: ${data.init_point}`);
      console.log(`   • Sandbox: ${data.sandbox_init_point}`);
      
      console.log('\n🌐 Abriendo enlace de sandbox...');
      const { exec } = require('child_process');
      exec(`start ${data.sandbox_init_point}`, (error) => {
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

testMercadoPagoDirect();
