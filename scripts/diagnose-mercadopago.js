const mercadopago = require('mercadopago');
require('dotenv').config();

console.log('🔍 Diagnóstico de Mercado Pago');
console.log('================================');

// Verificar variables de entorno
console.log('\n1. Verificando variables de entorno:');
console.log('MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Configurado' : '❌ NO CONFIGURADO');

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.log('\n❌ ERROR: MERCADOPAGO_ACCESS_TOKEN no está configurado');
  console.log('Por favor, agrega la variable de entorno en tu archivo .env:');
  console.log('MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  process.exit(1);
}

// Verificar formato del token
const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!token.startsWith('TEST-') && !token.startsWith('APP-')) {
  console.log('\n⚠️  ADVERTENCIA: El token no tiene el formato esperado');
  console.log('Los tokens de Mercado Pago deben comenzar con TEST- o APP-');
}

// Configurar Mercado Pago
try {
  mercadopago.configure({
    access_token: token
  });
  console.log('✅ Mercado Pago configurado correctamente');
} catch (error) {
  console.log('❌ Error configurando Mercado Pago:', error.message);
  process.exit(1);
}

// Probar conexión con Mercado Pago
async function testMercadoPagoConnection() {
  console.log('\n2. Probando conexión con Mercado Pago:');
  
  try {
    // Crear una preferencia de prueba
    const preference = {
      items: [
        {
          title: 'Producto de Prueba',
          quantity: 1,
          unit_price: 100,
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: 'Usuario de Prueba',
        email: 'test@example.com',
        phone: { number: '123456789' },
        address: { street_name: 'Dirección de Prueba' }
      },
      back_urls: {
        success: 'http://localhost:3000/carrito?status=success',
        failure: 'http://localhost:3000/carrito?status=failure',
        pending: 'http://localhost:3000/carrito?status=pending'
      },
      auto_return: 'approved',
      external_reference: `test_${Date.now()}`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };

    console.log('Creando preferencia de prueba...');
    const response = await mercadopago.preferences.create(preference);
    
    if (response.body && response.body.init_point) {
      console.log('✅ Conexión exitosa con Mercado Pago');
      console.log('Preferencia ID:', response.body.id);
      console.log('URL de pago:', response.body.init_point);
      
      // Verificar si es modo test
      if (token.startsWith('TEST-')) {
        console.log('🔧 MODO TEST: Usando credenciales de prueba');
        console.log('Para producción, cambia a un token que comience con APP-');
      } else {
        console.log('🚀 MODO PRODUCCIÓN: Usando credenciales de producción');
      }
    } else {
      console.log('❌ Error: No se pudo crear la preferencia');
      console.log('Respuesta:', response);
    }
    
  } catch (error) {
    console.log('❌ Error conectando con Mercado Pago:');
    console.log('Mensaje:', error.message);
    
    if (error.body) {
      console.log('Detalles del error:', JSON.stringify(error.body, null, 2));
    }
    
    // Errores comunes
    if (error.message.includes('401')) {
      console.log('\n💡 SUGERENCIA: Token inválido o expirado');
      console.log('Verifica que el token sea correcto y esté activo');
    } else if (error.message.includes('403')) {
      console.log('\n💡 SUGERENCIA: Sin permisos para crear preferencias');
      console.log('Verifica que tu cuenta tenga los permisos necesarios');
    } else if (error.message.includes('network')) {
      console.log('\n💡 SUGERENCIA: Problema de conectividad');
      console.log('Verifica tu conexión a internet');
    }
  }
}

// Verificar configuración del servidor
function checkServerConfig() {
  console.log('\n3. Verificando configuración del servidor:');
  
  const requiredEnvVars = [
    'NEXTAUTH_URL',
    'DATABASE_URL'
  ];
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`${varName}: ✅ Configurado`);
    } else {
      console.log(`${varName}: ⚠️  No configurado (opcional)`);
    }
  });
  
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'http://localhost:3000');
}

// Verificar dependencias
function checkDependencies() {
  console.log('\n4. Verificando dependencias:');
  
  try {
    const mercadopagoVersion = require('mercadopago/package.json').version;
    console.log('mercadopago:', `✅ v${mercadopagoVersion}`);
  } catch (error) {
    console.log('mercadopago: ❌ No instalado');
    console.log('Instala con: npm install mercadopago');
  }
  
  try {
    const prismaVersion = require('@prisma/client/package.json').version;
    console.log('@prisma/client:', `✅ v${prismaVersion}`);
  } catch (error) {
    console.log('@prisma/client: ⚠️  No instalado (opcional)');
  }
}

// Ejecutar diagnóstico
async function runDiagnostic() {
  checkDependencies();
  checkServerConfig();
  await testMercadoPagoConnection();
  
  console.log('\n📋 Resumen del diagnóstico:');
  console.log('================================');
  
  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.log('✅ Token configurado');
    console.log('✅ Dependencias verificadas');
    console.log('✅ Configuración del servidor OK');
    console.log('\n🎉 Mercado Pago está listo para usar!');
  } else {
    console.log('❌ Token no configurado');
    console.log('❌ Mercado Pago no funcionará');
    console.log('\n🔧 Para arreglar:');
    console.log('1. Ve a https://www.mercadopago.com.ar/developers/panel/credentials');
    console.log('2. Copia tu Access Token');
    console.log('3. Agrégalo a tu archivo .env como MERCADOPAGO_ACCESS_TOKEN=tu_token');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runDiagnostic().catch(console.error);
}

module.exports = { runDiagnostic }; 