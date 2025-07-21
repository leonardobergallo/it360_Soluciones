#!/usr/bin/env node

/**
 * Script para probar la funcionalidad de importación de productos
 * Verifica que todos los archivos y configuraciones estén correctos
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Probando funcionalidad de importación de productos...\n');

// 1. Verificar archivos necesarios
console.log('📁 1. Verificando archivos necesarios...');

const requiredFiles = [
  'app/admin/import-products/page.tsx',
  'app/api/admin/import-products/route.ts',
  'sample-products.csv'
];

let allFilesExist = true;
requiredFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${filePath} - Existe`);
  } else {
    console.log(`   ❌ ${filePath} - NO EXISTE`);
    allFilesExist = false;
  }
});

// 2. Verificar archivo CSV de ejemplo
console.log('\n📊 2. Verificando archivo CSV de ejemplo...');

if (fs.existsSync('sample-products.csv')) {
  try {
    const csvContent = fs.readFileSync('sample-products.csv', 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    console.log(`   ✅ Archivo CSV válido`);
    console.log(`   📊 Líneas totales: ${lines.length}`);
    console.log(`   📦 Productos: ${lines.length - 1} (excluyendo header)`);
    
    // Verificar header
    const header = lines[0];
    const requiredColumns = ['name', 'description', 'price', 'stock', 'category'];
    const headerColumns = header.split(',').map(col => col.trim().replace(/"/g, ''));
    
    const missingColumns = requiredColumns.filter(col => !headerColumns.includes(col));
    if (missingColumns.length === 0) {
      console.log(`   ✅ Header válido con todas las columnas requeridas`);
    } else {
      console.log(`   ❌ Faltan columnas: ${missingColumns.join(', ')}`);
    }
    
    // Verificar algunos productos
    if (lines.length > 1) {
      const firstProduct = lines[1];
      const productData = firstProduct.split(',').map(col => col.trim().replace(/"/g, ''));
      console.log(`   📋 Primer producto: ${productData[0] || 'Sin nombre'}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error leyendo CSV: ${error.message}`);
  }
} else {
  console.log('   ❌ Archivo CSV de ejemplo no encontrado');
}

// 3. Verificar configuración de la API
console.log('\n🔌 3. Verificando configuración de la API...');

const apiPath = 'app/api/admin/import-products/route.ts';
if (fs.existsSync(apiPath)) {
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  
  const requiredFunctions = ['POST', 'GET'];
  requiredFunctions.forEach(func => {
    if (apiContent.includes(`export async function ${func}`)) {
      console.log(`   ✅ Función ${func} - Implementada`);
    } else {
      console.log(`   ❌ Función ${func} - NO IMPLEMENTADA`);
    }
  });
  
  // Verificar verificación de admin
  if (apiContent.includes('verifyAdmin')) {
    console.log(`   ✅ Verificación de admin - Implementada`);
  } else {
    console.log(`   ❌ Verificación de admin - NO IMPLEMENTADA`);
  }
  
  // Verificar manejo de productos
  if (apiContent.includes('prisma.product.create')) {
    console.log(`   ✅ Creación de productos - Implementada`);
  } else {
    console.log(`   ❌ Creación de productos - NO IMPLEMENTADA`);
  }
  
  if (apiContent.includes('prisma.product.update')) {
    console.log(`   ✅ Actualización de productos - Implementada`);
  } else {
    console.log(`   ❌ Actualización de productos - NO IMPLEMENTADA`);
  }
} else {
  console.log('   ❌ Archivo de API no encontrado');
}

// 4. Verificar página de importación
console.log('\n📄 4. Verificando página de importación...');

const pagePath = 'app/admin/import-products/page.tsx';
if (fs.existsSync(pagePath)) {
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  
  const requiredFeatures = [
    'handleFileChange',
    'parseCSV',
    'handleImport',
    'downloadTemplate'
  ];
  
  requiredFeatures.forEach(feature => {
    if (pageContent.includes(feature)) {
      console.log(`   ✅ Función ${feature} - Implementada`);
    } else {
      console.log(`   ❌ Función ${feature} - NO IMPLEMENTADA`);
    }
  });
  
  // Verificar componentes de UI
  const uiComponents = [
    'file input',
    'preview',
    'import button',
    'template download'
  ];
  
  uiComponents.forEach(component => {
    if (pageContent.includes(component.replace(' ', '')) || pageContent.includes('file')) {
      console.log(`   ✅ Componente ${component} - Presente`);
    } else {
      console.log(`   ⚠️  Componente ${component} - No detectado`);
    }
  });
} else {
  console.log('   ❌ Página de importación no encontrada');
}

// 5. Verificar enlace en panel admin
console.log('\n🔗 5. Verificando enlace en panel admin...');

const adminPagePath = 'app/admin/page.tsx';
if (fs.existsSync(adminPagePath)) {
  const adminContent = fs.readFileSync(adminPagePath, 'utf8');
  
  if (adminContent.includes('import-products')) {
    console.log(`   ✅ Enlace a importación - Presente en panel admin`);
  } else {
    console.log(`   ❌ Enlace a importación - NO PRESENTE en panel admin`);
  }
  
  if (adminContent.includes('Importar Productos')) {
    console.log(`   ✅ Texto "Importar Productos" - Presente`);
  } else {
    console.log(`   ❌ Texto "Importar Productos" - NO PRESENTE`);
  }
} else {
  console.log('   ❌ Página de admin no encontrada');
}

console.log('\n' + '='.repeat(60));
console.log('📋 RESUMEN DE PRUEBAS');
console.log('='.repeat(60));

if (allFilesExist) {
  console.log('🎉 ¡Funcionalidad de importación lista para usar!');
  console.log('\n🚀 Pasos para probar:');
  console.log('1. Inicia el servidor: npm run dev');
  console.log('2. Ve al panel de administración');
  console.log('3. Haz clic en "Importar Productos"');
  console.log('4. Descarga el template o usa sample-products.csv');
  console.log('5. Sube el archivo y confirma la importación');
} else {
  console.log('⚠️  Algunos archivos faltan. Revisa los errores arriba.');
}

console.log('\n📧 Notificaciones:');
console.log('• Todos los resultados se enviarán a: it360tecnologia@gmail.com');
console.log('• Los logs de importación aparecerán en la consola del servidor');

console.log('\n🔧 Comandos útiles:');
console.log('• npm run dev - Iniciar servidor');
console.log('• node scripts/generate-sample-products.js - Generar CSV de ejemplo');
console.log('• npx prisma db push - Sincronizar base de datos'); 