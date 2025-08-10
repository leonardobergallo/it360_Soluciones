const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando Resend para IT360...\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

let envContent = '';

if (envExists) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Archivo .env.local encontrado');
} else {
  console.log('📝 Creando archivo .env.local...');
}

// Configuración de Resend
const resendConfig = `
# Configuración de Resend para emails
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email de destino para todas las notificaciones
IT360_EMAIL=it360tecnologia@gmail.com

# Configuración de la aplicación
NEXTAUTH_SECRET=tu-secret-key-aqui
NEXTAUTH_URL=http://localhost:3000

# Base de datos (mantener tu configuración actual)
DATABASE_URL="postgresql://..."

# MercadoPago (si lo usas)
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_PUBLIC_KEY=...
`;

// Actualizar o crear .env.local
if (!envContent.includes('RESEND_API_KEY')) {
  const newContent = envExists ? envContent + '\n' + resendConfig : resendConfig;
  fs.writeFileSync(envPath, newContent);
  console.log('✅ Configuración de Resend agregada a .env.local');
} else {
  console.log('⚠️  RESEND_API_KEY ya existe en .env.local');
}

console.log('\n📧 Configuración de emails:');
console.log('   • Email de destino: it360tecnologia@gmail.com');
console.log('   • Servicio: Resend');
console.log('   • API Key: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (reemplazar con tu key real)');

console.log('\n🔑 Pasos para completar la configuración:');
console.log('   1. Ve a https://resend.com');
console.log('   2. Crea una cuenta o inicia sesión');
console.log('   3. Ve a API Keys y crea una nueva');
console.log('   4. Copia la key (empieza con re_)');
console.log('   5. Reemplaza re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx en .env.local');
console.log('   6. Ejecuta: node scripts/test-email-notifications.js');

console.log('\n🎯 Emails que se enviarán automáticamente:');
console.log('   • Nuevos tickets → it360tecnologia@gmail.com');
console.log('   • Nuevos presupuestos → it360tecnologia@gmail.com');
console.log('   • Nuevas consultas → it360tecnologia@gmail.com');
console.log('   • Nuevas ventas → it360tecnologia@gmail.com');

console.log('\n✅ Configuración completada!'); 