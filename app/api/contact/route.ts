import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Función para generar número de ticket único
function generateTicketNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CONT-${timestamp}-${random}`;
}

// GET: Listar todos los tickets de contacto
export async function GET() {
  const tickets = await prisma.ticket.findMany({ 
    where: { tipo: 'contacto' },
    orderBy: { createdAt: 'desc' } 
  });
  return NextResponse.json(tickets);
}

// POST: Crear un nuevo ticket de contacto
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    // Generar número de ticket único
    const ticketNumber = generateTicketNumber();

    // Crear ticket en lugar de contacto
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre: name,
        email,
        telefono: null,
        tipo: 'contacto',
        categoria: 'general',
        asunto: `Nuevo mensaje de contacto de ${name}`,
        descripcion: message,
        urgencia: 'normal',
        prioridad: 'media',
        estado: 'abierto'
      },
    });

    // Enviar notificación
    await enviarNotificacionTicket(ticket);

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      ticket
    });
  } catch (error) {
    console.error('Error creating contact ticket:', error);
    return NextResponse.json(
      { error: 'Error al crear ticket de contacto' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un ticket por id
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
  }
  await prisma.ticket.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// Función para enviar notificación del ticket
async function enviarNotificacionTicket(ticket: any) {
  console.log('🎫 NUEVO TICKET DE CONTACTO CREADO:');
  console.log('='.repeat(60));
  console.log(`🔢 Número: ${ticket.ticketNumber}`);
  console.log(`👤 Nombre: ${ticket.nombre}`);
  console.log(`📧 Email: ${ticket.email}`);
  console.log(`🏷️ Tipo: ${ticket.tipo}`);
  console.log(`📂 Categoría: ${ticket.categoria}`);
  console.log(`📝 Asunto: ${ticket.asunto}`);
  console.log(`📋 Descripción: ${ticket.descripcion}`);
  console.log(`⏰ Creado: ${ticket.createdAt}`);
  console.log('='.repeat(60));

  // Enviar email de notificación
  try {
    await enviarEmailTicket(ticket);
  } catch (emailError) {
    console.error('Error al enviar email del ticket:', emailError);
  }
}

// Función para enviar email del ticket
async function enviarEmailTicket(ticket: any) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email del ticket');
    console.log('Email que se enviaría:', { ticket });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <it360tecnologia@gmail.com>',
    to: ['it360tecnologia@gmail.com'], // Email principal de IT360
    subject: `🎫 Nuevo Ticket ${ticket.ticketNumber} - ${ticket.tipo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎫 Nuevo Ticket de Contacto</h1>
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
                <p style="margin: 0; color: #333; font-weight: bold;">${ticket.email}</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🏷️ Tipo</p>
                <p style="margin: 0; color: #333; font-weight: bold;">${ticket.tipo}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📂 Categoría</p>
                <p style="margin: 0; color: #333; font-weight: bold;">${ticket.categoria}</p>
              </div>
            </div>

            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📝 Asunto</p>
              <p style="margin: 0 0 15px 0; color: #333; font-weight: bold; font-size: 16px;">${ticket.asunto}</p>
            </div>

            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📋 Descripción</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; color: #666; font-style: italic; border-left: 4px solid #007bff;">
                ${ticket.descripcion.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${ticket.email}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📧 Responder por Email
            </a>
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, tengo un nuevo ticket de contacto ${ticket.ticketNumber} de ${ticket.nombre} (${ticket.email}). ¿Pueden ayudarme a responder?`)}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📱 Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }

  console.log('Email enviado:', data);
} 
