const fs = require('fs');
const path = require('path');

// Contenido del archivo .env.local
const envContent = `# Base de datos Neon (PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_FiT5rOa7pPWI@ep-bitter-shadow-aeolqdvv-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth (para autenticación)
NEXTAUTH_SECRET="it360-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"

# Resend (para emails)
RESEND_API_KEY="re_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k"
IT360_EMAIL="leonardobergallo@gmail.com"
`;

// Crear el archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📁 Ubicación:', envPath);
  console.log('🔗 Base de datos configurada para usar Neon (PostgreSQL)');
  console.log('📧 Resend configurado para emails');
} catch (error) {
  console.error('❌ Error creando el archivo .env.local:', error.message);
}
