import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// Función para enviar email del ticket (solo log, sin Resend)
async function enviarEmailTicket(ticket: any) {
  console.log('📧 TICKET CREADO - Email que se enviaría:');
  console.log('='.repeat(60));
  console.log(`🔢 Número: ${ticket.ticketNumber}`);
  console.log(`👤 Nombre: ${ticket.nombre}`);
  console.log(`📧 Email: ${ticket.email}`);
  console.log(`📝 Asunto: ${ticket.asunto}`);
  console.log(`📋 Descripción: ${ticket.descripcion}`);
  console.log('='.repeat(60));
  console.log('💡 Los tickets se almacenan en la base de datos y se pueden ver en el panel de administración');
} 
