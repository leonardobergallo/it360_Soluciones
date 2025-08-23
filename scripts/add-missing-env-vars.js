const fs = require('fs');
const path = require('path');

console.log('🔧 Agregando variables faltantes al archivo .env...\n');

// Verificar si existe .env
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ Archivo .env no encontrado');
  return;
}

// Leer contenido actual
let envContent = fs.readFileSync(envPath, 'utf8');

// Variables que necesitamos agregar
const missingVars = [
  '',
  '# Variables de entorno para IT360 Soluciones',
  '# Copia este archivo como .env y ajusta según tu entorno',
  '',
  '# NextAuth - Autenticación (se ajusta automáticamente según el entorno)',
  'NEXTAUTH_SECRET=it360-secret-key-2024-secure',
  'NEXTAUTH_URL=https://it360-soluciones-git-main-leonardobergallos-projects.vercel.app',
  '',
  '# Email - Resend (Principal)',
  'RESEND_API_KEY=re_baToDEGC_BPFAstoq7djBp3XaDkvvKo',
  'IT360_EMAIL=it360tecnologia@gmail.com',
  '',
  '# Email - Gmail (Backup)',
  'GMAIL_USER=it360tecnologia@gmail.com',
  'GMAIL_PASS=tu-password-de-gmail',
  '',
  '# MercadoPago - Configuración de pagos',
  'MERCADOPAGO_ACCESS_TOKEN=APP_USR-2de8db16-9d2b-49c4-80c5-f28020ce2244',
  'MERCADOPAGO_PUBLIC_KEY=APP_USR-4993379468155901-052608-bd04452748d2b4cb04d557cd4203f1f4-125683753',
  'MERCADOPAGO_CLIENT_ID=4993379468155901',
  'MERCADOPAGO_CLIENT_SECRET=Z0dygqJTRxRBwOMvYmCprm7C1JqlGOLS',
  '',
  '# Entorno (development/production)',
  'NODE_ENV=development'
];

// Agregar variables faltantes
let addedCount = 0;
missingVars.forEach(line => {
  if (line.startsWith('#')) {
    // Agregar comentarios
    envContent += '\n' + line;
    addedCount++;
  } else if (line.trim() === '') {
    // Agregar líneas vacías
    envContent += '\n';
  } else {
    // Verificar si la variable ya existe
    const [key] = line.split('=');
    if (!envContent.includes(`${key}=`)) {
      envContent += '\n' + line;
      addedCount++;
      console.log(`✅ Agregada: ${key}`);
    } else {
      console.log(`ℹ️  Ya existe: ${key}`);
    }
  }
});

// Guardar archivo actualizado
fs.writeFileSync(envPath, envContent);

console.log(`\n📊 Resumen:`);
console.log(`   • Variables agregadas: ${addedCount}`);
console.log(`   • Variables existentes: mantenidas`);
console.log(`\n✅ Archivo .env actualizado correctamente`);
console.log(`📁 Ubicación: ${envPath}`);
