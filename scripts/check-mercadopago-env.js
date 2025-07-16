require('dotenv').config();

console.log('🔍 Verificación de Variables de Entorno - Mercado Pago');
console.log('=====================================================');

const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!token) {
  console.log('❌ MERCADOPAGO_ACCESS_TOKEN: NO CONFIGURADO');
  console.log('\n🔧 Para configurar:');
  console.log('1. Ve a https://www.mercadopago.com.ar/developers/panel/credentials');
  console.log('2. Copia tu Access Token');
  console.log('3. Agrégalo a tu archivo .env:');
  console.log('   MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  process.exit(1);
}

console.log('✅ MERCADOPAGO_ACCESS_TOKEN: Configurado');

if (token.startsWith('TEST-')) {
  console.log('🔧 MODO: TEST (Desarrollo)');
  console.log('💡 Para producción, usa un token que comience con APP-');
} else if (token.startsWith('APP-')) {
  console.log('🚀 MODO: PRODUCCIÓN');
} else {
  console.log('⚠️  ADVERTENCIA: Formato de token inesperado');
  console.log('Los tokens deben comenzar con TEST- o APP-');
}

console.log('\n📋 Otras variables importantes:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'http://localhost:3000');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'No configurado');

console.log('\n🎉 Configuración básica verificada!');
console.log('Ahora puedes probar Mercado Pago en: http://localhost:3000/test-mercadopago'); 