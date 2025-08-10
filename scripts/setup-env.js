import fs from 'fs';
import path from 'path';

const envContent = `# Database
DATABASE_URL="postgresql://leonardobergallo:IT360_Soluciones@ep-cool-forest-a5qj8q8x.us-east-1.aws.neon.tech/it360_soluciones?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

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
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📁 Ubicación:', envPath);
  console.log('\n🔑 Variables configuradas:');
  console.log('   • DATABASE_URL (Neon PostgreSQL)');
  console.log('   • RESEND_API_KEY (Email)');
  console.log('   • MERCADOPAGO_* (Pagos)');
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   • El archivo .env.local está en .gitignore por seguridad');
  console.log('   • Las credenciales no se subirán al repositorio');
  console.log('   • Para producción, configura las variables en tu hosting');
} catch (error) {
  console.error('❌ Error1 creando .env.local:', error);
} 