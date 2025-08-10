import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function agregarProductosCarrito() {
  console.log('🛒 Agregando productos al carrito para pruebas...\n');

  try {
    // 1. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: 'leonardobergallo@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✅ Usuario: ${user.name}`);

    // 2. Buscar productos disponibles
    const productos = await prisma.product.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true
      }
    });

    if (productos.length === 0) {
      console.log('❌ No hay productos disponibles');
      return;
    }

    console.log(`📦 Productos encontrados: ${productos.length}`);

    // 3. Buscar o crear carrito
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id }
      });
      console.log('🛒 Carrito creado');
    } else {
      console.log('🛒 Carrito existente encontrado');
    }

    // 4. Agregar productos al carrito
    console.log('\n➕ Agregando productos al carrito...');
    for (const producto of productos) {
      // Verificar si ya existe en el carrito
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: producto.id
        }
      });

      if (existingItem) {
        console.log(`   • ${producto.name} - Ya existe (cantidad: ${existingItem.quantity})`);
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: producto.id,
            quantity: 1
          }
        });
        console.log(`   ✅ ${producto.name} - Agregado`);
      }
    }

    // 5. Verificar carrito final
    console.log('\n📊 Estado final del carrito:');
    const cartFinal = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } }
    });

    if (cartFinal && cartFinal.items.length > 0) {
      console.log(`🛒 Carrito con ${cartFinal.items.length} productos:`);
      cartFinal.items.forEach(item => {
        console.log(`   • ${item.product.name} - Cantidad: ${item.quantity} - $${item.product.price}`);
      });
      
      const total = cartFinal.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
      console.log(`💰 Total: $${total.toFixed(2)}`);
    } else {
      console.log('🛒 Carrito vacío');
    }

    console.log('\n💡 Ahora puedes probar:');
    console.log('   1. Ve a http://localhost:3000');
    console.log('   2. Inicia sesión con leonardobergallo@gmail.com');
    console.log('   3. Verifica que el ícono del carrito muestre productos');
    console.log('   4. Ve a http://localhost:3000/admin/solicitudes-compra');
    console.log('   5. Aprueba una solicitud y verifica que el carrito se vacíe');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

agregarProductosCarrito();
