const fs = require('fs');
const path = require('path');

// Leer el archivo .env.local actual
const envPath = path.join(__dirname, '..', '.env.local');

try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Actualizar el email de IT360 a la casilla de Resend
  envContent = envContent.replace(
    /IT360_EMAIL="[^"]*"/,
    'IT360_EMAIL="leonardobergallo@gmail.com"'
  );
  
  // Escribir el archivo actualizado
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Email de IT360 actualizado exitosamente');
  console.log('📧 Nuevo email: leonardobergallo@gmail.com (casilla de Resend)');
  console.log('📁 Archivo actualizado:', envPath);
  
} catch (error) {
  console.error('❌ Error actualizando el email:', error.message);
}
