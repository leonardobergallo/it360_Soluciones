import fs from 'fs';
import path from 'path';

console.log('🔧 Actualizando configuración de Vercel con nueva API key de Resend...\n');

// Nueva API key de Resend
const RESEND_API_KEY = 're_baToDEGC_BPFAstoq7djBp3XaDkvvKo';
const IT360_EMAIL = 'it360tecnologia@gmail.com';

// Configuración actualizada para Vercel
const vercelEnvContent = `# Variables de entorno para Vercel - CONFIGURACIÓN ACTUALIZADA
# Copia estas variables EXACTAMENTE como están a tu proyecto en Vercel Dashboard > Settings > Environment Variables

# Base de datos - Neon PostgreSQL (Pool de conexiones para Vercel)
DATABASE_URL=postgresql://leonardobergallo:IT360_Soluciones@ep-cool-forest-a5qj8x-pooler.us-east-1.aws.neon.tech/it360_soluciones?sslmode=require

# NextAuth - Autenticación
NEXTAUTH_SECRET=it360-secret-key-2024-secure
NEXTAUTH_URL=https://it360-soluciones-git-main-leonardobergallos-projects.vercel.app

# Email - Resend (ACTUALIZADO)
RESEND_API_KEY=${RESEND_API_KEY}
IT360_EMAIL=${IT360_EMAIL}

# Email - Gmail (Backup)
GMAIL_USER=${IT360_EMAIL}
GMAIL_PASS=tu-password-de-gmail

# MercadoPago - Configuración de pagos
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2de8db16-9d2b-49c4-80c5-f28020ce2244
MERCADOPAGO_PUBLIC_KEY=APP_USR-4993379468155901-052608-bd04452748d2b4cb04d557cd4203f1f4-125683753
MERCADOPAGO_CLIENT_ID=4993379468155901
MERCADOPAGO_CLIENT_SECRET=Z0dygqJTRxRBwOMvYmCprm7C1JqlGOLS

# Entorno
NODE_ENV=production

# INSTRUCCIONES PARA VERCEL:
# 1. Ve a https://vercel.com/dashboard
# 2. Haz clic en tu proyecto IT360_Soluciones
# 3. Ve a Settings > Environment Variables
# 4. Actualiza RESEND_API_KEY con: ${RESEND_API_KEY}
# 5. Actualiza IT360_EMAIL con: ${IT360_EMAIL}
# 6. Haz redeploy del proyecto
# 7. Los tickets ahora llegarán a ${IT360_EMAIL}

# IMPORTANTE:
# - La nueva API key de Resend está configurada
# - Todos los emails (tickets, presupuestos, contactos) llegarán a ${IT360_EMAIL}
# - Verifica que el dominio de Vercel en NEXTAUTH_URL sea correcto
`;

const vercelEnvPath = path.join(process.cwd(), 'vercel-env-actualizado.txt');

try {
  fs.writeFileSync(vercelEnvPath, vercelEnvContent);
  console.log('✅ Archivo vercel-env-actualizado.txt creado exitosamente');
  console.log('📁 Ubicación:', vercelEnvPath);
  
  console.log('\n📧 Configuración actualizada:');
  console.log(`   • RESEND_API_KEY: ${RESEND_API_KEY}`);
  console.log(`   • IT360_EMAIL: ${IT360_EMAIL}`);
  
  console.log('\n📋 INSTRUCCIONES PARA VERCEL:');
  console.log('1. Ve a https://vercel.com/dashboard');
  console.log('2. Haz clic en tu proyecto IT360_Soluciones');
  console.log('3. Ve a Settings > Environment Variables');
  console.log('4. Actualiza las siguientes variables:');
  console.log(`   • RESEND_API_KEY = ${RESEND_API_KEY}`);
  console.log(`   • IT360_EMAIL = ${IT360_EMAIL}`);
  console.log('5. Haz redeploy del proyecto');
  console.log('6. Los tickets ahora llegarán a it360tecnologia@gmail.com');
  
  console.log('\n⚠️  NOTAS IMPORTANTES:');
  console.log('   • Verifica que NEXTAUTH_URL tenga tu dominio correcto de Vercel');
  console.log('   • Asegúrate de que la base de datos Neon esté activa');
  console.log('   • Después del redeploy, prueba crear un ticket para verificar');
  
} catch (error) {
  console.error('❌ Error creando vercel-env-actualizado.txt:', error);
}
