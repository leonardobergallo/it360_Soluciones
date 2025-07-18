const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showClientUsers() {
  try {
    console.log('🔍 Buscando usuarios cliente...\n');
    
    // Obtener todos los usuarios con rol USER (clientes)
    const clientUsers = await prisma.user.findMany({
      where: {
        role: 'USER'
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

    if (clientUsers.length === 0) {
      console.log('❌ No se encontraron usuarios cliente en la base de datos.');
      return;
    }

    console.log(`✅ Se encontraron ${clientUsers.length} usuario(s) cliente:\n`);
    console.log('='.repeat(80));
    
    clientUsers.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Contraseña: ${user.password}`);
      console.log(`   Fecha de creación: ${user.createdAt.toLocaleString('es-AR')}`);
      console.log(`   Última actualización: ${user.updatedAt.toLocaleString('es-AR')}`);
      console.log('-'.repeat(50));
    });

    console.log('\n📊 Resumen:');
    console.log(`   • Total de clientes: ${clientUsers.length}`);
    console.log(`   • Cliente más reciente: ${clientUsers[0]?.name} (${clientUsers[0]?.email})`);
    console.log(`   • Cliente más antiguo: ${clientUsers[clientUsers.length - 1]?.name} (${clientUsers[clientUsers.length - 1]?.email})`);

  } catch (error) {
    console.error('❌ Error al obtener usuarios cliente:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
showClientUsers(); 