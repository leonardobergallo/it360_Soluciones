import fs from 'fs';
import path from 'path';

const vercelEnvContent = `# Variables de entorno para Vercel
# Copia estas variables a tu proyecto en Vercel Dashboard > Settings > Environment Variables

# Database
DATABASE_URL="postgresql://leonardobergallo:IT360_Soluciones@ep-cool-forest-a5qj8q8x.us-east-1.aws.neon.tech/it360_soluciones?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="https://tu-dominio-vercel.vercel.app"

# Email - Resend
RESEND_API_KEY="re_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k"
IT360_EMAIL="it360tecnologia@gmail.com"

# Email - Gmail (backup)
GMAIL_USER="it360tecnologia@gmail.com"
GMAIL_PASS="tu-password-de-gmail"

# MercadoPago - Producción
MERCADOPAGO_ACCESS_TOKEN="APP_USR-2de8db16-9d2b-49c4-80c5-f28020ce2244"
MERCADOPAGO_PUBLIC_KEY="APP_USR-4993379468155901-052608-bd04452748d2b4cb04d557cd4203f1f4-125683753"
MERCADOPAGO_CLIENT_ID="4993379468155901"
MERCADOPAGO_CLIENT_SECRET="Z0dygqJTRxRBwOMvYmCprm7C1JqlGOLS"

# Entorno
NODE_ENV="production"
`;

const vercelEnvPath = path.join(process.cwd(), 'vercel-env.txt');

try {
  fs.writeFileSync(vercelEnvPath, vercelEnvContent);
  console.log('✅ Archivo vercel-env.txt creado exitosamente');
  console.log('📁 Ubicación:', vercelEnvPath);
  console.log('\n📋 INSTRUCCIONES PARA VERCEL:');
  console.log('1. Ve a tu proyecto en Vercel Dashboard');
  console.log('2. Ve a Settings > Environment Variables');
  console.log('3. Copia cada variable del archivo vercel-env.txt');
  console.log('4. IMPORTANTE: Cambia NEXTAUTH_URL por tu dominio real de Vercel');
  console.log('5. Haz redeploy del proyecto');
  console.log('\n⚠️  NOTAS:');
  console.log('   • NEXTAUTH_URL debe ser tu dominio real (ej: https://tu-app.vercel.app)');
  console.log('   • Asegúrate de que la base de datos Neon esté activa');
  console.log('   • Verifica que los productos estén en la base de datos');
  console.log('\n🔗 Comandos útiles:');
  console.log('   • npm run verify-vercel (para verificar configuración)');
  console.log('   • npm run seed-products (para agregar productos de prueba)');
} catch (error) {
  console.error('❌ Error creando vercel-env.txt:', error);
}
