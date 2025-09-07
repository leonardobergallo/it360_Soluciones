import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener ticket por número o ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber } = await params;

    if (!ticketNumber) {
      return NextResponse.json(
        { error: 'Número de ticket o ID requerido' },
        { status: 400 }
      );
    }

    // Intentar buscar por ID primero (UUID), luego por ticketNumber
    let ticket;
    
    // Si parece un UUID (36 caracteres con guiones), buscar por ID
    if (ticketNumber.length === 36 && ticketNumber.includes('-')) {
      ticket = await prisma.ticket.findUnique({
        where: { id: ticketNumber }
      });
    } else {
      // Si no, buscar por ticketNumber
      ticket = await prisma.ticket.findUnique({
        where: { ticketNumber }
      });
    }

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);

  } catch (error) {
    console.error('Error al obtener ticket:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH - Actualizar ticket por número o ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber } = await params;
    const body = await request.json();
    
    if (!ticketNumber) {
      return NextResponse.json(
        { error: 'Número de ticket o ID requerido' },
        { status: 400 }
      );
    }

    // Determinar si es ID o ticketNumber
    let whereClause;
    if (ticketNumber.length === 36 && ticketNumber.includes('-')) {
      whereClause = { id: ticketNumber };
    } else {
      whereClause = { ticketNumber };
    }

    // Verificar que el ticket existe
    const existingTicket = await prisma.ticket.findUnique({
      where: whereClause
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar
    const dataToUpdate: any = {};
    
    if (body.estado) {
      dataToUpdate.estado = body.estado;
    }
    
    if (body.notas) {
      // Si ya hay notas, agregar las nuevas
      if (existingTicket.notas) {
        dataToUpdate.notas = `${existingTicket.notas}\n\n${body.notas}`;
      } else {
        dataToUpdate.notas = body.notas;
      }
    }
    
    if (body.asignadoA) {
      dataToUpdate.asignadoA = body.asignadoA;
    }
    
    if (body.prioridad) {
      dataToUpdate.prioridad = body.prioridad;
    }
    
    if (body.urgencia) {
      dataToUpdate.urgencia = body.urgencia;
    }

    // Si se marca como resuelto, agregar timestamp
    if (body.estado === 'resuelto' || body.estado === 'cerrado' || body.estado === 'rechazado') {
      dataToUpdate.resueltoEn = new Date();
    }

    // Actualizar el ticket
    const ticketActualizado = await prisma.ticket.update({
      where: whereClause,
      data: dataToUpdate
    });

    console.log(`✅ Ticket ${ticketNumber} actualizado:`, {
      estado: ticketActualizado.estado,
      notas: ticketActualizado.notas ? 'Actualizadas' : 'Sin notas'
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket actualizado correctamente',
      ticket: ticketActualizado
    });

  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el ticket' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar ticket por número o ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber } = await params;

    if (!ticketNumber) {
      return NextResponse.json(
        { error: 'Número de ticket o ID requerido' },
        { status: 400 }
      );
    }

    // Determinar si es ID o ticketNumber
    let whereClause;
    if (ticketNumber.length === 36 && ticketNumber.includes('-')) {
      whereClause = { id: ticketNumber };
    } else {
      whereClause = { ticketNumber };
    }

    // Verificar que el ticket existe
    const existingTicket = await prisma.ticket.findUnique({
      where: whereClause
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el ticket
    await prisma.ticket.delete({
      where: whereClause
    });

    console.log(`✅ Ticket ${ticketNumber} eliminado`);

    return NextResponse.json({
      success: true,
      message: 'Ticket eliminado correctamente'
    });

  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el ticket' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
