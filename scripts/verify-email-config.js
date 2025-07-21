#!/usr/bin/env node

/**
 * Script para verificar que todas las configuraciones de email
 * estén apuntando al email principal de IT360: it360tecnologia@gmail.com
 * 
 * Este script revisa todos los archivos de API que envían emails
 * y confirma que estén configurados correctamente.
 */

const fs = require('fs');
const path = require('path');

// Email principal de IT360
const IT360_EMAIL = 'it360tecnologia@gmail.com';

// Archivos a verificar
const filesToCheck = [
  'app/api/contact/route.ts',
  'app/api/contacto-hogar/route.ts',
  'app/api/contacto-vendedor/route.ts',
  'app/api/checkout/route.ts',
  'app/api/admin/approve-transfer/route.ts',
  'app/api/tickets/route.ts'
];

console.log('🔍 Verificando configuraciones de email...\n');

let allCorrect = true;

filesToCheck.forEach(filePath => {
  console.log(`📁 Verificando: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar patrones de email
    const emailPatterns = [
      /to:\s*\[['"`]([^'"`]+)['"`]\]/g,
      /mailto:([^\s"`>]+)/g
    ];
    
    let foundEmails = [];
    
    emailPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        foundEmails.push(match[1]);
      }
    });
    
    // Filtrar solo emails válidos
    const validEmails = foundEmails.filter(email => 
      email.includes('@') && 
      !email.includes('${') && 
      !email.includes('encodeURIComponent')
    );
    
    if (validEmails.length === 0) {
      console.log('   ⚠️  No se encontraron emails estáticos para verificar');
    } else {
      validEmails.forEach(email => {
        if (email === IT360_EMAIL) {
          console.log(`   ✅ ${email} - CORRECTO`);
        } else {
          console.log(`   ❌ ${email} - DEBE SER ${IT360_EMAIL}`);
          allCorrect = false;
        }
      });
    }
    
  } catch (error) {
    console.log(`   ❌ Error al leer archivo: ${error.message}`);
    allCorrect = false;
  }
  
  console.log('');
});

// Verificar archivo .env.local
console.log('📁 Verificando archivo .env.local...');
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('RESEND_API_KEY')) {
      console.log('   ✅ RESEND_API_KEY encontrada en .env.local');
    } else {
      console.log('   ⚠️  RESEND_API_KEY no encontrada en .env.local');
    }
  } else {
    console.log('   ⚠️  Archivo .env.local no encontrado');
  }
} catch (error) {
  console.log(`   ❌ Error al verificar .env.local: ${error.message}`);
}

console.log('\n' + '='.repeat(60));

if (allCorrect) {
  console.log('🎉 ¡Todas las configuraciones de email están correctas!');
  console.log(`📧 Todos los emails se enviarán a: ${IT360_EMAIL}`);
} else {
  console.log('⚠️  Se encontraron configuraciones que necesitan corrección.');
  console.log(`📧 Asegúrate de que todos los emails apunten a: ${IT360_EMAIL}`);
}

console.log('\n📋 Resumen de funcionalidades que envían emails:');
console.log('   • Formulario de contacto general');
console.log('   • Formulario de Hogar Inteligente');
console.log('   • Consultas de productos (contacto vendedor)');
console.log('   • Solicitudes de compra (checkout)');
console.log('   • Aprobaciones/rechazos de transferencias');
console.log('   • Sistema de tickets unificado');

console.log('\n🚀 Para probar el envío de emails:');
console.log('   1. Asegúrate de tener RESEND_API_KEY configurada');
console.log('   2. Envía un formulario desde la página web');
console.log('   3. Verifica que llegue el email a it360tecnologia@gmail.com'); 