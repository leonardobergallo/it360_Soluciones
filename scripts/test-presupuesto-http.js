console.log('🌐 Probando API de Presupuestos via HTTP...\n');

async function testPresupuestoHTTP() {
  try {
    console.log('📤 Enviando solicitud POST a /api/presupuestos...');
    
    const response = await fetch('http://localhost:3000/api/presupuestos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Leonardo Bergallo',
        email: 'leonardobergallo@gmail.com',
        telefono: '123456789',
        empresa: 'IT360 Soluciones',
        servicio: 'Desarrollo Web',
        mensaje: 'Necesito un presupuesto para mi sitio web'
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

testPresupuestoHTTP(); 