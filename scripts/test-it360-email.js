import dotenv from 'dotenv';
import { Resend } from 'resend';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const IT360_EMAIL = process.env.IT360_EMAIL;

console.log('📧 Probando envío de email a IT360...\n');

console.log('🔧 Configuración:');
console.log(`   • RESEND_API_KEY: ${RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   • IT360_EMAIL: ${IT360_EMAIL || '❌ No configurado'}`);

if (!RESEND_API_KEY) {
  console.error('❌ Error: RESEND_API_KEY no configurada');
  process.exit(1);
}

if (!IT360_EMAIL) {
  console.error('❌ Error: IT360_EMAIL no configurado');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('\n🧪 Enviando email de prueba...');
    
    const { data, error } = await resend.emails.send({
      from: 'IT360 Soluciones <onboarding@resend.dev>',
      to: IT360_EMAIL,
      subject: '🎫 Prueba de Notificación - IT360 Soluciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🎫 Notificación de Ticket - IT360 Soluciones</h2>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">Nuevo Ticket Recibido</h3>
            <p><strong>Número de Ticket:</strong> TKT-874124-753</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
            <p><strong>Estado:</strong> Pendiente de revisión</p>
          </div>
          
          <div style="background-color: #ECFDF5; padding: 15px; border-radius: 8px; border-left: 4px solid #10B981;">
            <p style="margin: 0; color: #065F46;">
              <strong>✅ Configuración exitosa:</strong> Los emails ahora llegan a ${IT360_EMAIL}
            </p>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Este es un email de prueba para verificar que la configuración de notificaciones funciona correctamente.
          </p>
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
    console.log('\n🎉 ¡Prueba completada!');
    console.log(`📧 Revisa tu email en ${IT360_EMAIL}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmail();
