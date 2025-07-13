const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getUsers() {
  try {
    console.log('🔍 Obteniendo usuarios...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    console.log(`✅ Se encontraron ${users.length} usuarios:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Usuario:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Creado: ${user.createdAt.toLocaleString('es-ES')}`);
      console.log(`   Actualizado: ${user.updatedAt.toLocaleString('es-ES')}`);
      console.log('');
    });

    // Resumen por roles
    const roleCount = {};
    users.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });

    console.log('📊 Resumen por roles:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} usuarios`);
    });

  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUsers(); 