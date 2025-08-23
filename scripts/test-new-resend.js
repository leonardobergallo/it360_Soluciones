const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando nueva configuración de Resend...\n');

// Verificar configuración
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const IT360_EMAIL = process.env.IT360_EMAIL;

console.log('🔧 Configuración actual:');
console.log(`   • RESEND_API_KEY: ${RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   • IT360_EMAIL: ${IT360_EMAIL || '❌ No configurado'}`);
console.log('');

if (!RESEND_API_KEY) {
  console.log('❌ Error: RESEND_API_KEY no configurada');
  process.exit(1);
}

if (!IT360_EMAIL) {
  console.log('❌ Error: IT360_EMAIL no configurado');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('📧 Enviando email de prueba...');
    
    const { data, error } = await resend.emails.send({
      from: 'IT360 Soluciones <onboarding@resend.dev>',
      to: IT360_EMAIL,
      subject: '✅ Configuración Resend Actualizada - IT360 Soluciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✅ Configuración Actualizada</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
                🎉 ¡Configuración Exitosa!
              </h2>
              
              <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
                <h3 style="color: #155724; margin-top: 0;">📧 Nueva Configuración de Resend</h3>
                <p style="color: #155724; margin: 0;">
                  <strong>API Key:</strong> ${RESEND_API_KEY.substring(0, 10)}...<br>
                  <strong>Email de destino:</strong> ${IT360_EMAIL}
                </p>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin-top: 0;">🎫 Notificaciones que recibirás:</h3>
                <ul style="color: #1976d2; margin: 0; padding-left: 20px;">
                  <li>Nuevos tickets de soporte técnico</li>
                  <li>Nuevas solicitudes de presupuesto</li>
                  <li>Consultas de contacto</li>
                  <li>Nuevas ventas y pedidos</li>
                  <li>Notificaciones del sistema</li>
                </ul>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                La configuración de Resend ha sido actualizada exitosamente. 
                A partir de ahora, todas las notificaciones del sistema IT360 
                llegarán a este email.
              </p>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>Fecha de configuración:</strong> ${new Date().toLocaleString('es-AR')}
                </p>
              </div>
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
    console.log(`   • Para: ${IT360_EMAIL}`);
    console.log(`   • API Key: ${RESEND_API_KEY.substring(0, 10)}...`);
    console.log('\n🎉 ¡La nueva configuración de Resend funciona correctamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Los tickets ahora llegarán a it360tecnologia@gmail.com');
    console.log('   2. Reinicia el servidor si está corriendo');
    console.log('   3. Prueba crear un ticket para verificar');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testEmail();
