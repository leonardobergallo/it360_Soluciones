const { PrismaClient } = require('@prisma/client');

// Crear una instancia de Prisma Client
const prisma = new PrismaClient();

async function getUsers() {
  try {
    console.log('🔍 Consultando usuarios en la base de datos...\n');
    
    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No se encontraron usuarios en la base de datos.');
      console.log('💡 Para crear usuarios, puedes usar: npm run create-admin');
      return;
    }

    console.log(`✅ Se encontraron ${users.length} usuario(s):\n`);
    
    // Mostrar cada usuario de forma legible
    users.forEach((user, index) => {
      console.log(`👤 Usuario ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Creado: ${user.createdAt.toLocaleString('es-ES')}`);
      console.log(`   Actualizado: ${user.updatedAt.toLocaleString('es-ES')}`);
      console.log(''); // Línea en blanco para separar usuarios
    });

    // Mostrar resumen por roles
    const roleCount = {};
    users.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });

    console.log('📊 Resumen por roles:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} usuario(s)`);
    });

  } catch (error) {
    console.error('❌ Error al consultar usuarios:', error);
  } finally {
    // Cerrar la conexión de Prisma
    await prisma.$disconnect();
  }
}

// Ejecutar la función
getUsers(); 