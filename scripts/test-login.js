const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log('🔐 Probando sistema de login...\n');

async function testLogin() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');

    // Verificar que el usuario existe
    console.log('👤 Verificando usuario admin@it360.com...');
    const user = await prisma.user.findUnique({
      where: { email: 'admin@it360.com' }
    });

    if (!user) {
      console.log('❌ Usuario admin@it360.com no existe');
      console.log('💡 Ejecuta: npm run create-test-user');
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Nombre: ${user.name}`);
    console.log(`   🎭 Rol: ${user.role}`);
    console.log(`   🆔 ID: ${user.id}`);
    console.log(`   🔑 Password hash: ${user.password.substring(0, 20)}...`);

    // Probar la contraseña
    console.log('\n🔐 Probando contraseña...');
    const testPassword = 'admin123';
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    
    console.log(`   🔑 Contraseña a probar: ${testPassword}`);
    console.log(`   ✅ Contraseña válida: ${isValidPassword}`);

    if (isValidPassword) {
      console.log('\n🎉 ¡Las credenciales son correctas!');
      console.log('💡 El problema puede estar en:');
      console.log('   1. El frontend no está enviando los datos correctamente');
      console.log('   2. El API no está recibiendo los datos');
      console.log('   3. Hay un problema de CORS o headers');
    } else {
      console.log('\n❌ La contraseña no coincide');
      console.log('💡 Vamos a recrear el usuario con la contraseña correcta');
      
      // Recrear el usuario con la contraseña correcta
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.update({
        where: { email: 'admin@it360.com' },
        data: { password: hashedPassword }
      });
      
      console.log('✅ Usuario actualizado con nueva contraseña');
      console.log('💡 Ahora prueba el login nuevamente');
    }

    // Probar el API de login
    console.log('\n🌐 Probando API de login...');
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@it360.com',
          password: 'admin123'
        })
      });

      console.log(`📊 Status: ${response.status}`);
      console.log(`📊 Status Text: ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login exitoso:');
        console.log(JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        console.log('❌ Error en login:');
        console.log(errorText);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error.message);
      console.log('💡 Asegúrate de que el servidor esté corriendo: npm run dev');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 