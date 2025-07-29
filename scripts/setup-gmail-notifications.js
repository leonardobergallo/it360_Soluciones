const fs = require('fs');
const path = require('path');

console.log('📧 Configurando notificaciones por Gmail...\n');

// Configuración para Gmail
const gmailConfig = `
# Configuración de Gmail para notificaciones
GMAIL_USER=tu-email@gmail.com
GMAIL_PASS=tu-contraseña-de-aplicacion
GMAIL_FROM=tu-email@gmail.com
GMAIL_TO=tu-email@gmail.com

# Configuración opcional de Resend (mantener si quieres usar ambos)
RESEND_API_KEY=re_123456789
`;

// Verificar si .env existe
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Archivo .env encontrado');
} else {
  console.log('📝 Creando archivo .env...');
}

// Agregar configuración de Gmail si no existe
if (!envContent.includes('GMAIL_USER')) {
  envContent += '\n' + gmailConfig;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Configuración de Gmail agregada al .env');
} else {
  console.log('ℹ️ Configuración de Gmail ya existe en .env');
}

console.log('\n📋 === INSTRUCCIONES PARA CONFIGURAR GMAIL ===');
console.log('1. Ve a tu cuenta de Gmail');
console.log('2. Activa la verificación en 2 pasos');
console.log('3. Ve a "Contraseñas de aplicación"');
console.log('4. Genera una contraseña para "IT360 Sistema"');
console.log('5. Copia esa contraseña y reemplaza "tu-contraseña-de-aplicacion" en .env');
console.log('6. Reemplaza "tu-email@gmail.com" con tu email real');
console.log('\n🔗 https://myaccount.google.com/apppasswords');

console.log('\n💡 === VENTAJAS DE USAR GMAIL ===');
console.log('✅ Recibes notificaciones inmediatas en tu email');
console.log('✅ Puedes responder directamente desde Gmail');
console.log('✅ Configuración simple y gratuita');
console.log('✅ Funciona con cualquier cliente de email');

console.log('\n⚠️ === IMPORTANTE ===');
console.log('• Usa contraseña de aplicación, NO tu contraseña normal');
console.log('• Límite: 500 emails/día con Gmail gratuito');
console.log('• Para producción, considera Resend o SendGrid'); 