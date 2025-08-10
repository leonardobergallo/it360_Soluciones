import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testHabilitarPagoCompleto() {
  console.log('🧪 Probando proceso completo de habilitar pago...\n');

  try {
    // 1. Verificar tickets de compra
    console.log('📋 1. Verificando tickets de compra...');
    const tickets = await prisma.ticket.findMany({
      where: {
        tipo: 'compra',
        estado: 'abierto'
      },
      take: 1
    });

    if (tickets.length === 0) {
      console.log('❌ No hay tickets de compra para probar');
      console.log('💡 Crea una solicitud de compra desde el frontend primero');
      return;
    }

    const ticket = tickets[0];
    console.log(`✅ Ticket encontrado: ${ticket.ticketNumber}`);
    console.log(`👤 Cliente: ${ticket.nombre} (${ticket.email})`);

    // 2. Verificar stock antes
    console.log('\n📦 2. Verificando stock antes de la operación...');
    const productos = extraerProductos(ticket.descripcion);
    
    for (const producto of productos) {
      const productoDB = await prisma.product.findFirst({
        where: {
          name: { contains: producto.nombre, mode: 'insensitive' }
        }
      });
      
      if (productoDB) {
        console.log(`   ✅ ${producto.nombre}: Stock actual ${productoDB.stock} - Solicitado ${producto.cantidad}`);
      } else {
        console.log(`   ❌ ${producto.nombre}: No encontrado`);
      }
    }

    // 3. Verificar carrito del usuario
    console.log('\n🛒 3. Verificando carrito del usuario...');
    const user = await prisma.user.findUnique({
      where: { email: ticket.email }
    });

    if (user) {
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: { include: { product: true } } }
      });

      if (cart && cart.items.length > 0) {
        console.log(`   ✅ Carrito con ${cart.items.length} productos`);
        cart.items.forEach(item => {
          console.log(`   • ${item.product.name} - Cantidad: ${item.quantity}`);
        });
      } else {
        console.log('   ℹ️ Carrito vacío');
      }
    } else {
      console.log('   ❌ Usuario no encontrado');
    }

    // 4. Simular proceso de habilitar pago
    console.log('\n🔄 4. Simulando proceso de habilitar pago...');
    
    // Verificar stock
    let stockDisponible = true;
    for (const producto of productos) {
      const productoDB = await prisma.product.findFirst({
        where: {
          name: { contains: producto.nombre, mode: 'insensitive' }
        }
      });
      
      if (!productoDB || productoDB.stock < producto.cantidad) {
        stockDisponible = false;
        console.log(`   ❌ Stock insuficiente: ${producto.nombre}`);
      }
    }

    if (!stockDisponible) {
      console.log('   ❌ No se puede habilitar pago - Stock insuficiente');
      return;
    }

    // Actualizar estado del ticket
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { 
        estado: 'pago_habilitado',
        notas: ticket.notas + `\n\n✅ PAGO HABILITADO - Método: TRANSFERENCIA_BANCARIA - ${new Date().toLocaleString('es-AR')}`
      }
    });
    console.log('   ✅ Estado del ticket actualizado');

    // Reducir stock
    for (const producto of productos) {
      const productoDB = await prisma.product.findFirst({
        where: {
          name: { contains: producto.nombre, mode: 'insensitive' }
        }
      });
      
      if (productoDB) {
        const nuevoStock = Math.max(0, productoDB.stock - producto.cantidad);
        await prisma.product.update({
          where: { id: productoDB.id },
          data: { stock: nuevoStock }
        });
        console.log(`   ✅ Stock reducido: ${producto.nombre} - ${productoDB.stock} → ${nuevoStock}`);
      }
    }

    // Vaciar carrito
    if (user) {
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id }
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
        console.log('   ✅ Carrito vaciado');
      }
    }

    // 5. Verificar estado final
    console.log('\n📊 5. Estado final...');
    
    // Verificar ticket
    const ticketFinal = await prisma.ticket.findUnique({
      where: { id: ticket.id }
    });
    console.log(`   📋 Ticket: ${ticketFinal.estado}`);

    // Verificar stock final
    for (const producto of productos) {
      const productoDB = await prisma.product.findFirst({
        where: {
          name: { contains: producto.nombre, mode: 'insensitive' }
        }
      });
      
      if (productoDB) {
        console.log(`   📦 ${producto.nombre}: Stock final ${productoDB.stock}`);
      }
    }

    // Verificar carrito final
    if (user) {
      const cartFinal = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true }
      });

      if (cartFinal && cartFinal.items.length > 0) {
        console.log(`   🛒 Carrito aún tiene ${cartFinal.items.length} productos`);
      } else {
        console.log('   🛒 Carrito vacío');
      }
    }

    console.log('\n✅ Proceso completado exitosamente');
    console.log('\n💡 Ahora puedes probar en el frontend:');
    console.log('   1. Ve a http://localhost:3000/admin/solicitudes-compra');
    console.log('   2. Verifica que el ticket aparezca como "Pago Habilitado"');
    console.log('   3. El cliente debería recibir un email con instrucciones de pago');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para extraer productos de la descripción
function extraerProductos(descripcion) {
  const productos = [];
  
  const lineas = descripcion.split('\n');
  lineas.forEach(linea => {
    // Buscar productos con formato "Producto x1 - $precio"
    const match = linea.match(/([^-]+)\s*x(\d+)\s*-\s*\$?([\d,]+)/i);
    if (match) {
      const nombre = match[1].trim();
      const cantidad = parseInt(match[2]);
      
      // Filtrar líneas que no son productos (teléfono, dirección, etc.)
      if (!nombre.toLowerCase().includes('teléfono') && 
          !nombre.toLowerCase().includes('dirección') &&
          !nombre.toLowerCase().includes('email') &&
          !nombre.toLowerCase().includes('nombre') &&
          !nombre.toLowerCase().includes('total')) {
        productos.push({
          nombre: nombre.replace(/^[•\s]+/, ''), // Remover símbolos al inicio
          cantidad: cantidad
        });
      }
    } else {
      // Buscar productos con formato "Producto - $precio"
      const match2 = linea.match(/([^-]+)\s*-\s*\$?([\d,]+)/i);
      if (match2 && !linea.toLowerCase().includes('total')) {
        const nombre = match2[1].trim();
        
        // Filtrar líneas que no son productos
        if (!nombre.toLowerCase().includes('teléfono') && 
            !nombre.toLowerCase().includes('dirección') &&
            !nombre.toLowerCase().includes('email') &&
            !nombre.toLowerCase().includes('nombre')) {
          productos.push({
            nombre: nombre.replace(/^[•\s]+/, ''), // Remover símbolos al inicio
            cantidad: 1
          });
        }
      }
    }
  });
  
  return productos;
}

testHabilitarPagoCompleto();
