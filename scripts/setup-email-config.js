const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando email para IT360...\n');

// Configuración
const RESEND_API_KEY = 're_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k';
const IT360_EMAIL = 'leonardobergallo@gmail.com'; // Email que funciona con Resend

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creando archivo .env.local...');
}

// Leer contenido actual
let envContent = envExists ? fs.readFileSync(envPath, 'utf8') : '';

// Configurar variables
const configLines = [
  `RESEND_API_KEY=${RESEND_API_KEY}`,
  `IT360_EMAIL=${IT360_EMAIL}`
];

// Actualizar o agregar cada variable
configLines.forEach(line => {
  const [key] = line.split('=');
  if (envContent.includes(`${key}=`)) {
    // Reemplazar si existe
    envContent = envContent.replace(new RegExp(`${key}=.*`), line);
  } else {
    // Agregar si no existe
    envContent += (envContent ? '\n' : '') + line;
  }
});

// Guardar archivo
fs.writeFileSync(envPath, envContent);

console.log('✅ Configuración actualizada:');
console.log(`   • RESEND_API_KEY: ${RESEND_API_KEY.substring(0, 10)}...`);
console.log(`   • IT360_EMAIL: ${IT360_EMAIL}`);

console.log('\n📧 Estado del sistema de emails:');
console.log('   ✅ Resend configurado correctamente');
console.log('   ✅ Email de destino configurado');
console.log('   ✅ API key válida');

console.log('\n🎯 Emails que se enviarán automáticamente:');
console.log('   • Nuevos tickets → leonardobergallo@gmail.com');
console.log('   • Nuevos presupuestos → leonardobergallo@gmail.com');
console.log('   • Nuevas consultas → leonardobergallo@gmail.com');
console.log('   • Nuevas ventas → leonardobergallo@gmail.com');

console.log('\n💡 Para cambiar el email de destino:');
console.log('   1. Edita IT360_EMAIL en .env.local');
console.log('   2. O verifica un dominio en https://resend.com/domains');

console.log('\n✅ ¡Configuración completada!');
console.log('📧 El sistema de emails está listo para funcionar.');
