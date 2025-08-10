import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testApiHabilitarPago() {
  console.log('🧪 Probando API de habilitar pago...\n');

  try {
    // 1. Buscar un ticket de compra para probar
    console.log('📋 1. Buscando ticket de compra...');
    const ticket = await prisma.ticket.findFirst({
      where: {
        tipo: 'compra',
        estado: 'abierto'
      }
    });

    if (!ticket) {
      console.log('❌ No hay tickets de compra abiertos');
      console.log('💡 Crea una solicitud de compra desde el frontend primero');
      return;
    }

    console.log(`✅ Ticket encontrado: ${ticket.ticketNumber}`);
    console.log(`👤 Cliente: ${ticket.nombre} (${ticket.email})`);

    // 2. Probar la API directamente
    console.log('\n🔄 2. Probando API de habilitar pago...');
    
    const response = await fetch('http://localhost:3001/api/admin/habilitar-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId: ticket.id,
        metodoPago: 'TRANSFERENCIA_BANCARIA'
      })
    });

    console.log(`📊 Status: ${response.status}`);
    console.log(`📊 Status Text: ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error en la API:');
      console.log(errorText);
    }

    // 3. Verificar estado final del ticket
    console.log('\n📊 3. Verificando estado final del ticket...');
    const ticketFinal = await prisma.ticket.findUnique({
      where: { id: ticket.id }
    });

    console.log(`📋 Estado: ${ticketFinal.estado}`);
    console.log(`📝 Notas: ${ticketFinal.notas}`);

    // 4. Verificar carrito del usuario
    console.log('\n🛒 4. Verificando carrito del usuario...');
    const user = await prisma.user.findUnique({
      where: { email: ticket.email }
    });

    if (user) {
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true }
      });

      if (cart && cart.items.length > 0) {
        console.log(`❌ Carrito aún tiene ${cart.items.length} productos`);
        cart.items.forEach(item => {
          console.log(`   • ${item.product.name} - Cantidad: ${item.quantity}`);
        });
      } else {
        console.log('✅ Carrito vacío');
      }
    }

    console.log('\n🎯 Prueba completada');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testApiHabilitarPago();
