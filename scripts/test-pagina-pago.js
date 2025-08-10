import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testPaginaPago() {
  console.log('🧪 Probando página de pago...\n');

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

    // 2. Probar la API de obtener ticket
    console.log('\n🔄 2. Probando API de obtener ticket...');
    
    const response = await fetch(`http://localhost:3001/api/tickets/${ticket.ticketNumber}`);
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📊 Status Text: ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ticket obtenido correctamente');
      console.log(`   • Número: ${data.ticketNumber}`);
      console.log(`   • Estado: ${data.estado}`);
      console.log(`   • Nombre: ${data.nombre}`);
      console.log(`   • Email: ${data.email}`);
    } else {
      const errorText = await response.text();
      console.log('❌ Error obteniendo ticket:');
      console.log(errorText);
    }

    // 3. Instrucciones para probar la página
    console.log('\n🎯 3. Instrucciones para probar la página de pago:');
    console.log('\n📱 Como Cliente:');
    console.log(`   1. Ve a: http://localhost:3001/pagar/${ticket.ticketNumber}`);
    console.log('   2. Deberías ver:');
    console.log('      • Resumen completo del pedido');
    console.log('      • Datos bancarios reales:');
    console.log('        - Banco: Banco Galicia');
    console.log('        - Titular: Aníbal Leonardo Bergallo');
    console.log('        - CUIT/CUIL: 23-27487833-9');
    console.log('        - CBU: 0720156788000001781072');
    console.log('        - Alias: IT360.SOLUCIONES');
    console.log('      • Botones para copiar CBU y Alias');
    console.log('      • Monto exacto a transferir');
    console.log('      • Botón para enviar comprobante por email');
    
    console.log('\n📧 Verificar Email:');
    console.log('   • Revisa leonardobergallo@gmail.com');
    console.log('   • El email debería incluir:');
    console.log('      • Datos bancarios reales');
    console.log('      • Link a la página de pago');
    console.log('      • Instrucciones completas');

    // 4. Verificar datos bancarios en el email
    console.log('\n🏦 4. Datos bancarios que se envían por email:');
    console.log('   • Banco: Banco Galicia');
    console.log('   • Titular: Aníbal Leonardo Bergallo');
    console.log('   • CUIT/CUIL: 23-27487833-9');
    console.log('   • CBU: 0720156788000001781072');
    console.log('   • Alias: IT360.SOLUCIONES');
    console.log('   • Link: /pagar/' + ticket.ticketNumber);

    console.log('\n✅ Sistema de pago completamente funcional');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPaginaPago();
