#!/usr/bin/env node

/**
 * Script para probar login y funcionalidad del carrito
 * Identifica problemas de autenticación
 */

const fetch = require('node-fetch');

console.log('🧪 Probando login y carrito...\n');

async function testLoginAndCart() {
  try {
    // 1. Probar login
    console.log('🔐 1. Probando login...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@it360.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log(`   ❌ Login falló: ${loginResponse.status} ${loginResponse.statusText}`);
      const errorData = await loginResponse.text();
      console.log(`   📄 Error: ${errorData}`);
      return;
    }

    const loginData = await loginResponse.json();
    console.log(`   ✅ Login exitoso para: ${loginData.user?.email}`);
    console.log(`   🎫 Token recibido: ${loginData.token ? 'Sí' : 'No'}`);

    if (!loginData.token) {
      console.log('   ❌ No se recibió token de autenticación');
      return;
    }

    // 2. Probar carrito con token válido
    console.log('\n🛒 2. Probando carrito con token válido...');
    
    const cartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (cartResponse.ok) {
      const cartData = await cartResponse.json();
      console.log(`   ✅ Carrito accedido exitosamente`);
      console.log(`   📦 Items en carrito: ${cartData.items?.length || 0}`);
    } else {
      console.log(`   ❌ Error accediendo al carrito: ${cartResponse.status} ${cartResponse.statusText}`);
      const errorData = await cartResponse.text();
      console.log(`   📄 Error: ${errorData}`);
    }

    // 3. Probar carrito sin token
    console.log('\n🚫 3. Probando carrito sin token...');
    
    const cartNoAuthResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (cartNoAuthResponse.status === 401) {
      console.log(`   ✅ Respuesta 401 correcta para usuario no autenticado`);
    } else {
      console.log(`   ❌ Respuesta inesperada: ${cartNoAuthResponse.status} ${cartNoAuthResponse.statusText}`);
    }

    // 4. Probar agregar producto al carrito
    console.log('\n➕ 4. Probando agregar producto al carrito...');
    
    const addToCartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: '1', // ID de prueba
        quantity: 1
      })
    });

    if (addToCartResponse.ok) {
      console.log(`   ✅ Producto agregado al carrito exitosamente`);
    } else {
      console.log(`   ❌ Error agregando producto: ${addToCartResponse.status} ${addToCartResponse.statusText}`);
      const errorData = await addToCartResponse.text();
      console.log(`   📄 Error: ${errorData}`);
    }

    // 5. Verificar token expirado
    console.log('\n⏰ 5. Verificando manejo de token expirado...');
    
    // Crear un token malformado
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWtlLWlkIiwiaWF0IjoxNjE2MTYxNjE2LCJleHAiOjE2MTYxNjE2MTZ9.fake-signature';
    
    const expiredResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${fakeToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (expiredResponse.status === 401) {
      console.log(`   ✅ Manejo correcto de token inválido`);
    } else {
      console.log(`   ❌ Manejo inesperado de token inválido: ${expiredResponse.status}`);
    }

  } catch (error) {
    console.log(`   ❌ Error en la prueba: ${error.message}`);
  }
}

// Verificar si el servidor está corriendo
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/test');
    if (response.ok) {
      console.log('✅ Servidor corriendo en http://localhost:3000');
      return true;
    }
  } catch (error) {
    console.log('❌ Servidor no disponible en http://localhost:3000');
    console.log('   💡 Ejecuta: npm run dev');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    return;
  }
  
  await testLoginAndCart();
  
  console.log('\n============================================================');
  console.log('📋 RESUMEN DE PRUEBAS');
  console.log('============================================================');
  console.log('🎯 Si todas las pruebas pasan, el problema puede ser:');
  console.log('   • Usuario no logueado en el navegador');
  console.log('   • Token expirado en localStorage');
  console.log('   • Diferencia entre token del servidor y del cliente');
  console.log('');
  console.log('🚀 Soluciones:');
  console.log('   • Limpiar localStorage y volver a loguear');
  console.log('   • Verificar que el usuario exista en la base de datos');
  console.log('   • Revisar logs del servidor para más detalles');
}

main().catch(console.error); 