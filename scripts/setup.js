#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando IT360...\n');

// Verificar si existe el archivo .env
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creando archivo .env...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Archivo .env creado desde env.example');
  } else {
    console.log('⚠️  No se encontró env.example. Crea manualmente el archivo .env');
  }
} else {
  console.log('✅ Archivo .env ya existe');
}

// Verificar si Prisma está instalado
try {
  console.log('\n🔍 Verificando Prisma...');
  execSync('npx prisma --version', { stdio: 'pipe' });
  console.log('✅ Prisma está instalado');
} catch (error) {
  console.log('❌ Prisma no está instalado. Ejecuta: npm install prisma @prisma/client');
  process.exit(1);
}

// Generar cliente de Prisma
try {
  console.log('\n🔧 Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente de Prisma generado');
} catch (error) {
  console.log('❌ Error generando cliente de Prisma');
  process.exit(1);
}

console.log('\n🎉 Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Configura tu base de datos PostgreSQL en el archivo .env');
console.log('2. Ejecuta: npx prisma migrate dev --name init');
console.log('3. Ejecuta: npm run dev');
console.log('4. Abre http://localhost:3000 en tu navegador'); 