import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testCarritoFrontend() {
  console.log('🧪 Probando actualización del carrito en frontend...\n');

  try {
    // 1. Verificar usuario y carrito
    console.log('📋 1. Verificando usuario y carrito...');
    const user = await prisma.user.findUnique({
      where: { email: 'leonardobergallo@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.name} (${user.email})`);

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

    // 2. Simular vaciado del carrito
    console.log('\n🧹 2. Simulando vaciado del carrito...');
    if (cart && cart.items.length > 0) {
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

    // 4. Instrucciones para el frontend
    console.log('\n💡 4. Instrucciones para probar el frontend:');
    console.log('   1. Ve a http://localhost:3000');
    console.log('   2. Inicia sesión con leonardobergallo@gmail.com');
    console.log('   3. Verifica que el ícono del carrito no muestre productos');
    console.log('   4. Si aún muestra productos, recarga la página (F5)');
    console.log('   5. El componente se actualiza cada 5 segundos automáticamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCarritoFrontend();
