#!/usr/bin/env node

/**
 * Script para configurar las variables de entorno necesarias
 * para el sistema de pagos y gestión de tarjetas
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando variables de entorno para el sistema de pagos...\n');

// Contenido del archivo .env.local
const envContent = `# Base de datos
DATABASE_URL="file:./dev.db"

# JWT y autenticación
JWT_SECRET="it360-super-secret-jwt-key-2024"
NEXTAUTH_SECRET="it360-super-secret-nextauth-key-2024"

# Resend para envío de emails
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# MercadoPago (opcional - configurar cuando tengas las credenciales)
MERCADOPAGO_ACCESS_TOKEN=""

# URL de la aplicación
NEXTAUTH_URL="http://localhost:3000"

# Configuración adicional
NODE_ENV="development"
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  // Verificar si ya existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env.local ya existe');
    console.log('📝 Contenido actual:');
    console.log(fs.readFileSync(envPath, 'utf8'));
    console.log('\n💡 Para actualizar, edita manualmente el archivo .env.local');
  } else {
    // Crear el archivo
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env.local creado exitosamente');
  }
} catch (error) {
  console.log('❌ Error al crear .env.local:', error.message);
  console.log('\n📝 Crea manualmente el archivo .env.local con este contenido:');
  console.log('='.repeat(50));
  console.log(envContent);
  console.log('='.repeat(50));
}

console.log('\n📋 Variables necesarias para el sistema de pagos:');
console.log('• DATABASE_URL - URL de la base de datos');
console.log('• JWT_SECRET - Clave secreta para JWT');
console.log('• NEXTAUTH_SECRET - Clave secreta para NextAuth');
console.log('• RESEND_API_KEY - API key de Resend para emails');
console.log('• MERCADOPAGO_ACCESS_TOKEN - Token de MercadoPago (opcional)');
console.log('• NEXTAUTH_URL - URL de la aplicación');

console.log('\n🚀 Pasos para completar la configuración:');
console.log('1. Edita el archivo .env.local');
console.log('2. Configura RESEND_API_KEY con tu clave de Resend');
console.log('3. Opcional: Configura MERCADOPAGO_ACCESS_TOKEN');
console.log('4. Reinicia el servidor: npm run dev');

console.log('\n🔗 Enlaces útiles:');
console.log('• Resend: https://resend.com');
console.log('• MercadoPago: https://www.mercadopago.com.ar/developers');

console.log('\n📧 Notificaciones:');
console.log('• Todos los emails se enviarán a: it360tecnologia@gmail.com'); 