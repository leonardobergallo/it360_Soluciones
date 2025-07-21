#!/usr/bin/env node

/**
 * Script para diagnosticar problemas de autenticación en el carrito
 * Identifica por qué se están produciendo errores 401
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico de autenticación del carrito...\n');

// 1. Verificar archivos de autenticación
console.log('📁 1. Verificando archivos de autenticación...');

const authFiles = [
  'app/api/cart/route.ts',
  'app/api/auth/login/route.ts',
  'app/login/page.tsx',
  'components/CartIconWithBadge.tsx'
];

authFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} - Existe`);
  } else {
    console.log(`   ❌ ${file} - NO EXISTE`);
  }
});

// 2. Verificar configuración de JWT
console.log('\n🔐 2. Verificando configuración JWT...');

const cartRoute = fs.readFileSync('app/api/cart/route.ts', 'utf8');
const loginRoute = fs.readFileSync('app/api/auth/login/route.ts', 'utf8');

// Verificar secret key
if (cartRoute.includes('NEXTAUTH_SECRET') || cartRoute.includes('it360-secret-key-2024')) {
  console.log('   ✅ Secret key configurado en cart route');
} else {
  console.log('   ❌ Secret key NO configurado en cart route');
}

if (loginRoute.includes('NEXTAUTH_SECRET') || loginRoute.includes('it360-secret-key-2024')) {
  console.log('   ✅ Secret key configurado en login route');
} else {
  console.log('   ❌ Secret key NO configurado en login route');
}

// 3. Verificar manejo de tokens
console.log('\n🎫 3. Verificando manejo de tokens...');

const cartIcon = fs.readFileSync('components/CartIconWithBadge.tsx', 'utf8');
const homePage = fs.readFileSync('app/page.tsx', 'utf8');

if (cartIcon.includes('localStorage.getItem(\'authToken\')')) {
  console.log('   ✅ CartIconWithBadge obtiene token del localStorage');
} else {
  console.log('   ❌ CartIconWithBadge NO obtiene token del localStorage');
}

if (homePage.includes('localStorage.getItem(\'authToken\')')) {
  console.log('   ✅ Home page obtiene token del localStorage');
} else {
  console.log('   ❌ Home page NO obtiene token del localStorage');
}

if (cartIcon.includes('Authorization: `Bearer ${token}`')) {
  console.log('   ✅ CartIconWithBadge envía Authorization header');
} else {
  console.log('   ❌ CartIconWithBadge NO envía Authorization header');
}

if (homePage.includes('Authorization: `Bearer ${token}`')) {
  console.log('   ✅ Home page envía Authorization header');
} else {
  console.log('   ❌ Home page NO envía Authorization header');
}

// 4. Verificar verificación de admin en cart route
console.log('\n👤 4. Verificando verificación de usuario...');

if (cartRoute.includes('getUserIdFromRequest')) {
  console.log('   ✅ Función getUserIdFromRequest implementada');
} else {
  console.log('   ❌ Función getUserIdFromRequest NO implementada');
}

if (cartRoute.includes('jwt.verify')) {
  console.log('   ✅ Verificación JWT implementada');
} else {
  console.log('   ❌ Verificación JWT NO implementada');
}

// 5. Verificar manejo de errores
console.log('\n⚠️ 5. Verificando manejo de errores...');

if (cartRoute.includes('TokenExpiredError')) {
  console.log('   ✅ Manejo de token expirado implementado');
} else {
  console.log('   ❌ Manejo de token expirado NO implementado');
}

if (cartRoute.includes('status: 401')) {
  console.log('   ✅ Respuesta 401 implementada');
} else {
  console.log('   ❌ Respuesta 401 NO implementada');
}

// 6. Verificar intervalos de actualización
console.log('\n⏰ 6. Verificando intervalos de actualización...');

if (cartIcon.includes('setInterval(updateCount, 1000)')) {
  console.log('   ✅ Intervalo de actualización cada 1 segundo');
} else {
  console.log('   ❌ Intervalo de actualización NO configurado');
}

// 7. Posibles causas de errores 401
console.log('\n🔍 7. Posibles causas de errores 401:');
console.log('   • Token no existe en localStorage');
console.log('   • Token expirado');
console.log('   • Token malformado');
console.log('   • Secret key diferente entre login y cart');
console.log('   • Usuario eliminado de la base de datos');
console.log('   • Problemas de CORS');
console.log('   • Headers de autorización mal enviados');

// 8. Soluciones recomendadas
console.log('\n💡 8. Soluciones recomendadas:');
console.log('   • Verificar que el usuario esté logueado');
console.log('   • Limpiar localStorage y volver a loguear');
console.log('   • Verificar que el secret key sea el mismo en todas las rutas');
console.log('   • Revisar logs del servidor para más detalles');
console.log('   • Probar con un usuario recién creado');

console.log('\n============================================================');
console.log('📋 RESUMEN DEL DIAGNÓSTICO');
console.log('============================================================');
console.log('🎯 Si todos los archivos existen y están configurados correctamente,');
console.log('   el problema probablemente sea:');
console.log('   1. Token expirado o inválido');
console.log('   2. Usuario no logueado');
console.log('   3. Diferencia en secret keys');
console.log('');
console.log('🚀 Próximos pasos:');
console.log('   • node scripts/test-login-cart.js - Probar login y carrito');
console.log('   • Revisar localStorage en el navegador');
console.log('   • Verificar logs del servidor Next.js'); 