const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showPasswords() {
  try {
    console.log('🔍 Obteniendo usuarios con contraseñas...\n');

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log(`✅ Se encontraron ${users.length} usuarios:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. Usuario:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name || 'No especificado'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Contraseña: ${user.password}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Creado: ${user.createdAt.toLocaleString()}`);
      console.log(`   Actualizado: ${user.updatedAt.toLocaleString()}`);
      console.log('');
    });

    console.log('📊 Resumen por roles:');
    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} usuarios`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showPasswords(); 