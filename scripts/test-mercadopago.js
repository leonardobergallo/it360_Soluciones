import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testMercadoPago() {
  console.log('🧪 Probando integración de MercadoPago...\n');

  try {
    // 1. Buscar un ticket con pago habilitado
    console.log('📋 1. Buscando ticket con pago habilitado...');
    const ticket = await prisma.ticket.findFirst({
      where: {
        tipo: 'compra',
        estado: 'pago_habilitado'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!ticket) {
      console.log('❌ No hay tickets con pago habilitado');
      console.log('💡 Primero habilita el pago de una solicitud');
      return;
    }

    console.log(`✅ Ticket encontrado: ${ticket.ticketNumber}`);
    console.log(`👤 Cliente: ${ticket.nombre} (${ticket.email})`);

    // 2. Extraer productos y total
    console.log('\n📦 2. Analizando productos del pedido...');
    console.log('📝 Descripción completa:');
    console.log(ticket.descripcion);
    
    const productos = [];
    const lines = ticket.descripcion.split('\n');
    
    for (const line of lines) {
      // Buscar patrones como: • Monitor 24" Full HD x1 - $239.99
      const match = line.match(/•\s*(.+?)\s*x(\d+)\s*-\s*\$([\d,]+\.?\d*)/);
      if (match) {
        productos.push({
          nombre: match[1].trim(),
          cantidad: parseInt(match[2]),
          precio: parseFloat(match[3].replace(',', ''))
        });
      }
    }

    // Si no se encontraron productos, usar un total fijo para pruebas
    let total = productos.reduce((sum, p) => sum + p.precio, 0);
    if (total === 0) {
      total = 70439.99; // Total fijo para pruebas
      console.log('⚠️ No se pudieron extraer productos, usando total fijo para pruebas');
    }
    
    const descripcionProductos = productos.length > 0 
      ? productos.map(p => `${p.nombre} x${p.cantidad}`).join(', ')
      : 'Productos del carrito';

    console.log('📋 Productos encontrados:');
    productos.forEach((producto, index) => {
      console.log(`   ${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad} - $${producto.precio.toFixed(2)}`);
    });
    console.log(`💰 Total: $${total.toFixed(2)}`);

    // 3. Probar API de MercadoPago
    console.log('\n💳 3. Probando API de MercadoPago...');
    
    const response = await fetch('http://localhost:3000/api/payment/mercadopago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketNumber: ticket.ticketNumber,
        amount: total,
        description: descripcionProductos,
        customerEmail: ticket.email,
        customerName: ticket.nombre
      }),
    });

    console.log(`📊 Status: ${response.status}`);
    console.log(`📊 Status Text: ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(data, null, 2));

      if (data.success && data.init_point) {
        console.log('\n🎯 4. Instrucciones para probar MercadoPago:');
        console.log('\n📱 Como Cliente:');
        console.log('   1. Ve a la página de pago:');
        console.log(`      http://localhost:3001/pagar/${ticket.ticketNumber}`);
        console.log('   2. Selecciona "MercadoPago" como método de pago');
        console.log('   3. Haz clic en "Proceder al Pago con MercadoPago"');
        console.log('   4. Serás redirigido a MercadoPago');
        console.log('   5. Completa el pago en MercadoPago');
        console.log('   6. Volverás a la página de éxito');

        console.log('\n🔗 Link directo para probar:');
        console.log(`   http://localhost:3001/pagar/${ticket.ticketNumber}`);

        console.log('\n⚠️ Nota:');
        console.log('   • Si hay error 404, reinicia el servidor con: npm run dev');
        console.log('   • Las credenciales de MercadoPago están configuradas');
        console.log('   • El pago será procesado en modo de prueba');
      }
    } else {
      const errorData = await response.text();
      console.log('❌ Error en la respuesta:');
      console.log(errorData);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMercadoPago();
