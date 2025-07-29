const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando entorno para SQLite local...\n');

try {
  // Verificar si existe el archivo .env
  const envPath = path.join(__dirname, '../.env');
  
  if (fs.existsSync(envPath)) {
    console.log('📋 Archivo .env encontrado, actualizando DATABASE_URL...');
    
    // Leer el archivo .env actual
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Reemplazar o agregar DATABASE_URL para SQLite
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/g,
        'DATABASE_URL="file:./dev.db"'
      );
    } else {
      envContent += '\n# Base de datos SQLite local\nDATABASE_URL="file:./dev.db"\n';
    }
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, envContent);
    console.log('   ✅ DATABASE_URL actualizado a SQLite');
    
  } else {
    console.log('📋 Creando archivo .env con configuración SQLite...');
    
    const envContent = `# Base de datos SQLite local
DATABASE_URL="file:./dev.db"

# Configuración de JWT
JWT_SECRET="tu-secreto-jwt-super-seguro-aqui"

# Configuración de Resend (email)
RESEND_API_KEY="tu-api-key-de-resend"

# Configuración de MercadoPago
MERCADOPAGO_ACCESS_TOKEN="tu-access-token-de-mercadopago"
MERCADOPAGO_PUBLIC_KEY="tu-public-key-de-mercadopago"

# Configuración de Next.js
NEXTAUTH_SECRET="tu-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Variables de entorno adicionales
NODE_ENV="development"
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('   ✅ Archivo .env creado con configuración SQLite');
  }
  
  console.log('\n🎉 ¡Configuración completada!');
  console.log('📋 Próximos pasos:');
  console.log('1. Reinicia el servidor: npm run dev');
  console.log('2. Tu base de datos SQLite está lista en: ./dev.db');
  console.log('3. Para volver a Neon: cambia DATABASE_URL en .env');
  
} catch (error) {
  console.error('❌ Error durante la configuración:', error);
} 