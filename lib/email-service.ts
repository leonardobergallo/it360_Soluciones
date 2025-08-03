import nodemailer from 'nodemailer';

// Configuración del transportador de Gmail
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
};

// Interfaces para tipado
interface Presupuesto {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  servicio: string;
  mensaje?: string;
  ticketNumber?: string;
  estado?: string;
  createdAt: Date;
}

interface Contact {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

interface Venta {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  metodoPago: string;
  amount: number;
  status: string;
}

// Función para enviar notificación de nuevo presupuesto
export const sendPresupuestoNotification = async (presupuesto: Presupuesto) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_FROM,
      to: process.env.GMAIL_TO,
      subject: `🎯 NUEVO PRESUPUESTO - ${presupuesto.servicio}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🎯 Nuevo Presupuesto Solicitado</h1>
            <p style="margin: 10px 0 0 0;">IT360 - Sistema de Gestión</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">📋 Detalles del Cliente</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>👤 Nombre:</strong> ${presupuesto.nombre}</p>
              <p><strong>📧 Email:</strong> <a href="mailto:${presupuesto.email}">${presupuesto.email}</a></p>
              <p><strong>📱 Teléfono:</strong> ${presupuesto.telefono || 'No proporcionado'}</p>
              <p><strong>🏢 Empresa:</strong> ${presupuesto.empresa || 'No especificada'}</p>
            </div>
            
            <h2 style="color: #333;">🛠️ Servicio Solicitado</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>🔧 Servicio:</strong> ${presupuesto.servicio}</p>
              <p><strong>📝 Mensaje:</strong></p>
              <div style="background: #f1f3f4; padding: 10px; border-radius: 5px; margin-top: 5px;">
                ${presupuesto.mensaje || 'Sin mensaje adicional'}
              </div>
            </div>
            
            <h2 style="color: #333;">📅 Información del Ticket</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>🎫 Número de Ticket:</strong> ${presupuesto.ticketNumber || 'N/A'}</p>
              <p><strong>📊 Estado:</strong> <span style="background: #ffd700; padding: 2px 8px; border-radius: 3px;">${presupuesto.estado || 'Nuevo'}</span></p>
              <p><strong>📅 Fecha:</strong> ${new Date(presupuesto.createdAt).toLocaleString('es-AR')}</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3001/admin/presupuestos" 
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
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de presupuesto enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de presupuesto:', error);
    return false;
  }
};

// Función para enviar notificación de nuevo contacto
export const sendContactNotification = async (contact: Contact) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_FROM,
      to: process.env.GMAIL_TO,
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
              <a href="http://localhost:3001/admin/contacts" 
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
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de contacto enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de contacto:', error);
    return false;
  }
};

// Función para enviar notificación de nueva venta
export const sendVentaNotification = async (venta: Venta) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_FROM,
      to: process.env.GMAIL_TO,
      subject: `💰 NUEVA SOLICITUD DE VENTA - ${venta.nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">💰 Nueva Solicitud de Venta</h1>
            <p style="margin: 10px 0 0 0;">IT360 - Sistema de Gestión</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">👤 Información del Cliente</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>👤 Nombre:</strong> ${venta.nombre}</p>
              <p><strong>📧 Email:</strong> <a href="mailto:${venta.email}">${venta.email}</a></p>
              <p><strong>📱 Teléfono:</strong> ${venta.telefono || 'No proporcionado'}</p>
              <p><strong>📍 Dirección:</strong> ${venta.direccion || 'No proporcionada'}</p>
            </div>
            
            <h2 style="color: #333;">💳 Información de Pago</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>💳 Método de Pago:</strong> ${venta.metodoPago}</p>
              <p><strong>💰 Monto:</strong> $${venta.amount}</p>
              <p><strong>📊 Estado:</strong> <span style="background: #ffd700; padding: 2px 8px; border-radius: 3px;">${venta.status}</span></p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3001/admin/transferencias" 
                 style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                🔗 Habilitar Pago
              </a>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
              <p style="margin: 0; color: #1976d2;">
                <strong>💡 Tip:</strong> Ve al panel de transferencias para habilitar el método de pago solicitado.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de venta enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de venta:', error);
    return false;
  }
}; 