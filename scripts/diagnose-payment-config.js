#!/usr/bin/env node

/**
 * Script para diagnosticar problemas con la configuración de pagos
 * Verifica la API, la base de datos y la configuración
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico de Configuración de Pagos\n');

// 1. Verificar archivos de configuración
console.log('📁 1. Verificando archivos de configuración...');

const filesToCheck = [
  'app/admin/payment-config/page.tsx',
  'app/api/admin/payment-config/route.ts',
  'app/api/checkout/route.ts'
];

filesToCheck.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${filePath} - Existe`);
    } else {
      console.log(`   ❌ ${filePath} - NO EXISTE`);
    }
  } catch (error) {
    console.log(`   ❌ ${filePath} - Error al verificar`);
  }
});

// 2. Verificar variables de entorno
console.log('\n🔧 2. Verificando variables de entorno...');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = [
    'RESEND_API_KEY',
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'MERCADOPAGO_ACCESS_TOKEN'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName} - Configurada`);
    } else {
      console.log(`   ⚠️  ${varName} - NO CONFIGURADA`);
    }
  });
} else {
  console.log('   ⚠️  Archivo .env.local no encontrado');
}

// 3. Verificar base de datos
console.log('\n🗄️ 3. Verificando base de datos...');

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  console.log(`   ✅ Base de datos existe (${fileSizeInMB.toFixed(2)} MB)`);
} else {
  console.log('   ❌ Base de datos no encontrada');
}

// 4. Verificar schema de Prisma
console.log('\n📋 4. Verificando schema de Prisma...');

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Verificar modelos relacionados con pagos
  const paymentModels = [
    'PaymentPreference',
    'Sale',
    'User'
  ];
  
  paymentModels.forEach(model => {
    if (schemaContent.includes(`model ${model}`)) {
      console.log(`   ✅ Modelo ${model} - Existe`);
    } else {
      console.log(`   ❌ Modelo ${model} - NO EXISTE`);
    }
  });
} else {
  console.log('   ❌ Schema de Prisma no encontrado');
}

// 5. Verificar dependencias
console.log('\n📦 5. Verificando dependencias...');

const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = [
    '@prisma/client',
    'jsonwebtoken',
    'resend'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageContent.dependencies && packageContent.dependencies[dep]) {
      console.log(`   ✅ ${dep} - Instalada (${packageContent.dependencies[dep]})`);
    } else if (packageContent.devDependencies && packageContent.devDependencies[dep]) {
      console.log(`   ✅ ${dep} - Instalada como dev (${packageContent.devDependencies[dep]})`);
    } else {
      console.log(`   ❌ ${dep} - NO INSTALADA`);
    }
  });
} else {
  console.log('   ❌ package.json no encontrado');
}

// 6. Verificar configuración de la API
console.log('\n🔌 6. Verificando configuración de la API...');

try {
  const apiRoutePath = path.join(process.cwd(), 'app', 'api', 'admin', 'payment-config', 'route.ts');
  if (fs.existsSync(apiRoutePath)) {
    const apiContent = fs.readFileSync(apiRoutePath, 'utf8');
    
    // Verificar funciones exportadas
    const requiredExports = ['GET', 'PUT'];
    requiredExports.forEach(exportName => {
      if (apiContent.includes(`export async function ${exportName}`)) {
        console.log(`   ✅ Función ${exportName} - Existe`);
      } else {
        console.log(`   ❌ Función ${exportName} - NO EXISTE`);
      }
    });
    
    // Verificar verificación de admin
    if (apiContent.includes('verifyAdmin')) {
      console.log(`   ✅ Verificación de admin - Implementada`);
    } else {
      console.log(`   ❌ Verificación de admin - NO IMPLEMENTADA`);
    }
  } else {
    console.log('   ❌ Archivo de API no encontrado');
  }
} catch (error) {
  console.log(`   ❌ Error al verificar API: ${error.message}`);
}

// 7. Verificar página de configuración
console.log('\n📄 7. Verificando página de configuración...');

try {
  const pagePath = path.join(process.cwd(), 'app', 'admin', 'payment-config', 'page.tsx');
  if (fs.existsSync(pagePath)) {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    
    // Verificar hooks y funciones
    const requiredHooks = ['useState', 'useEffect'];
    requiredHooks.forEach(hook => {
      if (pageContent.includes(hook)) {
        console.log(`   ✅ Hook ${hook} - Usado`);
      } else {
        console.log(`   ❌ Hook ${hook} - NO USADO`);
      }
    });
    
    // Verificar funciones
    const requiredFunctions = ['fetchConfig', 'handleTogglePayment'];
    requiredFunctions.forEach(func => {
      if (pageContent.includes(func)) {
        console.log(`   ✅ Función ${func} - Implementada`);
      } else {
        console.log(`   ❌ Función ${func} - NO IMPLEMENTADA`);
      }
    });
  } else {
    console.log('   ❌ Página no encontrada');
  }
} catch (error) {
  console.log(`   ❌ Error al verificar página: ${error.message}`);
}

console.log('\n' + '='.repeat(60));
console.log('📋 RESUMEN DE DIAGNÓSTICO');
console.log('='.repeat(60));

console.log('\n🚀 POSIBLES SOLUCIONES:');
console.log('1. Si faltan archivos: Verifica que todos los archivos estén en su lugar');
console.log('2. Si faltan variables de entorno: Configura .env.local con las variables necesarias');
console.log('3. Si la base de datos no existe: Ejecuta "npx prisma db push"');
console.log('4. Si faltan dependencias: Ejecuta "npm install"');
console.log('5. Si hay errores de API: Verifica los logs del servidor');
console.log('6. Si la página no carga: Verifica la consola del navegador');

console.log('\n🔧 COMANDOS ÚTILES:');
console.log('• npm run dev - Iniciar servidor de desarrollo');
console.log('• npx prisma db push - Sincronizar base de datos');
console.log('• npx prisma generate - Regenerar cliente de Prisma');
console.log('• npm install - Instalar dependencias');

console.log('\n📧 Para recibir notificaciones de problemas:');
console.log('• Todos los errores se enviarán a: it360tecnologia@gmail.com'); 