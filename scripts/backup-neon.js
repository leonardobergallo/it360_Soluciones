const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para hacer backup de Neon
async function backupNeonDatabase() {
  try {
    console.log('💾 Iniciando backup de la base de datos Neon...\n');
    
    // Obtener la URL de la base de datos desde las variables de entorno
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('❌ Error: DATABASE_URL no está configurada en las variables de entorno');
      console.log('💡 Asegúrate de que tu archivo .env tenga la URL de Neon');
      return;
    }

    // Crear directorio de backups si no existe
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log('📁 Creado directorio de backups');
    }

    // Generar nombre del archivo de backup con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `neon-backup-${timestamp}.sql`;
    const backupPath = path.join(backupDir, backupFileName);

    console.log(`📋 Archivo de backup: ${backupFileName}`);
    console.log(`📂 Ruta: ${backupPath}\n`);

    // Comando para hacer backup usando pg_dump
    const backupCommand = `pg_dump "${databaseUrl}" > "${backupPath}"`;

    console.log('🔄 Ejecutando backup...');
    console.log('⏳ Esto puede tomar unos minutos dependiendo del tamaño de la base de datos...\n');

    // Ejecutar el comando de backup
    exec(backupCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error durante el backup:', error.message);
        console.log('\n💡 Posibles soluciones:');
        console.log('   1. Instalar PostgreSQL client tools');
        console.log('   2. Verificar que DATABASE_URL sea correcta');
        console.log('   3. Verificar permisos de escritura en el directorio');
        return;
      }

      if (stderr) {
        console.log('⚠️ Advertencias durante el backup:', stderr);
      }

      // Verificar que el archivo se creó correctamente
      if (fs.existsSync(backupPath)) {
        const stats = fs.statSync(backupPath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log('✅ Backup completado exitosamente!');
        console.log(`📊 Tamaño del archivo: ${fileSizeInMB} MB`);
        console.log(`📁 Ubicación: ${backupPath}`);
        console.log('\n💡 Ahora puedes proceder con la migración de forma segura');
        console.log('🔧 Para restaurar: psql "DATABASE_URL" < "archivo-backup.sql"');
      } else {
        console.error('❌ Error: El archivo de backup no se creó');
      }
    });

  } catch (error) {
    console.error('❌ Error durante el backup:', error);
  }
}

// Función para listar backups existentes
function listBackups() {
  try {
    const backupDir = path.join(__dirname, '..', 'backups');
    
    if (!fs.existsSync(backupDir)) {
      console.log('📁 No existe directorio de backups');
      return;
    }

    const files = fs.readdirSync(backupDir);
    const backupFiles = files.filter(file => file.endsWith('.sql'));

    if (backupFiles.length === 0) {
      console.log('📁 No hay archivos de backup');
      return;
    }

    console.log('📋 Backups disponibles:');
    backupFiles.forEach((file, index) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      const date = stats.mtime.toLocaleString();
      
      console.log(`   ${index + 1}. ${file}`);
      console.log(`      📊 Tamaño: ${fileSizeInMB} MB`);
      console.log(`      📅 Fecha: ${date}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listando backups:', error);
  }
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--list') || args.includes('-l')) {
  listBackups();
} else {
  backupNeonDatabase();
} 