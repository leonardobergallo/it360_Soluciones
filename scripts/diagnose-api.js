import fetch from 'node-fetch';

async function testEndpoint(url, name) {
  try {
    console.log(`\n🔍 Probando ${name}: ${url}`);
    
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Content-Type: ${contentType}`);
    
    if (!response.ok) {
      console.log(`   ❌ Error HTTP: ${response.status}`);
      const text = await response.text();
      console.log(`   Respuesta: ${text.substring(0, 200)}...`);
      return false;
    }
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`   ✅ JSON válido recibido`);
      console.log(`   Datos: ${JSON.stringify(data).substring(0, 100)}...`);
      return true;
    } else {
      const text = await response.text();
      console.log(`   ❌ Respuesta no es JSON`);
      console.log(`   Respuesta: ${text.substring(0, 200)}...`);
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Error de conexión: ${error.message}`);
    return false;
  }
}

async function runDiagnostics() {
  console.log('🚀 Iniciando diagnóstico de API...\n');
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  const endpoints = [
    { url: `${baseUrl}/api/test`, name: 'Test API' },
    { url: `${baseUrl}/api/products`, name: 'Products API' },
    { url: `${baseUrl}/api/services`, name: 'Services API' },
    { url: `${baseUrl}/api/users`, name: 'Users API' },
    { url: `${baseUrl}/api/cart`, name: 'Cart API' },
    { url: `${baseUrl}/api/contact`, name: 'Contact API' },
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint.url, endpoint.name);
    results.push({ ...endpoint, success });
  }
  
  console.log('\n📊 Resumen de resultados:');
  console.log('========================');
  
  const working = results.filter(r => r.success);
  const failing = results.filter(r => !r.success);
  
  console.log(`✅ Endpoints funcionando: ${working.length}`);
  working.forEach(r => console.log(`   - ${r.name}`));
  
  console.log(`❌ Endpoints con problemas: ${failing.length}`);
  failing.forEach(r => console.log(`   - ${r.name}`));
  
  if (failing.length > 0) {
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que el servidor esté corriendo en', baseUrl);
    console.log('2. Verificar la conexión a la base de datos');
    console.log('3. Verificar las variables de entorno (.env)');
    console.log('4. Ejecutar: npm run dev');
    console.log('5. Verificar logs del servidor para errores específicos');
  }
}

// Ejecutar diagnóstico
runDiagnostics().catch(console.error); 