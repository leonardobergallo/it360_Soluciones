import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactNotification } from '@/lib/email-service';

// Función para generar número de ticket único
function generateTicketNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TKT-${timestamp}-${random}`;
}

// GET - Obtener todos los contactos
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Error al obtener contactos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo contacto y ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio, mensaje } = body;

    // Validar campos requeridos
    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const contactoExistente = await prisma.contact.findUnique({
      where: { email }
    });

    let nuevoContacto;

    if (contactoExistente) {
      // Si el email ya existe, actualizar el mensaje
      nuevoContacto = await prisma.contact.update({
        where: { email },
        data: {
          name: nombre, // Actualizar el nombre también
          message: `Servicio solicitado: ${servicio || 'No especificado'}
Empresa: ${empresa || 'No especificada'}
Teléfono: ${telefono || 'No especificado'}
Mensaje: ${mensaje || 'Sin mensaje adicional'}

--- Mensaje anterior ---
${contactoExistente.message}`
        }
      });
    } else {
      // Si el email no existe, crear nuevo contacto
      nuevoContacto = await prisma.contact.create({
        data: {
          name: nombre,
          email,
          message: `Servicio solicitado: ${servicio || 'No especificado'}
Empresa: ${empresa || 'No especificada'}
Teléfono: ${telefono || 'No especificado'}
Mensaje: ${mensaje || 'Sin mensaje adicional'}`
        }
      });
    }

    // Crear ticket también para el sistema unificado
    const ticketNumber = generateTicketNumber();
    const nuevoTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre,
        email,
        telefono: telefono || null,
        empresa: empresa || null,
        tipo: 'presupuesto', // Tipo por defecto para contactos antiguos
        categoria: 'presupuesto',
        asunto: `Solicitud de presupuesto - ${servicio || 'Servicio general'}`,
        descripcion: `Servicio solicitado: ${servicio || 'No especificado'}
Empresa: ${empresa || 'No especificada'}
Teléfono: ${telefono || 'No especificado'}
Mensaje: ${mensaje || 'Sin mensaje adicional'}

--- Creado desde formulario de contacto ---`,
        urgencia: 'normal',
        prioridad: 'media',
        estado: 'abierto'
      }
    });

    // Enviar email de notificación (opcional)
    try {
      await enviarEmailNotificacion({
        nombre,
        email,
        telefono,
        empresa,
        servicio,
        mensaje
      });
    } catch (emailError) {
      console.error('Error enviando email de notificación:', emailError);
      // No fallar si el email no se envía
    }

    // Enviar email de notificación usando Gmail
    try {
      await sendContactNotification(nuevoContacto);
      console.log('✅ Email de contacto enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de contacto:', emailError);
      // No fallar si el email no se envía
    }

    // Enviar notificación del ticket
    await enviarNotificacionTicket(nuevoTicket);

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      contacto: nuevoContacto,
      ticket: nuevoTicket
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Error al enviar solicitud' },
      { status: 500 }
    );
  }
}

// Función para enviar email de notificación
async function enviarEmailNotificacion({
  nombre,
  email,
  telefono,
  empresa,
  servicio,
  mensaje
}: {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  servicio?: string;
  mensaje?: string;
}) {
  // Aquí puedes integrar con tu servicio de email preferido
  // Por ahora solo logueamos la información
  console.log('📧 NUEVA SOLICITUD RECIBIDA:');
  console.log('='.repeat(50));
  console.log(`👤 Nombre: ${nombre}`);
  console.log(`📧 Email: ${email}`);
  console.log(`📞 Teléfono: ${telefono || 'No proporcionado'}`);
  console.log(`🏢 Empresa: ${empresa || 'No proporcionada'}`);
  console.log(`🔧 Servicio: ${servicio || 'No especificado'}`);
  console.log(`💬 Mensaje: ${mensaje || 'Sin mensaje'}`);
  console.log('='.repeat(50));
  console.log('📱 WhatsApp: +54 9 342 508-9906');
  console.log('📞 Teléfono: 3425089906');
  console.log('🌐 Web: www.it360.com.ar');
}

// Función para enviar notificación del ticket
async function enviarNotificacionTicket(ticket: {
  ticketNumber: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  empresa?: string | null;
  tipo: string;
  categoria: string;
  asunto: string;
  urgencia: string;
  prioridad: string;
  descripcion: string;
  createdAt: Date;
}) {
  // Intentar primero con Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: 'IT360 Soluciones <onboarding@resend.dev>',
        to: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
        subject: `🎫 Nuevo Ticket ${ticket.ticketNumber} - ${ticket.tipo}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🎫 Nuevo Ticket Creado</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                  🔢 Ticket: ${ticket.ticketNumber}
                </h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">👤 Nombre</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticket.nombre}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📧 Email</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">
                      <a href="mailto:${ticket.email}" style="color: #007bff; text-decoration: none;">${ticket.email}</a>
                    </p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📞 Teléfono</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticket.telefono || 'No especificado'}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🏢 Empresa</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticket.empresa || 'No especificada'}</p>
                  </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📝 Asunto</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">${ticket.asunto}</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📋 Descripción</p>
                  <p style="margin: 0; color: #333; white-space: pre-line;">${ticket.descripcion}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                  <div style="text-align: center; padding: 10px; background: #e3f2fd; border-radius: 6px;">
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🏷️ Tipo</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticket.tipo}</p>
                  </div>
                  <div style="text-align: center; padding: 10px; background: #fff3e0; border-radius: 6px;">
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🚨 Urgencia</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticket.urgencia}</p>
                  </div>
                  <div style="text-align: center; padding: 10px; background: #e8f5e8; border-radius: 6px;">
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">⭐ Prioridad</p>
                    <p style="margin: 0; color: #333; font-weight: bold;">${ticket.prioridad}</p>
                  </div>
                </div>
                
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 6px;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">📅 Creado el ${ticket.createdAt.toLocaleString('es-AR')}</p>
                  <div style="display: flex; justify-content: center; gap: 15px;">
                    <a href="https://wa.me/5493425089906" style="background: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                      📱 WhatsApp
                    </a>
                    <a href="tel:3425089906" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                      📞 Llamar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      });

      if (error) {
        console.error('❌ Error con Resend:', error);
        throw error; // Intentar con Gmail
      }

      console.log('✅ Email enviado con Resend');
      return;
      
    } catch (resendError) {
      console.log('⚠️ Resend falló, intentando con Gmail...');
    }
  }

  // Fallback a Gmail
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
        subject: `🎫 Nuevo Ticket ${ticket.ticketNumber} - ${ticket.tipo}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">🎫 Nuevo Ticket Creado</h2>
            <p><strong>Número:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Nombre:</strong> ${ticket.nombre}</p>
            <p><strong>Email:</strong> ${ticket.email}</p>
            <p><strong>Teléfono:</strong> ${ticket.telefono || 'No especificado'}</p>
            <p><strong>Empresa:</strong> ${ticket.empresa || 'No especificada'}</p>
            <p><strong>Tipo:</strong> ${ticket.tipo}</p>
            <p><strong>Asunto:</strong> ${ticket.asunto}</p>
            <p><strong>Descripción:</strong></p>
            <p style="white-space: pre-line;">${ticket.descripcion}</p>
            <hr>
            <p><strong>Creado:</strong> ${ticket.createdAt.toLocaleString('es-AR')}</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email enviado con Gmail');
      return;
      
    } catch (gmailError) {
      console.error('❌ Error con Gmail:', gmailError);
    }
  }

  // Si ambos fallan, solo loguear
  console.log('⚠️ No se pudo enviar email, solo logueando ticket');
  console.log('🎫 NUEVO TICKET CREADO DESDE CONTACTO:');
  console.log('='.repeat(60));
  console.log(`🔢 Número: ${ticket.ticketNumber}`);
  console.log(`👤 Nombre: ${ticket.nombre}`);
  console.log(`📧 Email: ${ticket.email}`);
  console.log(`📞 Teléfono: ${ticket.telefono || 'No especificado'}`);
  console.log(`🏢 Empresa: ${ticket.empresa || 'No especificada'}`);
  console.log(`🏷️ Tipo: ${ticket.tipo}`);
  console.log(`📂 Categoría: ${ticket.categoria}`);
  console.log(`📝 Asunto: ${ticket.asunto}`);
  console.log(`🚨 Urgencia: ${ticket.urgencia}`);
  console.log(`⭐ Prioridad: ${ticket.prioridad}`);
  console.log(`📋 Descripción: ${ticket.descripcion}`);
  console.log(`⏰ Creado: ${ticket.createdAt}`);
  console.log('='.repeat(60));
} 
