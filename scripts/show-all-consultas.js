const { PrismaClient } = require('@prisma/client');

console.log('📋 Mostrando todas las consultas y solicitudes del sistema...\n');

async function showAllConsultas() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');

    // 1. Obtener todos los contactos (consultas generales, vendedor, hogar inteligente)
    console.log('📧 === CONTACTOS (Consultas Generales) ===');
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`   Total de contactos: ${contacts.length}`);
    
    if (contacts.length > 0) {
      contacts.forEach((contact, index) => {
        console.log(`\n   📧 Contacto #${index + 1}:`);
        console.log(`      👤 Nombre: ${contact.name}`);
        console.log(`      📧 Email: ${contact.email}`);
        console.log(`      📅 Fecha: ${contact.createdAt.toLocaleString('es-AR')}`);
        console.log(`      💬 Tipo: ${determinarTipoContacto(contact.message)}`);
        console.log(`      📝 Mensaje: ${contact.message.substring(0, 100)}...`);
      });
    } else {
      console.log('   ❌ No hay contactos');
    }

    // 2. Obtener todos los tickets (presupuestos y ventas)
    console.log('\n🎫 === TICKETS (Presupuestos y Ventas) ===');
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`   Total de tickets: ${tickets.length}`);
    
    if (tickets.length > 0) {
      tickets.forEach((ticket, index) => {
        console.log(`\n   🎫 Ticket #${index + 1}:`);
        console.log(`      🆔 Número: ${ticket.ticketNumber}`);
        console.log(`      👤 Nombre: ${ticket.nombre}`);
        console.log(`      📧 Email: ${ticket.email}`);
        console.log(`      📱 Teléfono: ${ticket.telefono || 'No proporcionado'}`);
        console.log(`      🏷️ Tipo: ${ticket.tipo}`);
        console.log(`      📊 Estado: ${ticket.estado}`);
        console.log(`      📅 Fecha: ${ticket.createdAt.toLocaleString('es-AR')}`);
        console.log(`      📝 Asunto: ${ticket.asunto}`);
        console.log(`      📄 Descripción: ${ticket.descripcion.substring(0, 100)}...`);
      });
    } else {
      console.log('   ❌ No hay tickets');
    }

    // 3. Estadísticas por tipo
    console.log('\n📊 === ESTADÍSTICAS POR TIPO ===');
    
    // Contactos por tipo
    const contactosPorTipo = {
      presupuesto: contacts.filter(c => c.message.includes('Solicitud de presupuesto')).length,
      vendedor: contacts.filter(c => c.message.includes('Productos:') || c.message.includes('Consulta de Producto')).length,
      hogar: contacts.filter(c => c.message.includes('Hogar Inteligente')).length,
      general: contacts.filter(c => !c.message.includes('Solicitud de presupuesto') && !c.message.includes('Productos:') && !c.message.includes('Hogar Inteligente')).length
    };

    console.log('   📧 Contactos:');
    console.log(`      • Solicitudes de presupuesto: ${contactosPorTipo.presupuesto}`);
    console.log(`      • Consultas con vendedor: ${contactosPorTipo.vendedor}`);
    console.log(`      • Hogar inteligente: ${contactosPorTipo.hogar}`);
    console.log(`      • Consultas generales: ${contactosPorTipo.general}`);

    // Tickets por tipo
    const ticketsPorTipo = {
      presupuesto: tickets.filter(t => t.tipo === 'presupuesto').length,
      venta: tickets.filter(t => t.tipo === 'venta').length,
      soporte: tickets.filter(t => t.tipo === 'soporte').length,
      contacto: tickets.filter(t => t.tipo === 'contacto').length
    };

    console.log('   🎫 Tickets:');
    console.log(`      • Presupuestos: ${ticketsPorTipo.presupuesto}`);
    console.log(`      • Ventas: ${ticketsPorTipo.venta}`);
    console.log(`      • Soporte: ${ticketsPorTipo.soporte}`);
    console.log(`      • Contacto: ${ticketsPorTipo.contacto}`);

    // 4. Resumen de dónde van las consultas
    console.log('\n🎯 === DÓNDE VAN LAS CONSULTAS ===');
    console.log('   📧 Contactos → /admin/contacts');
    console.log('      • Consultas generales del formulario de contacto');
    console.log('      • Consultas con vendedor (modal del catálogo)');
    console.log('      • Solicitudes de hogar inteligente');
    console.log('');
    console.log('   🎫 Tickets → /admin/presupuestos');
    console.log('      • Solicitudes de presupuesto (formulario de contacto)');
    console.log('      • Se guardan como Ticket con tipo "presupuesto"');
    console.log('');
    console.log('   💳 Solicitudes de Venta → /admin/transferencias');
    console.log('      • Solicitudes de compra con pago');
    console.log('      • Se guardan como Ticket con tipo "venta"');
    console.log('      • Aquí es donde habilitas MercadoPago/Transferencia');

    console.log('\n💡 === PANELES DE ADMINISTRACIÓN ===');
    console.log('   🔗 http://localhost:3001/admin/contacts');
    console.log('      → Ver todas las consultas de contacto');
    console.log('');
    console.log('   🔗 http://localhost:3001/admin/presupuestos');
    console.log('      → Ver solicitudes de presupuesto');
    console.log('');
    console.log('   🔗 http://localhost:3001/admin/transferencias');
    console.log('      → Habilitar pagos para solicitudes de venta');

  } catch (error) {
    console.error('❌ Error al obtener consultas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para determinar el tipo de contacto basado en el mensaje
function determinarTipoContacto(mensaje) {
  if (mensaje.includes('Solicitud de presupuesto')) {
    return 'Solicitud de Presupuesto';
  } else if (mensaje.includes('Productos:') || mensaje.includes('Consulta de Producto')) {
    return 'Consulta con Vendedor';
  } else if (mensaje.includes('Hogar Inteligente')) {
    return 'Hogar Inteligente';
  } else {
    return 'Consulta General';
  }
}

showAllConsultas(); 