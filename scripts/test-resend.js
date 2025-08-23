require('dotenv').config({ path: '.env' });
const { Resend } = require('resend');

async function testResend() {
  try {
    console.log('🧪 Probando Resend con nueva API key...\n');

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log(`📧 API Key: ${process.env.RESEND_API_KEY ? 'Configurada' : 'NO CONFIGURADA'}`);
    console.log(`📧 Email destino: ${process.env.IT360_EMAIL || 'it360tecnologia@gmail.com'}`);

    if (!process.env.RESEND_API_KEY) {
      console.log('❌ RESEND_API_KEY no configurada');
      return;
    }

    console.log('\n📤 Enviando email de prueba...');
    
    const { data, error } = await resend.emails.send({
      from: 'IT360 Soluciones <onboarding@resend.dev>',
      to: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
      subject: '🧪 Prueba Resend - IT360 Soluciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">✅ Prueba de Resend Exitosa</h2>
          <p>Este es un email de prueba para verificar que Resend está funcionando correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
          <p><strong>Servidor:</strong> IT360 Soluciones</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Si recibes este email, significa que Resend está configurado correctamente y los formularios de contacto funcionarán.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error con Resend:', error);
      return;
    }

    console.log('✅ Email enviado exitosamente con Resend!');
    console.log(`📧 Message ID: ${data.id}`);
    console.log(`📤 Enviado a: ${process.env.IT360_EMAIL || 'it360tecnologia@gmail.com'}`);
    
    console.log('\n🎉 Resend configurado correctamente!');
    console.log('💡 Ahora los formularios de contacto enviarán emails a través de Resend');

  } catch (error) {
    console.error('❌ Error probando Resend:', error.message);
  }
}

testResend();
