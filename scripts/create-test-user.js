const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log('👤 Creando usuario de prueba...\n');

async function createTestUser() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@it360.com' }
    });

    if (existingUser) {
      console.log('⚠️ Usuario admin@it360.com ya existe');
      console.log('   📧 Email: admin@it360.com');
      console.log('   🔑 Contraseña: admin123');
      console.log('   🆔 ID:', existingUser.id);
      return;
    }

    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear usuario de prueba
    const testUser = await prisma.user.create({
      data: {
        email: 'admin@it360.com',
        password: hashedPassword,
        name: 'Administrador IT360',
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuario de prueba creado exitosamente');
    console.log('   📧 Email: admin@it360.com');
    console.log('   🔑 Contraseña: admin123');
    console.log('   👤 Nombre: Administrador IT360');
    console.log('   🆔 ID:', testUser.id);
    console.log('   🎭 Rol: ADMIN');

    console.log('\n💡 Ahora puedes:');
    console.log('   1. Ir a: http://localhost:3001/login');
    console.log('   2. Usar las credenciales: admin@it360.com / admin123');
    console.log('   3. Probar el flujo del carrito logueado');

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 