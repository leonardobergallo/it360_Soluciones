const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function switchAndMigrate() {
  console.log('🚀 Iniciando migración con cambio de schema...');
  
  try {
    // 1. Hacer backup del schema actual
    console.log('📋 Haciendo backup del schema actual...');
    fs.copyFileSync('./prisma/schema.prisma', './prisma/schema-backup.prisma');
    
    // 2. Cambiar al schema de SQLite
    console.log('🔄 Cambiando a schema de SQLite...');
    fs.copyFileSync('./prisma/schema-sqlite.prisma', './prisma/schema.prisma');
    
    // 3. Generar cliente para SQLite
    console.log('🔧 Generando cliente para SQLite...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // 4. Ejecutar migración
    console.log('📊 Ejecutando migración...');
    execSync('node scripts/migrate-to-neon.js', { stdio: 'inherit' });
    
    // 5. Restaurar schema de PostgreSQL
    console.log('🔄 Restaurando schema de PostgreSQL...');
    fs.copyFileSync('./prisma/schema-backup.prisma', './prisma/schema.prisma');
    
    // 6. Generar cliente para PostgreSQL
    console.log('🔧 Generando cliente para PostgreSQL...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // 7. Limpiar archivo de backup
    fs.unlinkSync('./prisma/schema-backup.prisma');
    
    console.log('🎉 ¡Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    
    // Restaurar schema en caso de error
    if (fs.existsSync('./prisma/schema-backup.prisma')) {
      console.log('🔄 Restaurando schema en caso de error...');
      fs.copyFileSync('./prisma/schema-backup.prisma', './prisma/schema.prisma');
      execSync('npx prisma generate', { stdio: 'inherit' });
      fs.unlinkSync('./prisma/schema-backup.prisma');
    }
    
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  switchAndMigrate()
    .then(() => {
      console.log('🎉 Proceso finalizado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { switchAndMigrate }; 