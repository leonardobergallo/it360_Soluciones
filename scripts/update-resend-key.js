const fs = require('fs');
const path = require('path');

console.log('🔧 Actualizando API key de Resend...\n');

// API key real del usuario
const RESEND_API_KEY = 're_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k';

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ Archivo .env.local no encontrado');
  console.log('💡 Ejecuta primero: node scripts/setup-resend-config.js');
  return;
}

// Leer contenido actual
let envContent = fs.readFileSync(envPath, 'utf8');

// Actualizar la API key
if (envContent.includes('RESEND_API_KEY=')) {
  // Reemplazar la key existente
  envContent = envContent.replace(
    /RESEND_API_KEY=.*/,
    `RESEND_API_KEY=${RESEND_API_KEY}`
  );
  console.log('✅ API key de Resend actualizada');
} else {
  // Agregar la key si no existe
  envContent += `\nRESEND_API_KEY=${RESEND_API_KEY}\n`;
  console.log('✅ API key de Resend agregada');
}

// Asegurar que IT360_EMAIL esté configurado
if (!envContent.includes('IT360_EMAIL=')) {
  envContent += `IT360_EMAIL=it360tecnologia@gmail.com\n`;
  console.log('✅ Email de destino configurado');
}

// Guardar archivo actualizado
fs.writeFileSync(envPath, envContent);

console.log('\n📧 Configuración actualizada:');
console.log(`   • API Key: ${RESEND_API_KEY.substring(0, 10)}...`);
console.log(`   • Email destino: it360tecnologia@gmail.com`);
console.log(`   • Servicio: Resend`);

console.log('\n🧪 Para probar el envío de emails:');
console.log('   node scripts/test-resend-emails.js');

console.log('\n✅ ¡Configuración completada!');
console.log('📧 Los emails ahora se enviarán automáticamente a it360tecnologia@gmail.com'); 