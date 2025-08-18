const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando envío de email de contacto con Gmail...\n');

// Verificar configuración
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const IT360_EMAIL = process.env.IT360_EMAIL;

console.log('🔧 Configuración actual:');
console.log(`   • GMAIL_USER: ${GMAIL_USER || '❌ No configurado'}`);
console.log(`   • GMAIL_PASS: ${GMAIL_PASS ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   • IT360_EMAIL: ${IT360_EMAIL || '❌ No configurado'}`);
console.log('');

if (!GMAIL_USER || !GMAIL_PASS) {
  console.log('❌ Error: GMAIL_USER o GMAIL_PASS no configurados');
  console.log('💡 Para usar Gmail, necesitas:');
  console.log('   1. Activar la verificación en 2 pasos en tu cuenta de Gmail');
  console.log('   2. Generar una contraseña de aplicación');
  console.log('   3. Configurar GMAIL_PASS en .env.local');
  process.exit(1);
}

// Crear transporter de Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

async function testGmailContact() {
  try {
    console.log('📧 Enviando email de contacto de prueba con Gmail...');
    
    // Simular datos de un ticket de contacto
    const ticketData = {
      ticketNumber: 'TKT-042788-426',
      nombre: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      telefono: '+54 9 342 123-4567',
      empresa: 'Empresa Ejemplo S.A.',
      tipo: 'presupuesto',
      categoria: 'presupuesto',
      asunto: 'Solicitud de presupuesto - Servicio general',
      urgencia: 'normal',
      prioridad: 'media',
      descripcion: `Servicio solicitado: Desarrollo web
Empresa: Empresa Ejemplo S.A.
Teléfono: +54 9 342 123-4567
Mensaje: Necesitamos un sitio web para nuestra empresa con las siguientes características:
- Diseño moderno y responsive
- Panel de administración
- Integración con redes sociales
- Formulario de contacto
- Galería de productos

Por favor, envíenme un presupuesto detallado.

--- Creado desde formulario de contacto ---`,
      createdAt: new Date()
    };
    
    const mailOptions = {
      from: `IT360 Soluciones <${GMAIL_USER}>`,
      to: IT360_EMAIL,
      subject: `🎫 Nuevo Ticket ${ticketData.ticketNumber} - ${ticketData.tipo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎫 Nuevo Ticket Creado</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                🔢 Ticket: ${ticketData.ticketNumber}
              </h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">👤 Nombre</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.nombre}</p>
                </div>
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📧 Email</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">
                    <a href="mailto:${ticketData.email}" style="color: #007bff; text-decoration: none;">${ticketData.email}</a>
                  </p>
                </div>
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📞 Teléfono</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.telefono || 'No especificado'}</p>
                </div>
                <div>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🏢 Empresa</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.empresa || 'No especificada'}</p>
                </div>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin-top: 0;">📋 Detalles del Ticket</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">🏷️ Tipo</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.tipo}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">📂 Categoría</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.categoria}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">🚨 Urgencia</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.urgencia}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">⭐ Prioridad</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.prioridad}</p>
                  </div>
                </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">📝 Asunto</h3>
                <p style="margin: 0; color: #333; font-weight: bold;">${ticketData.asunto}</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">📋 Descripción</h3>
                <div style="background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #007bff;">
                  <p style="margin: 0; color: #333; white-space: pre-wrap;">${ticketData.descripcion}</p>
                </div>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⏰ Creado:</strong> ${new Date(ticketData.createdAt).toLocaleString('es-AR')}
                </p>
              </div>
              
              <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-top: 20px;">
                <p style="margin: 0; color: #155724; font-size: 14px;">
                  <strong>✅ Prueba exitosa con Gmail:</strong> Este email confirma que el sistema de notificaciones de contacto funciona correctamente usando Gmail.
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email de contacto enviado exitosamente con Gmail!');
    console.log(`   • Message ID: ${info.messageId}`);
    console.log(`   • Para: ${IT360_EMAIL}`);
    console.log(`   • Desde: ${GMAIL_USER}`);
    console.log('\n🎉 ¡El sistema de emails de contacto funciona correctamente con Gmail!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Los emails de contacto ahora llegarán a it360tecnologia@gmail.com');
    console.log('   2. Reinicia el servidor si está corriendo');
    console.log('   3. Prueba el formulario de contacto en la web');
    console.log('\n⚠️  Nota: Usando Gmail como alternativa a Resend');

  } catch (error) {
    console.error('❌ Error enviando email con Gmail:', error);
    console.log('\n💡 Para configurar Gmail:');
    console.log('   1. Ve a tu cuenta de Gmail');
    console.log('   2. Activa la verificación en 2 pasos');
    console.log('   3. Genera una contraseña de aplicación');
    console.log('   4. Configura GMAIL_PASS en .env.local');
  }
}

testGmailContact();
