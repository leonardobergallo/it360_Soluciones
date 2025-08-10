const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function testResendEmails() {
  try {
    console.log('📧 Probando envío de emails con Resend...\n');

    // Verificar configuración
    console.log('🔧 Configuración:');
    console.log(`   • RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   • IT360_EMAIL: ${process.env.IT360_EMAIL || 'it360tecnologia@gmail.com'}`);
    console.log('');

    if (!process.env.RESEND_API_KEY) {
      console.log('❌ RESEND_API_KEY no configurada');
      console.log('💡 Ejecuta: node scripts/setup-resend-config.js');
      return;
    }

    // Obtener tickets recientes
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    console.log(`📦 Tickets encontrados: ${tickets.length}\n`);

    if (tickets.length === 0) {
      console.log('❌ No hay tickets para probar');
      return;
    }

    // Probar envío de email con el ticket más reciente
    const latestTicket = tickets[0];
    console.log(`🧪 Enviando email para ticket: ${latestTicket.ticketNumber}`);

    const emailData = {
      from: 'IT360 Soluciones <noreply@it360.com>',
      to: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
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

    // Enviar email real
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('❌ Error enviando email:', error);
      return;
    }

    console.log('✅ Email enviado exitosamente!');
    console.log(`   • ID del email: ${data.id}`);
    console.log(`   • Para: ${emailData.to}`);
    console.log(`   • Asunto: ${emailData.subject}`);
    console.log(`   • Ticket: ${latestTicket.ticketNumber}`);

    // Mostrar estadísticas
    console.log('\n📊 Estadísticas de tickets:');
    const ticketTypes = await prisma.ticket.groupBy({
      by: ['tipo'],
      _count: { tipo: true }
    });

    ticketTypes.forEach(type => {
      console.log(`   • ${type.tipo}: ${type._count.tipo}`);
    });

    console.log('\n🎉 Prueba completada!');
    console.log('📧 Revisa tu email en it360tecnologia@gmail.com');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testResendEmails(); 