import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      nombre,
      email,
      telefono,
      tipo = 'consulta',
      categoria = 'producto',
      asunto,
      descripcion,
      urgencia = 'normal',
      prioridad = 'media',
      empresa,
      servicio,
      mensaje
    } = body;

    // Validar campos requeridos
    if (!nombre || !email || !asunto || !descripcion) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email, asunto, descripcion' },
        { status: 400 }
      );
    }

    // Generar número de ticket único
    const ticketCount = await prisma.ticket.count();
    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(ticketCount + 1).padStart(4, '0')}`;

    // Crear el ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre,
        email,
        telefono,
        tipo,
        categoria,
        asunto,
        descripcion,
        urgencia,
        prioridad,
        estado: 'abierto',
        empresa,
        servicio,
        mensaje
      }
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        asunto: ticket.asunto,
        estado: ticket.estado,
        createdAt: ticket.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
