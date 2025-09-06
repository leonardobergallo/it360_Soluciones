import { Resend } from 'resend';

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Interfaces para tipado
interface Ticket {
  ticketNumber: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: string;
  categoria: string;
  asunto: string;
  urgencia: string;
  prioridad: string;
  descripcion: string;
  createdAt: Date;
}

interface Contact {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

// Función para enviar notificación de nuevo ticket
export const sendTicketNotification = async (ticket: Ticket) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
      to: [process.env.IT360_EMAIL || 'it360tecnologia@gmail.com', ticket.email],
      subject: `🎫 NUEVO TICKET - ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🎫 Nuevo Ticket Creado</h1>
            <p style="margin: 10px 0 0 0;">IT360 - Sistema de Gestión</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">📋 Detalles del Cliente</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>🎫 Número de Ticket:</strong> ${ticket.ticketNumber}</p>
              <p><strong>👤 Nombre:</strong> ${ticket.nombre}</p>
              <p><strong>📧 Email:</strong> <a href="mailto:${ticket.email}">${ticket.email}</a></p>
              <p><strong>📱 Teléfono:</strong> ${ticket.telefono || 'No proporcionado'}</p>
            </div>
            
            <h2 style="color: #333;">📝 Información del Ticket</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>🏷️ Tipo:</strong> ${ticket.tipo}</p>
              <p><strong>📂 Categoría:</strong> ${ticket.categoria}</p>
              <p><strong>📝 Asunto:</strong> ${ticket.asunto}</p>
              <p><strong>🚨 Urgencia:</strong> <span style="background: #ffd700; padding: 2px 8px; border-radius: 3px;">${ticket.urgencia}</span></p>
              <p><strong>⭐ Prioridad:</strong> <span style="background: #ffd700; padding: 2px 8px; border-radius: 3px;">${ticket.prioridad}</span></p>
            </div>
            
            <h2 style="color: #333;">💬 Descripción</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                ${ticket.descripcion}
              </div>
            </div>
            
            <h2 style="color: #333;">📅 Información Temporal</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>📅 Fecha de Creación:</strong> ${new Date(ticket.createdAt).toLocaleString('es-AR')}</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000/admin/tickets" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                🔗 Ver en Panel de Administración
              </a>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
              <p style="margin: 0; color: #1976d2;">
                <strong>💡 Tip:</strong> Puedes responder directamente a este email para contactar al cliente.
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error enviando email de ticket:', error);
      return false;
    }

    console.log('✅ Email de ticket enviado:', data);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de ticket:', error);
    return false;
  }
};

// Función para enviar notificación de nuevo contacto
export const sendContactNotification = async (contact: Contact) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
      to: [process.env.IT360_EMAIL || 'it360tecnologia@gmail.com'],
      subject: `📧 NUEVA CONSULTA - ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">📧 Nueva Consulta Recibida</h1>
            <p style="margin: 10px 0 0 0;">IT360 - Sistema de Gestión</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">👤 Información del Cliente</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>👤 Nombre:</strong> ${contact.name}</p>
              <p><strong>📧 Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
              <p><strong>📅 Fecha:</strong> ${new Date(contact.createdAt).toLocaleString('es-AR')}</p>
            </div>
            
            <h2 style="color: #333;">💬 Mensaje</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                ${contact.message}
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000/admin/contacts" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                🔗 Ver en Panel de Administración
              </a>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
              <p style="margin: 0; color: #1976d2;">
                <strong>💡 Tip:</strong> Puedes responder directamente a este email para contactar al cliente.
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error enviando email de contacto:', error);
      return false;
    }

    console.log('✅ Email de contacto enviado:', data);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de contacto:', error);
    return false;
  }
};

// Función para enviar email de confirmación al cliente
export const sendClientConfirmation = async (ticket: Ticket) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
      to: [ticket.email],
      subject: `🎫 Ticket Creado - ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🎫 Ticket Creado Exitosamente</h1>
            <p style="margin: 10px 0 0 0;">IT360 - Tecnología y Soluciones</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">✅ Confirmación</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p>Hola <strong>${ticket.nombre}</strong>,</p>
              <p>Hemos recibido tu solicitud y hemos creado un ticket para darle seguimiento.</p>
            </div>
            
            <h2 style="color: #333;">📋 Detalles del Ticket</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>🎫 Número de Ticket:</strong> ${ticket.ticketNumber}</p>
              <p><strong>📝 Asunto:</strong> ${ticket.asunto}</p>
              <p><strong>🏷️ Tipo:</strong> ${ticket.tipo}</p>
              <p><strong>📂 Categoría:</strong> ${ticket.categoria}</p>
              <p><strong>🚨 Urgencia:</strong> ${ticket.urgencia}</p>
              <p><strong>⭐ Prioridad:</strong> ${ticket.prioridad}</p>
            </div>
            
            <h2 style="color: #333;">💬 Tu Mensaje</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                ${ticket.descripcion}
              </div>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #1976d2; margin-top: 0;">📞 Próximos Pasos</h3>
              <p style="margin: 0; color: #1976d2;">
                Nuestro equipo técnico revisará tu solicitud y te contactaremos pronto para brindarte la mejor solución.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000" 
                 style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                🌐 Visitar Nuestro Sitio
              </a>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
              <p style="margin: 0; color: #856404;">
                <strong>📧 Contacto:</strong> Si tienes alguna pregunta, no dudes en contactarnos a ${process.env.IT360_EMAIL || 'it360tecnologia@gmail.com'}
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error enviando confirmación al cliente:', error);
      return false;
    }

    console.log('✅ Confirmación enviada al cliente:', data);
    return true;
  } catch (error) {
    console.error('❌ Error enviando confirmación al cliente:', error);
    return false;
  }
};
