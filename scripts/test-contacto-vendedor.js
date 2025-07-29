console.log('🌐 Probando API de Contacto Vendedor...\n');

async function testContactoVendedor() {
  try {
    console.log('📤 Enviando solicitud POST a /api/contacto-vendedor...');
    
    const response = await fetch('http://localhost:3001/api/contacto-vendedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Anibal Leonardo',
        email: 'leonardobergallo@gmail.com',
        telefono: '03425089906',
        mensaje: 'Me interesa el producto: Disco Duro Externo 1TB. ¿Podrían darme más información?'
      })
    });

    console.log(`📊 Status: ${response.status}`);
    console.log(`📊 Status Text: ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error en la respuesta:');
      console.log(errorText);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté corriendo:');
    console.log('   npm run dev');
  }
}

testContactoVendedor(); 