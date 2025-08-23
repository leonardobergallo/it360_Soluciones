const fs = require('fs');
const path = require('path');

console.log('🔧 Actualizando configuración de Resend para IT360...\n');

// Nueva API key de Resend
const RESEND_API_KEY = 're_baToDEGC_BPFAstoq7djBp3XaDkvvKo';
const IT360_EMAIL = 'it360tecnologia@gmail.com';

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creando archivo .env.local...');
}

// Leer contenido actual o crear nuevo
let envContent = envExists ? fs.readFileSync(envPath, 'utf8') : '';

// Configuración a actualizar/agregar
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
    console.log(`✅ ${key} actualizado`);
  } else {
    // Agregar si no existe
    envContent += (envContent ? '\n' : '') + line;
    console.log(`✅ ${key} agregado`);
  }
});

// Guardar archivo
fs.writeFileSync(envPath, envContent);

console.log('\n📧 Configuración actualizada:');
console.log(`   • RESEND_API_KEY: ${RESEND_API_KEY}`);
console.log(`   • IT360_EMAIL: ${IT360_EMAIL}`);
console.log('\n✅ Archivo .env.local actualizado correctamente');
console.log('\n🔄 Reinicia el servidor de desarrollo para aplicar los cambios');
console.log('   npm run dev');
