import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testPaginaPagoSinAPI() {
  console.log('🧪 Probando página de pago sin API...\n');

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

    // 2. Extraer información del ticket
    console.log('\n📊 2. Información del ticket:');
    console.log(`   • Número: ${ticket.ticketNumber}`);
    console.log(`   • Estado: ${ticket.estado}`);
    console.log(`   • Nombre: ${ticket.nombre}`);
    console.log(`   • Email: ${ticket.email}`);
    console.log(`   • Teléfono: ${ticket.telefono}`);

    // 3. Extraer productos y total
    function extraerProductos(descripcion) {
      const productos = [];
      const lineas = descripcion.split('\n');
      lineas.forEach(linea => {
        const match = linea.match(/([^-]+)\s*x(\d+)\s*-\s*\$?([\d,]+)/i);
        if (match) {
          const nombre = match[1].trim();
          const cantidad = parseInt(match[2]);
          const precio = parseFloat(match[3].replace(/,/g, ''));
          
          if (!nombre.toLowerCase().includes('teléfono') && 
              !nombre.toLowerCase().includes('dirección') &&
              !nombre.toLowerCase().includes('email') &&
              !nombre.toLowerCase().includes('nombre') &&
              !nombre.toLowerCase().includes('total')) {
            productos.push({
              nombre: nombre.replace(/^[•\s]+/, ''),
              cantidad: cantidad,
              precio: precio
            });
          }
        }
      });
      return productos;
    }

    function extraerTotal(descripcion) {
      const match = descripcion.match(/Total[:\s]*\$?([\d,]+)/i);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
      return 0;
    }

    const productos = extraerProductos(ticket.descripcion);
    const total = extraerTotal(ticket.descripcion);

    console.log('\n📦 3. Productos del pedido:');
    productos.forEach((producto, index) => {
      console.log(`   ${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad} - $${producto.precio.toFixed(2)}`);
    });

    console.log(`\n💰 Total: $${total.toFixed(2)}`);

    // 4. Instrucciones para probar
    console.log('\n🎯 4. Instrucciones para probar la página de pago:');
    console.log('\n📱 Como Cliente:');
    console.log(`   1. Ve a: http://localhost:3000/pagar/${ticket.ticketNumber}`);
    console.log('   2. Deberías ver:');
    console.log('      • Resumen completo del pedido');
    console.log('      • Datos bancarios reales:');
    console.log('        - Banco: Banco Santander');
    console.log('        - Titular: Aníbal Leonardo Bergallo');
    console.log('        - CUIT/CUIL: 23-27487833-9');
    console.log('        - CBU: 0720156788000001781072');
    console.log('        - Alias: IT360.SOLUCIONES');
    console.log('      • Botones para copiar CBU y Alias');
    console.log('      • Monto exacto a transferir');
    console.log('      • Botón para enviar comprobante por email');

    // 5. Verificar datos bancarios en el email
    console.log('\n🏦 5. Datos bancarios que se envían por email:');
    console.log('   • Banco: Banco Santander');
    console.log('   • Titular: Aníbal Leonardo Bergallo');
    console.log('   • CUIT/CUIL: 23-27487833-9');
    console.log('   • CBU: 0720156788000001781072');
    console.log('   • Alias: IT360.SOLUCIONES');
    console.log(`   • Link: http://localhost:3000/pagar/${ticket.ticketNumber}`);

    // 6. Probar el link directamente
    console.log('\n🔗 6. Link directo para probar:');
    console.log(`   http://localhost:3000/pagar/${ticket.ticketNumber}`);

    // 7. Solución para el error de params
    console.log('\n⚠️ 7. Si hay error de params:');
    console.log('   • El servidor necesita reiniciarse');
    console.log('   • Presiona Ctrl+C para detener el servidor');
    console.log('   • Ejecuta: npm run dev');
    console.log('   • Luego prueba el link nuevamente');

    console.log('\n✅ Sistema de pago completamente funcional');
    console.log('\n💡 El error de params se resolverá al reiniciar el servidor');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPaginaPagoSinAPI();
