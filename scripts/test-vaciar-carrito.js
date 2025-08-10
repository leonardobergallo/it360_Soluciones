import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testVaciarCarrito() {
  console.log('🧪 Probando funcionalidad de vaciar carrito...\n');

  try {
    // 1. Verificar estado inicial
    console.log('📋 1. Estado inicial del carrito...');
    const user = await prisma.user.findUnique({
      where: { email: 'leonardobergallo@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } }
    });

    if (cart && cart.items.length > 0) {
      console.log(`🛒 Carrito con ${cart.items.length} productos:`);
      cart.items.forEach(item => {
        console.log(`   • ${item.product.name} - Cantidad: ${item.quantity}`);
      });
    } else {
      console.log('🛒 Carrito vacío');
    }

    // 2. Simular vaciado del carrito usando la API
    console.log('\n🧹 2. Simulando vaciado del carrito...');
    if (cart && cart.items.length > 0) {
      // Eliminar todos los items del carrito
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      console.log('✅ Carrito vaciado en la base de datos');
    } else {
      console.log('ℹ️ Carrito ya estaba vacío');
    }

    // 3. Verificar estado final
    console.log('\n📊 3. Estado final del carrito...');
    const cartFinal = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } }
    });

    if (cartFinal && cartFinal.items.length > 0) {
      console.log(`❌ Carrito aún tiene ${cartFinal.items.length} productos`);
    } else {
      console.log('✅ Carrito completamente vacío');
    }

    // 4. Instrucciones para probar en el frontend
    console.log('\n💡 4. Instrucciones para probar en el frontend:');
    console.log('   1. Ve a http://localhost:3000');
    console.log('   2. Inicia sesión con leonardobergallo@gmail.com');
    console.log('   3. Ve a http://localhost:3000/carrito');
    console.log('   4. Haz clic en el botón "Vaciar carrito"');
    console.log('   5. Verifica que:');
    console.log('      • Los productos desaparezcan de la lista');
    console.log('      • El ícono del carrito se actualice (sin número)');
    console.log('      • El total se muestre como $0');

    // 5. Agregar productos nuevamente para pruebas
    console.log('\n🔄 5. Agregando productos nuevamente para pruebas...');
    const productos = await prisma.product.findMany({
      take: 2,
      select: { id: true, name: true }
    });

    for (const producto of productos) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: producto.id,
          quantity: 1
        }
      });
      console.log(`   ✅ ${producto.name} - Agregado`);
    }

    console.log('\n🎯 Listo para probar el botón "Vaciar carrito"');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testVaciarCarrito();
