const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando SQLite local y migrando datos desde Neon...\n');

try {
  // 1. Crear backup del schema original
  console.log('📋 1. Creando backup del schema original...');
  if (fs.existsSync('./prisma/schema.prisma')) {
    fs.copyFileSync('./prisma/schema.prisma', './prisma/schema-postgresql.prisma');
    console.log('   ✅ Backup creado: schema-postgresql.prisma');
  }

  // 2. Copiar schema SQLite
  console.log('📋 2. Configurando schema SQLite...');
  if (fs.existsSync('./prisma/schema-sqlite.prisma')) {
    fs.copyFileSync('./prisma/schema-sqlite.prisma', './prisma/schema.prisma');
    console.log('   ✅ Schema SQLite configurado');
  }

  // 3. Generar cliente Prisma para SQLite
  console.log('📋 3. Generando cliente Prisma para SQLite...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('   ✅ Cliente Prisma generado');

  // 4. Crear base de datos SQLite
  console.log('📋 4. Creando base de datos SQLite...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('   ✅ Base de datos SQLite creada');

  // 5. Ejecutar migración de datos desde Neon
  console.log('📋 5. Migrando datos desde Neon...');
  console.log('   ⚠️  Asegúrate de que DATABASE_URL en .env apunte a Neon');
  
  // Ejecutar script de migración
  execSync('node scripts/migrate-neon-to-sqlite.js', { stdio: 'inherit' });

  console.log('\n🎉 ¡Configuración completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Cambia DATABASE_URL en .env a: file:./dev.db');
  console.log('2. Reinicia el servidor: npm run dev');
  console.log('3. Para volver a Neon: copia schema-postgresql.prisma a schema.prisma');
  console.log('4. Para usar SQLite: copia schema-sqlite.prisma a schema.prisma');

} catch (error) {
  console.error('❌ Error durante la configuración:', error);
  
  // Restaurar schema original en caso de error
  if (fs.existsSync('./prisma/schema-postgresql.prisma')) {
    fs.copyFileSync('./prisma/schema-postgresql.prisma', './prisma/schema.prisma');
    console.log('🔄 Schema original restaurado');
  }
} 