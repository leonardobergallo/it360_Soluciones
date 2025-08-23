require('dotenv').config();
const { Resend } = require('resend');

async function testResendEmail() {
  console.log('🧪 Probando envío de email con Resend...\n');

  // Verificar variables de entorno
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.IT360_EMAIL;

  if (!apiKey) {
    console.log('❌ RESEND_API_KEY no configurada');
    console.log('💡 Configura la variable de entorno RESEND_API_KEY');
    return;
  }

  if (!fromEmail) {
    console.log('❌ IT360_EMAIL no configurada');
    console.log('💡 Configura la variable de entorno IT360_EMAIL');
    return;
  }

  console.log('✅ Variables de entorno configuradas:');
  console.log(`   • API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`   • From Email: ${fromEmail}\n`);

  try {
    const resend = new Resend(apiKey);

    console.log('📧 Enviando email de prueba...');

    const { data, error } = await resend.emails.send({
      from: 'IT360 Soluciones <onboarding@resend.dev>', // Usar dominio por defecto de Resend
      to: [fromEmail], // Enviar al email configurado
      subject: '🧪 Prueba de Email - IT360 Soluciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🧪 Prueba de Email</h1>
            <p style="margin: 10px 0 0 0;">IT360 - Sistema de Gestión</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">✅ Configuración Exitosa</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>🎉 ¡Excelente!</strong> El sistema de emails está funcionando correctamente.</p>
              <p><strong>📧 Email de prueba enviado:</strong> ${new Date().toLocaleString('es-AR')}</p>
              <p><strong>🔧 Servicio:</strong> Resend</p>
              <p><strong>📧 Remitente:</strong> onboarding@resend.dev</p>
              <p><strong>📧 Destinatario:</strong> ${fromEmail}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #1976d2; margin-top: 0;">📋 Próximos Pasos</h3>
              <p style="margin: 0; color: #1976d2;">
                Ahora puedes recibir notificaciones automáticas cuando se creen tickets, contactos y otras actividades en el sistema.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000" 
                 style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                🌐 Ir al Sitio Web
              </a>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.log('❌ Error enviando email:');
      console.log('   • Código:', error.statusCode);
      console.log('   • Mensaje:', error.message);
      console.log('   • Nombre:', error.name);
      
      if (error.statusCode === 401) {
        console.log('\n💡 Solución: Verifica que la API key de Resend sea válida');
        console.log('   • Ve a https://resend.com/api-keys');
        console.log('   • Crea una nueva API key o verifica la existente');
      }
      
      if (error.statusCode === 403) {
        console.log('\n💡 Solución: El dominio de email no está verificado');
        console.log('   • Usando dominio por defecto de Resend: onboarding@resend.dev');
        console.log('   • Para usar tu propio dominio, verifícalo en https://resend.com/domains');
      }
      
      return;
    }

    console.log('✅ Email enviado exitosamente!');
    console.log('   • ID:', data?.id);
    console.log('   • Destinatario:', fromEmail);
    console.log('   • Fecha:', new Date().toLocaleString('es-AR'));
    
    console.log('\n🎉 ¡El sistema de emails está funcionando correctamente!');
    console.log('📧 Revisa tu bandeja de entrada para confirmar la recepción.');

  } catch (error) {
    console.log('❌ Error inesperado:', error.message);
  }
}

// Ejecutar la prueba
testResendEmail().catch(console.error);
