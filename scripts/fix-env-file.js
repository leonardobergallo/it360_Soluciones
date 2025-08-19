const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando archivo .env con codificación correcta...\n');

// Contenido completo del archivo .env
const envContent = `# Variables de entorno para IT360 Soluciones
# Copia este archivo como .env y ajusta según tu entorno

# Database - Neon PostgreSQL (se ajusta automáticamente según el entorno)
DATABASE_URL="postgresql://leonardobergallo:IT360_Soluciones@ep-cool-forest-a5qj8q8x-pooler.us-east-1.aws.neon.tech/it360_soluciones?sslmode=require"

# NextAuth - Autenticación (se ajusta automáticamente según el entorno)
NEXTAUTH_SECRET=it360-secret-key-2024-secure
NEXTAUTH_URL=https://it360-soluciones-git-main-leonardobergallos-projects.vercel.app

# Email - Resend (Principal)
RESEND_API_KEY=re_baToDEGC_BPFAstoq7djBp3XaDkvvKo
IT360_EMAIL=it360tecnologia@gmail.com

# Email - Gmail (Backup)
GMAIL_USER=it360tecnologia@gmail.com
GMAIL_PASS=tu-password-de-gmail

# MercadoPago - Configuración de pagos
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2de8db16-9d2b-49c4-80c5-f28020ce2244
MERCADOPAGO_PUBLIC_KEY=APP_USR-4993379468155901-052608-bd04452748d2b4cb04d557cd4203f1f4-125683753
MERCADOPAGO_CLIENT_ID=4993379468155901
MERCADOPAGO_CLIENT_SECRET=Z0dygqJTRxRBwOMvYmCprm7C1JqlGOLS

# Entorno (development/production)
NODE_ENV=development
`;

// Guardar archivo .env con codificación UTF-8
const envPath = path.join(process.cwd(), '.env');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Archivo .env arreglado correctamente');
  console.log('📁 Ubicación:', envPath);
  
  console.log('\n📋 Variables configuradas:');
  console.log('   • DATABASE_URL (Neon PostgreSQL)');
  console.log('   • NEXTAUTH_SECRET (Autenticación)');
  console.log('   • NEXTAUTH_URL (URL de la aplicación)');
  console.log('   • RESEND_API_KEY (Email principal)');
  console.log('   • IT360_EMAIL (Email de destino)');
  console.log('   • GMAIL_USER (Email backup)');
  console.log('   • MERCADOPAGO_* (Configuración de pagos)');
  console.log('   • NODE_ENV (Entorno)');
  
  console.log('\n🎉 ¡Archivo .env completo y funcional!');
  
} catch (error) {
  console.error('❌ Error arreglando .env:', error);
}
