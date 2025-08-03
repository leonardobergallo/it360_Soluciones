const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testEmailNotifications() {
  try {
    console.log('📧 Probando notificaciones por email...\n');

    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos\n');

    // Verificar configuración de email
    console.log('🔧 Configuración de email:');
    console.log(`   • RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   • Email de destino: it360tecnologia@gmail.com`);
    console.log('');

    // Obtener tickets recientes
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`📦 Tickets recientes encontrados: ${tickets.length}\n`);

    if (tickets.length === 0) {
      console.log('❌ No hay tickets para probar');
      return;
    }

    // Mostrar información de los tickets
    console.log('📋 Información de tickets:');
    tickets.forEach((ticket, index) => {
      console.log(`   ${index + 1}. ${ticket.ticketNumber} - ${ticket.tipo} - ${ticket.estado} - ${ticket.nombre}`);
    });

    // Simular envío de email para el ticket más reciente
    const latestTicket = tickets[0];
    console.log(`\n🧪 Simulando envío de email para: ${latestTicket.ticketNumber}`);

    // Simular la función de envío de email
    const emailData = {
      from: 'IT360 Soluciones <noreply@it360.com>',
      to: 'it360tecnologia@gmail.com',
      subject: `🎫 Nuevo Ticket ${latestTicket.ticketNumber} - ${latestTicket.tipo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎫 Nuevo Ticket Creado</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                🔢 Ticket: ${latestTicket.ticketNumber}
              </h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">👤 Nombre</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${latestTicket.nombre}</p>
                </div>
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📧 Email</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${latestTicket.email}</p>
                </div>
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📞 Teléfono</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${latestTicket.telefono || 'No especificado'}</p>
                </div>
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🏷️ Tipo</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${latestTicket.tipo}</p>
                </div>
              </div>

              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📝 Asunto</p>
                <p style="margin: 0 0 15px 0; color: #333; font-weight: bold; font-size: 16px;">${latestTicket.asunto}</p>
              </div>

              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📋 Descripción</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; color: #666; font-style: italic; border-left: 4px solid #007bff;">
                  ${latestTicket.descripcion.substring(0, 200)}...
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    };

    console.log('📧 Datos del email que se enviaría:');
    console.log(`   • Para: ${emailData.to}`);
    console.log(`   • Asunto: ${emailData.subject}`);
    console.log(`   • Ticket: ${latestTicket.ticketNumber}`);
    console.log(`   • Cliente: ${latestTicket.nombre} (${latestTicket.email})`);
    console.log(`   • Tipo: ${latestTicket.tipo}`);

    // Verificar si es un ticket de compra
    if (latestTicket.tipo === 'compra') {
      console.log('\n🛒 Ticket de compra detectado:');
      console.log(`   • Estado actual: ${latestTicket.estado}`);
      
      if (latestTicket.estado === 'pago_habilitado') {
        console.log('   • ✅ Pago habilitado - El cliente recibió email con datos bancarios');
      } else {
        console.log('   • ⏳ Pendiente de habilitar pago desde el panel de administrador');
      }
    }

    // Estadísticas de tipos de tickets
    const ticketTypes = await prisma.ticket.groupBy({
      by: ['tipo'],
      _count: { tipo: true }
    });

    console.log('\n📊 Estadísticas por tipo de ticket:');
    ticketTypes.forEach(type => {
      console.log(`   • ${type.tipo}: ${type._count.tipo}`);
    });

    // Estadísticas de estados
    const ticketStates = await prisma.ticket.groupBy({
      by: ['estado'],
      _count: { estado: true }
    });

    console.log('\n📈 Estadísticas por estado:');
    ticketStates.forEach(state => {
      console.log(`   • ${state.estado}: ${state._count.estado}`);
    });

    console.log('\n🎉 Prueba de notificaciones completada!');
    console.log('\n💡 Para recibir emails reales:');
    console.log('   1. Configura RESEND_API_KEY en tu archivo .env');
    console.log('   2. Los emails llegarán a it360tecnologia@gmail.com');
    console.log('   3. Cada ticket nuevo generará una notificación automática');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailNotifications(); 