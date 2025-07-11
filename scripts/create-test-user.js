const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Verificar si ya existe un usuario de prueba
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@it360.com' }
    });

    if (existingUser) {
      console.log('✅ Usuario de prueba ya existe');
      return existingUser;
    }

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@it360.com',
        password: hashedPassword,
        name: 'Usuario de Prueba',
        role: 'USER'
      }
    });

    console.log('✅ Usuario de prueba creado:', user.email);
    return user;
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTestUser()
    .then(() => {
      console.log('🎉 Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { createTestUser }; 