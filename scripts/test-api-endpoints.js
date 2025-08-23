const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPIEndpoints() {
  console.log('🧪 Probando endpoints de las APIs...\n');

  const baseURL = 'http://localhost:3000';

  // 1. Probar API de productos
  console.log('1️⃣ Probando GET /api/products...');
  try {
    const response = await fetch(`${baseURL}/api/products`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ API de productos funcionando - ${data.length} productos encontrados`);
    } else {
      console.log(`❌ Error en API de productos: ${response.status} - ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Error conectando a API de productos: ${error.message}`);
  }

  // 2. Probar API de servicios
  console.log('\n2️⃣ Probando GET /api/services...');
  try {
    const response = await fetch(`${baseURL}/api/services`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ API de servicios funcionando - ${data.length} servicios encontrados`);
    } else {
      console.log(`❌ Error en API de servicios: ${response.status} - ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Error conectando a API de servicios: ${error.message}`);
  }

  // 3. Probar API de carrito (sin autenticación)
  console.log('\n3️⃣ Probando GET /api/cart (sin autenticación)...');
  try {
    const response = await fetch(`${baseURL}/api/cart`);
    const data = await response.json();
    
    if (response.status === 401) {
      console.log('✅ API de carrito funcionando - Correctamente rechaza peticiones no autenticadas');
    } else {
      console.log(`⚠️  API de carrito: ${response.status} - ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Error conectando a API de carrito: ${error.message}`);
  }

  // 4. Probar página principal
  console.log('\n4️⃣ Probando página principal...');
  try {
    const response = await fetch(`${baseURL}/`);
    
    if (response.ok) {
      console.log('✅ Página principal funcionando');
    } else {
      console.log(`❌ Error en página principal: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error conectando a página principal: ${error.message}`);
  }

  // 5. Probar página de catálogo
  console.log('\n5️⃣ Probando página de catálogo...');
  try {
    const response = await fetch(`${baseURL}/catalogo`);
    
    if (response.ok) {
      console.log('✅ Página de catálogo funcionando');
    } else {
      console.log(`❌ Error en página de catálogo: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error conectando a página de catálogo: ${error.message}`);
  }

  // 6. Probar página de admin productos
  console.log('\n6️⃣ Probando página de admin productos...');
  try {
    const response = await fetch(`${baseURL}/admin/products`);
    
    if (response.ok) {
      console.log('✅ Página de admin productos funcionando');
    } else {
      console.log(`❌ Error en página de admin productos: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error conectando a página de admin productos: ${error.message}`);
  }

  console.log('\n🎉 ¡Pruebas de endpoints completadas!');
  console.log('\n🌐 El servidor está listo en: http://localhost:3000');
}

// Ejecutar las pruebas
testAPIEndpoints().catch(console.error);
