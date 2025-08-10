const { Resend } = require('resend');

console.log('📧 Probando envío de email con Resend...\n');

// Token directo de Resend
const RESEND_API_KEY = 're_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k';
const TEST_EMAIL = 'leonardobergallo@gmail.com'; // Email del usuario para prueba

console.log('🔧 Configuración:');
console.log(`   • RESEND_API_KEY: ✅ Configurada`);
console.log(`   • TEST_EMAIL: ${TEST_EMAIL}`);
console.log('');

// Crear instancia de Resend
const resend = new Resend(RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('🧪 Enviando email de prueba...');

    const { data, error } = await resend.emails.send({
      from: 'IT360 Soluciones <onboarding@resend.dev>', // Usar dominio por defecto de Resend
      to: TEST_EMAIL,
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
    console.log(`   • Para: ${TEST_EMAIL}`);
    console.log(`   • Asunto: 🧪 Email de Prueba - IT360 Soluciones`);

    console.log('\n🎉 ¡Prueba completada!');
    console.log('📧 Revisa tu email en leonardobergallo@gmail.com');
    console.log('\n💡 Para enviar a it360tecnologia@gmail.com necesitas:');
    console.log('   1. Verificar un dominio en https://resend.com/domains');
    console.log('   2. Usar un email con ese dominio como remitente');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmail(); 