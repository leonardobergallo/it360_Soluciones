import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function crearNuevaSolicitud() {
  console.log('🛒 Creando nueva solicitud de compra...\n');

  try {
    // 1. Verificar usuario
    console.log('👤 1. Verificando usuario...');
    const user = await prisma.user.findUnique({
      where: { email: 'leonardobergallo@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✅ Usuario: ${user.name} (${user.email})`);

    // 2. Obtener productos disponibles
    console.log('\n📦 2. Obteniendo productos disponibles...');
    const productos = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      take: 3,
      select: { id: true, name: true, price: true, stock: true }
    });

    if (productos.length === 0) {
      console.log('❌ No hay productos disponibles');
      return;
    }

    console.log('✅ Productos encontrados:');
    productos.forEach(p => {
      console.log(`   • ${p.name} - $${p.price} - Stock: ${p.stock}`);
    });

    // 3. Obtener o crear carrito
    console.log('\n🛒 3. Preparando carrito...');
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id }
      });
      console.log('✅ Carrito creado');
    } else {
      console.log('✅ Carrito existente encontrado');
    }

    // 4. Limpiar carrito anterior
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    console.log('🧹 Carrito limpiado');

    // 5. Agregar productos al carrito
    console.log('\n➕ 4. Agregando productos al carrito...');
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

    // 6. Verificar carrito
    console.log('\n📋 5. Verificando carrito...');
    const carritoFinal = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { 
        items: { 
          include: { product: true } 
        } 
      }
    });

    console.log(`🛒 Carrito con ${carritoFinal.items.length} productos:`);
    carritoFinal.items.forEach(item => {
      console.log(`   • ${item.product.name} - Cantidad: ${item.quantity} - $${item.product.price}`);
    });

    // 7. Calcular total
    const total = carritoFinal.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    console.log(`💰 Total: $${total.toFixed(2)}`);

    // 8. Crear ticket de solicitud de compra
    console.log('\n📝 6. Creando ticket de solicitud...');
    
    const descripcion = `Solicitud de compra desde el carrito

Productos solicitados:
${carritoFinal.items.map(item => `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}

Total: $${total.toFixed(2)}

Datos del cliente:
• Nombre: ${user.name}
• Email: ${user.email}
• Teléfono: 03425089906
• Dirección: La Rioja, 3107 3c
• Método de pago: transferencia

Estado: Pendiente de verificación de stock y habilitación de pago`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        nombre: user.name,
        email: user.email,
        telefono: '03425089906',
        asunto: 'Solicitud de compra desde el carrito',
        descripcion: descripcion,
        tipo: 'compra',
        categoria: 'venta',
        estado: 'abierto',
        notas: 'Solicitud creada automáticamente para pruebas'
      }
    });

    console.log(`✅ Ticket creado: ${ticket.ticketNumber}`);

    // 9. Instrucciones para probar
    console.log('\n🎯 ¡Listo! Ahora puedes probar el sistema:');
    console.log('\n📱 Como Cliente:');
    console.log('   1. Ve a http://localhost:3001');
    console.log('   2. Inicia sesión con leonardobergallo@gmail.com');
    console.log('   3. Ve al carrito - deberías ver los productos');
    console.log('   4. El ícono del carrito debería mostrar el número de productos');
    
    console.log('\n👨‍💼 Como Administrador:');
    console.log('   1. Ve a http://localhost:3001/admin/solicitudes-compra');
    console.log('   2. Verifica que aparezca la nueva solicitud');
    console.log('   3. Haz clic en "✔ Habilitar Pago"');
    console.log('   4. Selecciona "Transferencia Bancaria"');
    console.log('   5. Confirma la operación');
    
    console.log('\n📧 Verificar Email:');
    console.log('   • Revisa leonardobergallo@gmail.com');
    console.log('   • Deberías recibir un email con instrucciones de pago');
    
    console.log('\n🛒 Verificar Carrito:');
    console.log('   • El carrito debería vaciarse automáticamente');
    console.log('   • El ícono del carrito debería actualizarse');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

crearNuevaSolicitud();
