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
