#!/usr/bin/env node

/**
 * Script para verificar que las páginas de administración funcionen correctamente
 * Verifica que se muestren productos y servicios
 */

const fs = require('fs');

console.log('🔍 Verificando páginas de administración...\n');

// 1. Verificar archivos de páginas admin
console.log('📁 1. Verificando archivos de páginas admin...');

const adminPages = [
  'app/admin/page.tsx',
  'app/admin/products/page.tsx',
  'app/admin/services/page.tsx',
  'app/admin/sales/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/presupuestos/page.tsx'
];

adminPages.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`   ✅ ${page} - Existe`);
  } else {
    console.log(`   ❌ ${page} - NO EXISTE`);
  }
});

// 2. Verificar APIs
console.log('\n🔌 2. Verificando APIs...');

const apis = [
  'app/api/products/route.ts',
  'app/api/services/route.ts',
  'app/api/services/[id]/route.ts',
  'app/api/sales/route.ts',
  'app/api/users/route.ts',
  'app/api/presupuestos/route.ts'
];

apis.forEach(api => {
  if (fs.existsSync(api)) {
    console.log(`   ✅ ${api} - Existe`);
  } else {
    console.log(`   ❌ ${api} - NO EXISTE`);
  }
});

// 3. Verificar componentes
console.log('\n🧩 3. Verificando componentes...');

const components = [
  'components/AdminLayout.tsx',
  'components/Table.tsx',
  'components/AuthGuard.tsx'
];

components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`   ✅ ${component} - Existe`);
  } else {
    console.log(`   ❌ ${component} - NO EXISTE`);
  }
});

// 4. Verificar configuración de servicios
console.log('\n⚙️ 4. Verificando configuración de servicios...');

const servicesPage = fs.readFileSync('app/admin/services/page.tsx', 'utf8');
const productsPage = fs.readFileSync('app/admin/products/page.tsx', 'utf8');

// Verificar fetch de servicios
if (servicesPage.includes('fetch(\'/api/services\')')) {
  console.log('   ✅ Página de servicios hace fetch a /api/services');
} else {
  console.log('   ❌ Página de servicios NO hace fetch a /api/services');
}

// Verificar fetch de productos
if (productsPage.includes('fetch(\'/api/products\')')) {
  console.log('   ✅ Página de productos hace fetch a /api/products');
} else {
  console.log('   ❌ Página de productos NO hace fetch a /api/products');
}

// Verificar manejo de errores
if (servicesPage.includes('try') && servicesPage.includes('catch')) {
  console.log('   ✅ Página de servicios tiene manejo de errores');
} else {
  console.log('   ❌ Página de servicios NO tiene manejo de errores');
}

if (productsPage.includes('try') && productsPage.includes('catch')) {
  console.log('   ✅ Página de productos tiene manejo de errores');
} else {
  console.log('   ❌ Página de productos NO tiene manejo de errores');
}

// 5. Verificar funciones CRUD
console.log('\n🔄 5. Verificando funciones CRUD...');

// Servicios
if (servicesPage.includes('handleAddService')) {
  console.log('   ✅ Función handleAddService implementada');
} else {
  console.log('   ❌ Función handleAddService NO implementada');
}

if (servicesPage.includes('handleEditService')) {
  console.log('   ✅ Función handleEditService implementada');
} else {
  console.log('   ❌ Función handleEditService NO implementada');
}

if (servicesPage.includes('handleDeleteService')) {
  console.log('   ✅ Función handleDeleteService implementada');
} else {
  console.log('   ❌ Función handleDeleteService NO implementada');
}

// Productos
if (productsPage.includes('handleAddProduct')) {
  console.log('   ✅ Función handleAddProduct implementada');
} else {
  console.log('   ❌ Función handleAddProduct NO implementada');
}

if (productsPage.includes('handleEditProduct')) {
  console.log('   ✅ Función handleEditProduct implementada');
} else {
  console.log('   ❌ Función handleEditProduct NO implementada');
}

if (productsPage.includes('handleDeleteProduct')) {
  console.log('   ✅ Función handleDeleteProduct implementada');
} else {
  console.log('   ❌ Función handleDeleteProduct NO implementada');
}

// 6. Verificar APIs CRUD
console.log('\n🔗 6. Verificando APIs CRUD...');

const servicesApi = fs.readFileSync('app/api/services/route.ts', 'utf8');
const productsApi = fs.readFileSync('app/api/products/route.ts', 'utf8');

// Servicios API
if (servicesApi.includes('export async function GET')) {
  console.log('   ✅ API servicios tiene GET');
} else {
  console.log('   ❌ API servicios NO tiene GET');
}

if (servicesApi.includes('export async function POST')) {
  console.log('   ✅ API servicios tiene POST');
} else {
  console.log('   ❌ API servicios NO tiene POST');
}

// Productos API
if (productsApi.includes('export async function GET')) {
  console.log('   ✅ API productos tiene GET');
} else {
  console.log('   ❌ API productos NO tiene GET');
}

if (productsApi.includes('export async function POST')) {
  console.log('   ✅ API productos tiene POST');
} else {
  console.log('   ❌ API productos NO tiene POST');
}

if (productsApi.includes('export async function PUT')) {
  console.log('   ✅ API productos tiene PUT');
} else {
  console.log('   ❌ API productos NO tiene PUT');
}

if (productsApi.includes('export async function DELETE')) {
  console.log('   ✅ API productos tiene DELETE');
} else {
  console.log('   ❌ API productos NO tiene DELETE');
}

// 7. Soluciones para problemas comunes
console.log('\n💡 7. Soluciones para problemas comunes:');

console.log('\n   🔄 Si no se ven datos:');
console.log('   • Verifica que el servidor esté corriendo: npm run dev');
console.log('   • Verifica que la base de datos esté conectada');
console.log('   • Ejecuta: node scripts/seed.js para poblar datos');
console.log('   • Revisa la consola del navegador para errores');

console.log('\n   🔄 Si hay errores 401:');
console.log('   • Limpia localStorage y vuelve a loguear');
console.log('   • Verifica que el usuario tenga rol ADMIN');
console.log('   • Ejecuta: node scripts/fix-cart-auth.js');

console.log('\n   🔄 Si no se pueden crear/editar:');
console.log('   • Verifica que las APIs estén funcionando');
console.log('   • Revisa los logs del servidor');
console.log('   • Verifica la estructura de la base de datos');

console.log('\n============================================================');
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('============================================================');
console.log('🎯 Si todos los archivos existen y están configurados:');
console.log('   • Las páginas deberían mostrar datos correctamente');
console.log('   • Las funciones CRUD deberían funcionar');
console.log('   • Los errores deberían manejarse apropiadamente');
console.log('');
console.log('🚀 Próximos pasos:');
console.log('   • npm run dev - Iniciar servidor');
console.log('   • Ir a /admin - Verificar dashboard');
console.log('   • Probar crear/editar/eliminar productos y servicios');
console.log('   • Revisar consola del navegador para errores'); 