import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Función para generar número de ticket único
function generateTicketNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TKT-${timestamp}-${random}`;
}

// POST - Crear una nueva consulta de Hogar Inteligente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, mensaje, tipoConsulta } = body;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Generar número de ticket único
    const ticketNumber = generateTicketNumber();

    // Crear contacto en lugar de ticket
    const contacto = await prisma.contact.create({
      data: {
        name: nombre,
        email,
        message: `Consulta de Hogar Inteligente
Tipo de consulta: ${tipoConsulta || 'General'}
Teléfono: ${telefono || 'No proporcionado'}
Mensaje: ${mensaje}`
      },
    });

    // Crear ticket también para el sistema unificado
    const nuevoTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre,
        email,
        telefono: telefono || null,
        empresa: null,
        tipo: 'hogar-inteligente',
        categoria: 'hogar-inteligente',
        asunto: `Consulta de Hogar Inteligente - ${tipoConsulta || 'General'}`,
        descripcion: `Tipo de consulta: ${tipoConsulta || 'General'}
Teléfono: ${telefono || 'No proporcionado'}
Mensaje: ${mensaje}

--- Creado desde formulario de Hogar Inteligente ---`,
        urgencia: 'normal',
        prioridad: 'media',
        estado: 'abierto'
      }
    });

    // Log de la notificación
    console.log('📧 NUEVA CONSULTA DE HOGAR INTELIGENTE:');
    console.log('='.repeat(60));
    console.log(`👤 Nombre: ${contacto.name}`);
    console.log(`📧 Email: ${contacto.email}`);
    console.log(`📞 Teléfono: ${telefono || 'No proporcionado'}`);
    console.log(`🏷️ Tipo: ${tipoConsulta || 'General'}`);
    console.log(`📋 Mensaje: ${mensaje}`);
    console.log('='.repeat(60));

    // Enviar notificación del ticket
    await enviarNotificacionTicket(nuevoTicket);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Consulta enviada con éxito',
        contacto,
        ticket: nuevoTicket
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al procesar consulta de Hogar Inteligente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las consultas de Hogar Inteligente (solo para admin)
export async function GET() {
  try {
    const consultas = await prisma.contact.findMany({
      where: {
        message: {
          contains: 'Consulta de Hogar Inteligente'
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(consultas);
  } catch (error) {
    console.error('Error al obtener consultas de Hogar Inteligente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
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
  console.log('🎫 NUEVO TICKET DE HOGAR INTELIGENTE CREADO:');
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
