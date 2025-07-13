const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Creando usuario administrador...');

    // Verificar si ya existe un usuario admin
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@it360.com' }
    });

    if (existingAdmin) {
      console.log('⚠️ El usuario admin ya existe');
      console.log('📧 Email: admin@it360.com');
      console.log('🔑 Contraseña: admin123');
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Crear usuario administrador
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador IT360',
        email: 'admin@it360.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('📧 Email: admin@it360.com');
    console.log('🔑 Contraseña: admin123');
    console.log('👤 Nombre:', adminUser.name);
    console.log('🔐 Rol:', adminUser.role);

  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 