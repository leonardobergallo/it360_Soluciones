const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 Configurando archivo .env...');
console.log('');

// Generar JWT secret seguro
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Plantilla del archivo .env
const envTemplate = `# Database - Reemplaza con tu URL de Neon
DATABASE_URL="postgresql://usuario:password@host:puerto/database?sslmode=require"

# JWT Secret - Generado automáticamente
JWT_SECRET="${jwtSecret}"

# Environment
NODE_ENV="development"

# Vercel (se configura automáticamente en producción)
VERCEL_ENV="development"
`;

// Verificar si ya existe .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  El archivo .env ya existe.');
  console.log('¿Quieres sobrescribirlo? (y/N): ');
  
  // En un script real, aquí leerías la respuesta del usuario
  // Por ahora, solo mostramos la información
  console.log('');
  console.log('📋 Contenido sugerido para .env:');
  console.log('=====================================');
  console.log(envTemplate);
  console.log('=====================================');
} else {
  // Crear el archivo .env
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Archivo .env creado exitosamente');
  console.log('');
  console.log('📋 Variables configuradas:');
  console.log('  - DATABASE_URL: [Necesitas configurar tu URL de Neon]');
  console.log('  - JWT_SECRET: Generado automáticamente');
  console.log('  - NODE_ENV: development');
  console.log('');
  console.log('🔗 Para obtener tu DATABASE_URL:');
  console.log('  1. Ve a https://console.neon.tech');
  console.log('  2. Selecciona tu proyecto');
  console.log('  3. Copia la "Connection String"');
  console.log('  4. Reemplaza en el archivo .env');
}

console.log('');
console.log('🚀 Próximos pasos:');
console.log('  1. Edita el archivo .env con tu DATABASE_URL de Neon');
console.log('  2. Ejecuta: npm run verify:env');
console.log('  3. Si todo está bien, ejecuta: npm run db:deploy'); 