const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showAllUsers() {
  try {
    console.log('👥 Mostrando todos los usuarios organizados por rol...\n');
    
    // Obtener todos los usuarios organizados por rol
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    if (allUsers.length === 0) {
      console.log('❌ No se encontraron usuarios en la base de datos.');
      return;
    }

    console.log(`✅ Se encontraron ${allUsers.length} usuario(s) en total:\n`);
    console.log('='.repeat(100));

    // Agrupar usuarios por rol
    const usersByRole = {
      ADMIN: allUsers.filter(user => user.role === 'ADMIN'),
      TECNICO: allUsers.filter(user => user.role === 'TECNICO'),
      USER: allUsers.filter(user => user.role === 'USER')
    };

    // Mostrar administradores
    if (usersByRole.ADMIN.length > 0) {
      console.log('\n👑 ADMINISTRADORES:');
      console.log('='.repeat(50));
      usersByRole.ADMIN.forEach((user, index) => {
        console.log(`\n   🔐 Admin ${index + 1}:`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Nombre: ${user.name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Contraseña: ${user.password}`);
        console.log(`      Fecha de creación: ${user.createdAt.toLocaleString('es-AR')}`);
        console.log(`      Última actualización: ${user.updatedAt.toLocaleString('es-AR')}`);
        console.log('   ' + '-'.repeat(40));
      });
    }

    // Mostrar técnicos
    if (usersByRole.TECNICO.length > 0) {
      console.log('\n👨‍💻 TÉCNICOS:');
      console.log('='.repeat(50));
      usersByRole.TECNICO.forEach((user, index) => {
        console.log(`\n   🔧 Técnico ${index + 1}:`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Nombre: ${user.name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Contraseña: ${user.password}`);
        console.log(`      Fecha de creación: ${user.createdAt.toLocaleString('es-AR')}`);
        console.log(`      Última actualización: ${user.updatedAt.toLocaleString('es-AR')}`);
        console.log('   ' + '-'.repeat(40));
      });
    }

    // Mostrar clientes
    if (usersByRole.USER.length > 0) {
      console.log('\n👤 CLIENTES:');
      console.log('='.repeat(50));
      usersByRole.USER.forEach((user, index) => {
        console.log(`\n   🛒 Cliente ${index + 1}:`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Nombre: ${user.name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Contraseña: ${user.password}`);
        console.log(`      Fecha de creación: ${user.createdAt.toLocaleString('es-AR')}`);
        console.log(`      Última actualización: ${user.updatedAt.toLocaleString('es-AR')}`);
        console.log('   ' + '-'.repeat(40));
      });
    }

    // Resumen general
    console.log('\n📊 RESUMEN GENERAL:');
    console.log('='.repeat(50));
    console.log(`   • Total de usuarios: ${allUsers.length}`);
    console.log(`   • Administradores: ${usersByRole.ADMIN.length}`);
    console.log(`   • Técnicos: ${usersByRole.TECNICO.length}`);
    console.log(`   • Clientes: ${usersByRole.USER.length}`);
    
    if (allUsers.length > 0) {
      console.log(`   • Usuario más reciente: ${allUsers[0].name} (${allUsers[0].role})`);
      console.log(`   • Usuario más antiguo: ${allUsers[allUsers.length - 1].name} (${allUsers[allUsers.length - 1].role})`);
    }

  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
showAllUsers(); 