require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function setupGmail() {
  console.log('🔧 Configurando Gmail para envío de emails...\n');

  // Verificar variables de entorno
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  console.log(`📧 Gmail User: ${gmailUser}`);
  console.log(`🔑 Gmail Pass: ${gmailPass ? 'Configurada' : 'NO CONFIGURADA'}`);

  if (!gmailUser || !gmailPass) {
    console.log('\n❌ Gmail no está configurado correctamente');
    console.log('\n📋 Pasos para configurar Gmail:');
    console.log('   1. Ve a https://myaccount.google.com/');
    console.log('   2. Inicia sesión con it360tecnologia@gmail.com');
    console.log('   3. Ve a "Seguridad" → "Verificación en 2 pasos"');
    console.log('   4. Activa la verificación en 2 pasos');
    console.log('   5. Ve a "Contraseñas de aplicación"');
    console.log('   6. Genera una contraseña para "Correo"');
    console.log('   7. Copia la contraseña generada');
    console.log('   8. Actualiza .env.local con:');
    console.log('      GMAIL_PASS=tu_contraseña_generada');
    return;
  }

  try {
    // Crear transportador
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    // Verificar conexión
    console.log('\n🔍 Verificando conexión con Gmail...');
    await transporter.verify();
    console.log('✅ Conexión con Gmail exitosa');

    // Enviar email de prueba
    console.log('\n📤 Enviando email de prueba...');
    
    const mailOptions = {
      from: gmailUser,
      to: 'it360tecnologia@gmail.com',
      subject: '🧪 Prueba de Email - IT360 Soluciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">✅ Email de Prueba Exitoso</h2>
          <p>Este es un email de prueba para verificar que Gmail está configurado correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
          <p><strong>Servidor:</strong> IT360 Soluciones</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Si recibes este email, significa que el sistema de notificaciones está funcionando correctamente.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de prueba enviado exitosamente');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📤 Enviado a: ${mailOptions.to}`);

    console.log('\n🎉 Gmail configurado correctamente!');
    console.log('💡 Ahora los formularios de contacto enviarán emails a través de Gmail');

  } catch (error) {
    console.error('❌ Error configurando Gmail:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Posibles soluciones:');
      console.log('   1. Verifica que la contraseña de aplicación sea correcta');
      console.log('   2. Asegúrate de que la verificación en 2 pasos esté activada');
      console.log('   3. Genera una nueva contraseña de aplicación');
      console.log('   4. Verifica que el email sea correcto');
    }
  }
}

setupGmail();
