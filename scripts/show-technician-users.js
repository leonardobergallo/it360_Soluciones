const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showTechnicianUsers() {
  try {
    console.log('🔧 Buscando usuarios técnicos...\n');
    
    // Obtener todos los usuarios con rol TECNICO
    const technicianUsers = await prisma.user.findMany({
      where: {
        role: 'TECNICO'
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (technicianUsers.length === 0) {
      console.log('❌ No se encontraron usuarios técnicos en la base de datos.');
      return;
    }

    console.log(`✅ Se encontraron ${technicianUsers.length} usuario(s) técnico(s):\n`);
    console.log('='.repeat(80));
    
    technicianUsers.forEach((user, index) => {
      console.log(`\n👨‍💻 Técnico ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Contraseña: ${user.password}`);
      console.log(`   Fecha de creación: ${user.createdAt.toLocaleString('es-AR')}`);
      console.log(`   Última actualización: ${user.updatedAt.toLocaleString('es-AR')}`);
      console.log('-'.repeat(50));
    });

    console.log('\n📊 Resumen:');
    console.log(`   • Total de técnicos: ${technicianUsers.length}`);
    console.log(`   • Técnico más reciente: ${technicianUsers[0]?.name} (${technicianUsers[0]?.email})`);
    console.log(`   • Técnico más antiguo: ${technicianUsers[technicianUsers.length - 1]?.name} (${technicianUsers[technicianUsers.length - 1]?.email})`);

  } catch (error) {
    console.error('❌ Error al obtener usuarios técnicos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
showTechnicianUsers(); 