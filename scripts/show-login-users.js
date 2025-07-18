const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showLoginUsers() {
  try {
    console.log('🔐 USUARIOS PARA INGRESAR AL SISTEMA\n');
    console.log('='.repeat(80));
    
    // Obtener todos los usuarios organizados por rol
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    if (allUsers.length === 0) {
      console.log('❌ No hay usuarios en la base de datos.');
      return;
    }

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
        console.log(`      📧 Email: ${user.email}`);
        console.log(`      🔑 Contraseña: ${user.password}`);
        console.log(`      👤 Nombre: ${user.name}`);
        console.log(`      📅 Creado: ${user.createdAt.toLocaleDateString('es-AR')}`);
        console.log('   ' + '─'.repeat(40));
      });
    }

    // Mostrar técnicos
    if (usersByRole.TECNICO.length > 0) {
      console.log('\n👨‍💻 TÉCNICOS:');
      console.log('='.repeat(50));
      usersByRole.TECNICO.forEach((user, index) => {
        console.log(`\n   🔧 Técnico ${index + 1}:`);
        console.log(`      📧 Email: ${user.email}`);
        console.log(`      🔑 Contraseña: ${user.password}`);
        console.log(`      👤 Nombre: ${user.name}`);
        console.log(`      📅 Creado: ${user.createdAt.toLocaleDateString('es-AR')}`);
        console.log('   ' + '─'.repeat(40));
      });
    }

    // Mostrar clientes
    if (usersByRole.USER.length > 0) {
      console.log('\n👤 CLIENTES:');
      console.log('='.repeat(50));
      usersByRole.USER.forEach((user, index) => {
        console.log(`\n   🛒 Cliente ${index + 1}:`);
        console.log(`      📧 Email: ${user.email}`);
        console.log(`      🔑 Contraseña: ${user.password}`);
        console.log(`      👤 Nombre: ${user.name}`);
        console.log(`      📅 Creado: ${user.createdAt.toLocaleDateString('es-AR')}`);
        console.log('   ' + '─'.repeat(40));
      });
    }

    // Resumen para login rápido
    console.log('\n🚀 RESUMEN PARA LOGIN RÁPIDO:');
    console.log('='.repeat(50));
    
    if (usersByRole.ADMIN.length > 0) {
      console.log('\n   👑 ADMIN (Panel de administración):');
      const admin = usersByRole.ADMIN[0];
      console.log(`      📧 ${admin.email}`);
      console.log(`      🔑 ${admin.password}`);
    }
    
    if (usersByRole.TECNICO.length > 0) {
      console.log('\n   👨‍💻 TÉCNICO (Panel técnico):');
      const tecnico = usersByRole.TECNICO[0];
      console.log(`      📧 ${tecnico.email}`);
      console.log(`      🔑 ${tecnico.password}`);
    }
    
    if (usersByRole.USER.length > 0) {
      console.log('\n   👤 CLIENTE (Acceso normal):');
      const cliente = usersByRole.USER[0];
      console.log(`      📧 ${cliente.email}`);
      console.log(`      🔑 ${cliente.password}`);
    }

    console.log('\n📊 ESTADÍSTICAS:');
    console.log('='.repeat(50));
    console.log(`   • Total de usuarios: ${allUsers.length}`);
    console.log(`   • Administradores: ${usersByRole.ADMIN.length}`);
    console.log(`   • Técnicos: ${usersByRole.TECNICO.length}`);
    console.log(`   • Clientes: ${usersByRole.USER.length}`);

    console.log('\n💡 TIPS:');
    console.log('='.repeat(50));
    console.log('   • Usa ADMIN para acceder al panel de administración');
    console.log('   • Usa TÉCNICO para acceder al panel técnico');
    console.log('   • Usa CLIENTE para acceder normal al sitio');
    console.log('   • URL de login: /login');

  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
showLoginUsers(); 