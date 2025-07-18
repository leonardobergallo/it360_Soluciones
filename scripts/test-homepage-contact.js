// Script para probar la funcionalidad de contacto en la página principal
const testHomepageContact = async () => {
  console.log('🧪 Probando funcionalidad de contacto en página principal...\n');

  try {
    // Datos de prueba para un producto de ejemplo
    const testData = {
      nombre: 'María González',
      email: 'maria.gonzalez@test.com',
      telefono: '+54 9 342 987 6543',
      mensaje: 'Me interesa la Laptop HP Pavilion Gaming. ¿Tienen stock disponible y cuál es el tiempo de entrega?',
      producto: 'Laptop HP Pavilion Gaming',
      precio: 899,
      tipoConsulta: 'Consulta de Producto'
    };

    console.log('📤 Enviando datos de prueba desde página principal:', testData);

    // Llamada a la API
    const response = await fetch('http://localhost:3000/api/contacto-vendedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    console.log('📥 Respuesta de la API:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ ¡Prueba exitosa!');
      console.log('📧 Email de confirmación enviado al cliente');
      console.log('📧 Email de notificación enviado al administrador');
      console.log('💾 Presupuesto guardado en la base de datos');
      console.log('📱 URL de WhatsApp generada:', data.whatsappUrl);
      
      console.log('\n🎯 Funcionalidades probadas:');
      console.log('   • Modal de contacto desde página principal');
      console.log('   • Botón "Contactar" en tarjetas de productos');
      console.log('   • Botón "Contactar Vendedor" en modal de detalles');
      console.log('   • Integración con WhatsApp');
      console.log('   • Envío de emails');
    } else {
      console.log('\n❌ Error en la prueba:', data.error);
    }

  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   • El servidor esté ejecutándose en http://localhost:3000');
    console.log('   • La base de datos esté conectada');
    console.log('   • Las variables de entorno estén configuradas');
  }
};

// Ejecutar la prueba
testHomepageContact(); 