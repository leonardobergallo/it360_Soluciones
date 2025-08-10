// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

console.log('📧 Probando envío de email con Resend...\n');

// Verificar configuración
console.log('🔧 Configuración:');
console.log(`   • RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   • IT360_EMAIL: ${process.env.IT360_EMAIL || 'it360tecnologia@gmail.com'}`);
console.log('');

if (!process.env.RESEND_API_KEY) {
  console.log('❌ RESEND_API_KEY no configurada');
  return;
}

// Crear instancia de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('🧪 Enviando email de prueba...');

    const { data, error } = await resend.emails.send({
      from: 'IT360 Soluciones <noreply@it360.com>',
      to: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
      subject: '🧪 Email de Prueba - IT360 Soluciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🧪 Email de Prueba</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                ✅ Sistema de Emails Funcionando
              </h2>
              
              <p style="color: #666; line-height: 1.6;">
                ¡Hola! Este es un email de prueba para verificar que el sistema de notificaciones 
                de IT360 Soluciones está funcionando correctamente con Resend.
              </p>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin-top: 0;">📧 Emails que recibirás automáticamente:</h3>
                <ul style="color: #1976d2; margin: 0; padding-left: 20px;">
                  <li>🎫 Nuevos tickets de soporte</li>
                  <li>🎯 Nuevos presupuestos solicitados</li>
                  <li>📧 Nuevas consultas de contacto</li>
                  <li>💰 Nuevas solicitudes de venta</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                <strong>Fecha de prueba:</strong> ${new Date().toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error enviando email:', error);
      return;
    }

    console.log('✅ Email enviado exitosamente!');
    console.log(`   • ID del email: ${data.id}`);
    console.log(`   • Para: ${process.env.IT360_EMAIL || 'it360tecnologia@gmail.com'}`);
    console.log(`   • Asunto: 🧪 Email de Prueba - IT360 Soluciones`);

    console.log('\n🎉 ¡Prueba completada!');
    console.log('📧 Revisa tu email en it360tecnologia@gmail.com');
    console.log('\n💡 Ahora todos los tickets, presupuestos y consultas se enviarán automáticamente a tu email.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmail(); 