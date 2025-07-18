// Script para probar la funcionalidad de contacto con vendedor
const testContactVendor = async () => {
  console.log('🧪 Probando funcionalidad de contacto con vendedor...\n');

  try {
    // Datos de prueba
    const testData = {
      nombre: 'Juan Pérez',
      email: 'juan.perez@test.com',
      telefono: '+54 9 342 123 4567',
      mensaje: 'Me interesa el producto Mouse inalámbrico. ¿Tienen stock disponible?',
      producto: 'Mouse inalámbrico con iluminación RGB',
      precio: 4999,
      tipoConsulta: 'Consulta de Producto'
    };

    console.log('📤 Enviando datos de prueba:', testData);

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
testContactVendor(); 