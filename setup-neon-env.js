const fs = require('fs');
const path = require('path');

// Contenido del archivo .env
const envContent = `# Base de datos Neon (PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_FiT5rOa7pPWI@ep-bitter-shadow-aeolqdvv-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth (para autenticación)
NEXTAUTH_SECRET="it360-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"

# Resend (para emails - opcional)
# RESEND_API_KEY="tu_api_key_de_resend"
`;

// Crear el archivo .env
const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado exitosamente');
  console.log('📁 Ubicación:', envPath);
  console.log('🔗 Base de datos configurada para usar Neon (PostgreSQL)');
} catch (error) {
  console.error('❌ Error creando el archivo .env:', error.message);
} 