import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// Función para generar número de ticket único
function generateTicketNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TKT-${timestamp}-${random}`;
}

// GET - Obtener todos los tickets
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Error al obtener tickets' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo ticket (unificado para todas las peticiones)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      email, 
      telefono, 
      empresa, 
      tipo, 
      categoria, 
      asunto, 
      descripcion, 
      urgencia = 'normal',
      presupuesto 
    } = body;

    // Validar campos requeridos
    console.log('Datos recibidos:', { nombre, email, tipo, asunto, descripcion });
    
    if (!nombre || !email || !tipo || !asunto || !descripcion) {
      const camposFaltantes = [];
      if (!nombre) camposFaltantes.push('nombre');
      if (!email) camposFaltantes.push('email');
      if (!tipo) camposFaltantes.push('tipo');
      if (!asunto) camposFaltantes.push('asunto');
      if (!descripcion) camposFaltantes.push('descripcion');
      
      console.log('Campos faltantes:', camposFaltantes);
      
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` },
        { status: 400 }
      );
    }

    // Generar número de ticket único
    const ticketNumber = generateTicketNumber();

    // Determinar prioridad basada en urgencia
    let prioridad = 'media';
    if (urgencia === 'critica') prioridad = 'alta';
    else if (urgencia === 'alta') prioridad = 'alta';
    else if (urgencia === 'baja') prioridad = 'baja';

    // Crear el ticket en la base de datos
    const nuevoTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre,
        email,
        telefono: telefono || null,
        empresa: empresa || null,
        tipo,
        categoria: categoria || tipo,
        asunto,
        descripcion: presupuesto ? `${descripcion}\n\nPresupuesto estimado: $${presupuesto.toLocaleString()}` : descripcion,
        urgencia,
        prioridad,
        estado: 'abierto'
      }
    });

    // Enviar notificación
    await enviarNotificacionTicket(nuevoTicket);

    return NextResponse.json({
      success: true,
      message: 'Ticket creado correctamente',
      ticket: nuevoTicket
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Error al crear ticket' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado de un ticket
export async function PUT(request: NextRequest) {
  try {
    const { id, estado, asignadoA, notas } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (estado) dataToUpdate.estado = estado;
    if (asignadoA) dataToUpdate.asignadoA = asignadoA;
    if (notas) dataToUpdate.notas = notas;
    
    // Si se marca como resuelto, agregar timestamp
    if (estado === 'resuelto') {
      dataToUpdate.resueltoEn = new Date();
    }

    const ticketActualizado = await prisma.ticket.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json(ticketActualizado);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Error al actualizar ticket' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un ticket
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    await prisma.ticket.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { error: 'Error al eliminar ticket' },
      { status: 500 }
    );
  }
}

// Función para enviar notificación del ticket
async function enviarNotificacionTicket(ticket: any) {
  console.log('🎫 NUEVO TICKET CREADO:');
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

  // Enviar email de notificación
  try {
    await enviarEmailTicket(ticket);
  } catch (emailError) {
    console.error('Error al enviar email del ticket:', emailError);
  }
}

// Función para enviar email del ticket
async function enviarEmailTicket(ticket: any) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY no configurada, solo logueando email del ticket');
      console.log('Email que se enviaría:', { ticket });
      return;
    }

    const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <noreply@it360.com>',
    to: 'it360tecnologia@gmail.com', // Email principal de IT360
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
                <p style="margin: 0; color: #333; font-weight: bold;">${ticket.email}</p>
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

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🏷️ Tipo</p>
                <p style="margin: 0; color: #333; font-weight: bold;">${ticket.tipo}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">📂 Categoría</p>
                <p style="margin: 0; color: #333; font-weight: bold;">${ticket.categoria}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">🚨 Urgencia</p>
                <p style="margin: 0; color: #333; font-weight: bold; text-transform: capitalize;">${ticket.urgencia}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">⭐ Prioridad</p>
                <p style="margin: 0; color: #333; font-weight: bold; text-transform: capitalize;">${ticket.prioridad}</p>
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
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, tengo un nuevo ticket ${ticket.ticketNumber} de ${ticket.nombre} (${ticket.email}). Tipo: ${ticket.tipo}. ¿Pueden ayudarme a procesarlo?`)}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📱 Contactar por WhatsApp
            </a>
          </div>

          <div style="text-align: center; margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              ⏰ Creado: ${new Date(ticket.createdAt).toLocaleString('es-AR', { 
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error al enviar email del ticket:', error);
    throw error;
  }

  console.log('✅ Email del ticket enviado a it360tecnologia@gmail.com:', data);
  } catch (error) {
    console.error('Error al enviar email del ticket:', error);
  }
}
