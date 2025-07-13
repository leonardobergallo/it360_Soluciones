const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Diagnóstico de usuarios y carritos...\n');

  try {
    // Verificar usuarios existentes
    console.log('📋 Usuarios en la base de datos:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('💡 Ejecuta el seed primero: node prisma/seed.js');
      return;
    }

    users.forEach(user => {
      console.log(`  - ID: ${user.id}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Nombre: ${user.name}`);
      console.log(`    Rol: ${user.role}`);
      console.log(`    Creado: ${user.createdAt}`);
      console.log('');
    });

    // Verificar carritos existentes
    console.log('🛒 Carritos en la base de datos:');
    const carts = await prisma.cart.findMany({
      include: {
        user: {
          select: { email: true, name: true }
        },
        items: {
          include: { product: true }
        }
      }
    });

    if (carts.length === 0) {
      console.log('ℹ️  No hay carritos creados aún');
    } else {
      carts.forEach(cart => {
        console.log(`  - Carrito ID: ${cart.id}`);
        console.log(`    Usuario: ${cart.user.email} (${cart.user.name})`);
        console.log(`    Items: ${cart.items.length}`);
        console.log('');
      });
    }

    // Verificar productos
    console.log('📦 Productos en la base de datos:');
    const products = await prisma.product.findMany({
      select: { id: true, name: true, price: true, stock: true }
    });

    if (products.length === 0) {
      console.log('❌ No hay productos en la base de datos');
    } else {
      products.forEach(product => {
        console.log(`  - ${product.name} ($${product.price}) - Stock: ${product.stock}`);
      });
    }

    console.log('\n✅ Diagnóstico completado');

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 