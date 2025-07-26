const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Crear una instancia de Prisma Client
const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('👥 Creando usuarios de prueba...\n');
    
    // Lista de usuarios de prueba
    const testUsers = [
      {
        name: 'María González',
        email: 'maria@it360.com',
        password: 'maria123',
        role: 'TECNICO'
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@it360.com',
        password: 'carlos123',
        role: 'TECNICO'
      },
      {
        name: 'Ana Martínez',
        email: 'ana@cliente.com',
        password: 'ana123',
        role: 'USER'
      },
      {
        name: 'Luis Fernández',
        email: 'luis@empresa.com',
        password: 'luis123',
        role: 'USER'
      },
      {
        name: 'Patricia López',
        email: 'patricia@consultora.com',
        password: 'patricia123',
        role: 'USER'
      },
      {
        name: 'Roberto Silva',
        email: 'roberto@nuevo.com',
        password: 'roberto123',
        role: 'USER'
      }
    ];

    let createdCount = 0;
    let errorCount = 0;

    // Crear cada usuario
    for (const userData of testUsers) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email }
        });

        if (existingUser) {
          console.log(`⚠️ Usuario ya existe: ${userData.email}`);
          continue;
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Crear el usuario
        const newUser = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role
          }
        });

        createdCount++;
        console.log(`✅ Creado usuario: ${userData.name} (${userData.email}) - Rol: ${userData.role}`);
        console.log(`   🔑 Contraseña: ${userData.password}`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de creación de usuarios:');
    console.log(`   ✅ Creados exitosamente: ${createdCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total procesados: ${testUsers.length}`);

    if (createdCount > 0) {
      console.log('\n🎉 Usuarios de prueba creados exitosamente!');
      console.log('\n📋 Credenciales de acceso:');
      console.log('='.repeat(50));
      
      testUsers.forEach(user => {
        console.log(`👤 ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Contraseña: ${user.password}`);
        console.log(`   🔐 Rol: ${user.role}`);
        console.log('');
      });
      
      console.log('💡 Puedes usar estas credenciales para probar diferentes funcionalidades.');
    }

  } catch (error) {
    console.error('❌ Error durante la creación de usuarios:', error);
  } finally {
    // Cerrar la conexión de Prisma
    await prisma.$disconnect();
  }
}

// Ejecutar la función
createTestUsers(); 