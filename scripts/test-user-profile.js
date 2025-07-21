#!/usr/bin/env node

/**
 * Script para probar las APIs de perfil de usuario
 * Verifica que /api/users/me y /api/users/update funcionen correctamente
 */

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testUserProfile() {
  console.log('🧪 Probando APIs de perfil de usuario...\n');

  try {
    // 1. Buscar un usuario de prueba
    console.log('👤 1. Buscando usuario de prueba...');
    const testUser = await prisma.user.findFirst({
      where: { role: 'USER' }
    });

    if (!testUser) {
      console.log('   ❌ No se encontró usuario de prueba');
      console.log('   💡 Ejecuta: node scripts/seed.js para crear usuarios');
      return;
    }

    console.log(`   ✅ Usuario encontrado: ${testUser.name} (${testUser.email})`);

    // 2. Generar token JWT
    console.log('\n🔑 2. Generando token JWT...');
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024',
      { expiresIn: '1h' }
    );

    console.log(`   ✅ Token generado: ${token.substring(0, 50)}...`);

    // 3. Probar API /api/users/me
    console.log('\n📡 3. Probando GET /api/users/me...');
    
    const fetch = require('node-fetch');
    
    try {
      const meResponse = await fetch('http://localhost:3000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log('   ✅ GET /api/users/me - Exitoso');
        console.log(`   📋 Datos del usuario:`);
        console.log(`      Nombre: ${meData.user.name}`);
        console.log(`      Email: ${meData.user.email}`);
        console.log(`      Rol: ${meData.user.role}`);
      } else {
        console.log(`   ❌ GET /api/users/me - Error: ${meResponse.status}`);
        const errorData = await meResponse.text();
        console.log(`   📄 Error: ${errorData}`);
      }
    } catch (error) {
      console.log(`   ❌ GET /api/users/me - Error de conexión: ${error.message}`);
      console.log('   💡 Asegúrate de que el servidor esté corriendo: npm run dev');
    }

    // 4. Probar API /api/users/update
    console.log('\n📡 4. Probando PUT /api/users/update...');
    
    const updateData = {
      nombre: `${testUser.name} (Actualizado)`,
      email: testUser.email
    };

    try {
      const updateResponse = await fetch('http://localhost:3000/api/users/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        console.log('   ✅ PUT /api/users/update - Exitoso');
        console.log(`   📋 Usuario actualizado:`);
        console.log(`      Nombre: ${updateResult.user.name}`);
        console.log(`      Email: ${updateResult.user.email}`);
        console.log(`      Mensaje: ${updateResult.message}`);
      } else {
        console.log(`   ❌ PUT /api/users/update - Error: ${updateResponse.status}`);
        const errorData = await updateResponse.text();
        console.log(`   📄 Error: ${errorData}`);
      }
    } catch (error) {
      console.log(`   ❌ PUT /api/users/update - Error de conexión: ${error.message}`);
    }

    // 5. Probar sin token (debería fallar)
    console.log('\n🚫 5. Probando sin token (debería fallar)...');
    
    try {
      const noAuthResponse = await fetch('http://localhost:3000/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (noAuthResponse.status === 401) {
        console.log('   ✅ Sin token - Respuesta 401 correcta');
      } else {
        console.log(`   ❌ Sin token - Respuesta inesperada: ${noAuthResponse.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Sin token - Error de conexión: ${error.message}`);
    }

    // 6. Restaurar datos originales
    console.log('\n🔄 6. Restaurando datos originales...');
    
    try {
      await prisma.user.update({
        where: { id: testUser.id },
        data: { name: testUser.name }
      });
      console.log('   ✅ Datos restaurados correctamente');
    } catch (error) {
      console.log(`   ❌ Error restaurando datos: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n============================================================');
  console.log('📋 RESUMEN DE PRUEBAS');
  console.log('============================================================');
  console.log('🎯 Si todas las pruebas pasan:');
  console.log('   • Las APIs de perfil funcionan correctamente');
  console.log('   • La página "Mis datos" debería cargar sin errores');
  console.log('   • Se pueden actualizar nombre y email');
  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('   • npm run dev - Iniciar servidor');
  console.log('   • Ir a /mi-cuenta/mis-datos');
  console.log('   • Verificar que se carguen los datos correctamente');
  console.log('   • Probar actualizar información');
}

testUserProfile(); 