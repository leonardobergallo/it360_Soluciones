require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testContactForm() {
  try {
    console.log('🧪 Probando formulario de contacto completo...\n');

    // Datos de prueba
    const testData = {
      nombre: 'Test Contacto',
      email: 'test@contacto.com',
      telefono: '+54 9 342 123-4567',
      empresa: 'Empresa Test',
      servicio: 'Desarrollo Web',
      mensaje: 'Este es un mensaje de prueba para verificar que el formulario de contacto funciona correctamente y envía emails.'
    };

    console.log('📝 Datos de prueba:');
    console.log(`   • Nombre: ${testData.nombre}`);
    console.log(`   • Email: ${testData.email}`);
    console.log(`   • Teléfono: ${testData.telefono}`);
    console.log(`   • Empresa: ${testData.empresa}`);
    console.log(`   • Servicio: ${testData.servicio}`);
    console.log(`   • Mensaje: ${testData.mensaje}`);

    console.log('\n📡 Enviando formulario...');
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log(`   • Status: ${response.status}`);
    console.log(`   • OK: ${response.ok}`);

    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Formulario enviado exitosamente!');
      console.log(`   • Contacto ID: ${result.contacto?.id}`);
      console.log(`   • Ticket: ${result.ticket?.ticketNumber}`);
      console.log(`   • Mensaje: ${result.message}`);
      
      console.log('\n📧 Verificando envío de emails...');
      console.log('   • Revisa la bandeja de entrada de it360tecnologia@gmail.com');
      console.log('   • Busca emails con asunto: "🎫 Nuevo Ticket..."');
      console.log('   • También revisa la carpeta de spam');
      
      console.log('\n🎯 Próximos pasos:');
      console.log('   1. Verifica que llegó el email a it360tecnologia@gmail.com');
      console.log('   2. Ve a http://localhost:3001/admin/tickets');
      console.log('   3. Verifica que aparece el nuevo ticket');
      console.log('   4. Si no llegó el email, revisa la configuración de Gmail');
      
    } else {
      const errorText = await response.text();
      console.log(`   • Error: ${errorText}`);
      console.log('\n❌ Error enviando formulario');
    }

  } catch (error) {
    console.error('❌ Error probando formulario:', error.message);
    console.log('\n💡 Posibles causas:');
    console.log('   1. El servidor no está corriendo (npm run dev)');
    console.log('   2. El puerto 3001 está ocupado');
    console.log('   3. Hay un error en la API');
  }
}

testContactForm();
