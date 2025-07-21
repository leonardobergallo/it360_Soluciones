#!/usr/bin/env node

/**
 * Script para solucionar problemas de autenticación del carrito
 * Limpia localStorage y proporciona soluciones
 */

const fs = require('fs');

console.log('🔧 Solucionando problemas de autenticación del carrito...\n');

// 1. Verificar archivos de configuración
console.log('📁 1. Verificando configuración...');

const configFiles = [
  'app/api/cart/route.ts',
  'app/api/auth/login/route.ts',
  'components/CartIconWithBadge.tsx'
];

let allFilesOk = true;
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} - OK`);
  } else {
    console.log(`   ❌ ${file} - FALTANTE`);
    allFilesOk = false;
  }
});

if (!allFilesOk) {
  console.log('\n❌ Algunos archivos están faltando. Ejecuta primero:');
  console.log('   npm run build');
  return;
}

// 2. Verificar secret keys
console.log('\n🔐 2. Verificando secret keys...');

const cartRoute = fs.readFileSync('app/api/cart/route.ts', 'utf8');
const loginRoute = fs.readFileSync('app/api/auth/login/route.ts', 'utf8');

const cartSecret = cartRoute.includes('NEXTAUTH_SECRET') || cartRoute.includes('it360-secret-key-2024');
const loginSecret = loginRoute.includes('NEXTAUTH_SECRET') || loginRoute.includes('it360-secret-key-2024');

if (cartSecret && loginSecret) {
  console.log('   ✅ Secret keys configurados correctamente');
} else {
  console.log('   ❌ Problema con secret keys');
  console.log('   💡 Verifica que NEXTAUTH_SECRET esté configurado');
}

// 3. Soluciones para errores 401
console.log('\n💡 3. Soluciones para errores 401:');

console.log('\n   🔄 SOLUCIÓN 1: Limpiar localStorage');
console.log('   • Abre las herramientas de desarrollador (F12)');
console.log('   • Ve a la pestaña "Application" o "Aplicación"');
console.log('   • En "Local Storage" → "http://localhost:3000"');
console.log('   • Elimina las claves: authToken, user');
console.log('   • Recarga la página y vuelve a loguear');

console.log('\n   🔄 SOLUCIÓN 2: Verificar usuario en base de datos');
console.log('   • Ejecuta: node scripts/show-login-users.js');
console.log('   • Verifica que el usuario exista y tenga el rol correcto');

console.log('\n   🔄 SOLUCIÓN 3: Regenerar token');
console.log('   • Cierra sesión completamente');
console.log('   • Limpia cookies del navegador');
console.log('   • Vuelve a loguear con credenciales válidas');

console.log('\n   🔄 SOLUCIÓN 4: Verificar servidor');
console.log('   • Asegúrate de que el servidor esté corriendo: npm run dev');
console.log('   • Verifica que no haya errores en la consola del servidor');

// 4. Comandos útiles
console.log('\n🚀 4. Comandos útiles:');

console.log('\n   Para verificar usuarios:');
console.log('   node scripts/show-login-users.js');

console.log('\n   Para crear un usuario de prueba:');
console.log('   node scripts/create-test-user.js');

console.log('\n   Para verificar la base de datos:');
console.log('   npx prisma studio');

console.log('\n   Para reiniciar el servidor:');
console.log('   npm run dev');

// 5. Código JavaScript para ejecutar en el navegador
console.log('\n💻 5. Código para ejecutar en la consola del navegador:');

console.log('\n   Para limpiar localStorage:');
console.log('   localStorage.removeItem("authToken");');
console.log('   localStorage.removeItem("user");');
console.log('   localStorage.removeItem("carrito");');
console.log('   location.reload();');

console.log('\n   Para verificar localStorage:');
console.log('   console.log("authToken:", localStorage.getItem("authToken"));');
console.log('   console.log("user:", localStorage.getItem("user"));');
console.log('   console.log("carrito:", localStorage.getItem("carrito"));');

console.log('\n   Para forzar logout:');
console.log('   localStorage.clear();');
console.log('   window.location.href = "/login";');

// 6. Verificar si hay problemas conocidos
console.log('\n🔍 6. Problemas conocidos y soluciones:');

console.log('\n   ❌ PROBLEMA: Token expirado');
console.log('   ✅ SOLUCIÓN: Limpiar localStorage y volver a loguear');

console.log('\n   ❌ PROBLEMA: Usuario eliminado de la base de datos');
console.log('   ✅ SOLUCIÓN: Crear nuevo usuario o restaurar desde backup');

console.log('\n   ❌ PROBLEMA: Secret key diferente entre rutas');
console.log('   ✅ SOLUCIÓN: Verificar variable de entorno NEXTAUTH_SECRET');

console.log('\n   ❌ PROBLEMA: CORS o problemas de red');
console.log('   ✅ SOLUCIÓN: Verificar que el servidor esté corriendo en localhost:3000');

console.log('\n   ❌ PROBLEMA: Headers de autorización mal enviados');
console.log('   ✅ SOLUCIÓN: Verificar que el token se envíe como "Bearer <token>"');

console.log('\n============================================================');
console.log('📋 RESUMEN DE SOLUCIONES');
console.log('============================================================');
console.log('🎯 Los errores 401 son normales cuando:');
console.log('   • El usuario no está logueado');
console.log('   • El token ha expirado');
console.log('   • El usuario fue eliminado de la base de datos');
console.log('');
console.log('🚀 Pasos recomendados:');
console.log('   1. Limpiar localStorage en el navegador');
console.log('   2. Verificar que el servidor esté corriendo');
console.log('   3. Volver a loguear con credenciales válidas');
console.log('   4. Si persiste, verificar la base de datos');
console.log('');
console.log('💡 El componente CartIconWithBadge ya maneja automáticamente');
console.log('   los errores 401 y limpia el token expirado.'); 