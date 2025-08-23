import { NextRequest, NextResponse } from 'next/server';
import { prisma, connectPrisma, disconnectPrisma } from '@/lib/prisma';
import { sendTicketNotification, sendClientConfirmation } from '@/lib/resend-service';

// Función para generar número de ticket único
function generateTicketNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TKT-${timestamp}-${random}`;
}

// GET - Obtener todos los tickets
export async function GET() {
  try {
    await connectPrisma();
    
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(tickets);
  } catch (error: unknown) {
    console.error('Error fetching tickets:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    if (errorMessage.includes('Engine is not yet connected') || 
        (error as { code?: string })?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al obtener tickets' },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
  }
}

// POST - Crear un nuevo ticket (unificado para todas las peticiones)
export async function POST(request: NextRequest) {
  try {
    await connectPrisma();
    
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

    console.log('🎫 NUEVO TICKET CREADO:');
    console.log('============================================================');
    console.log(`🔢 Número: ${nuevoTicket.ticketNumber}`);
    console.log(`👤 Nombre: ${nuevoTicket.nombre}`);
    console.log(`📧 Email: ${nuevoTicket.email}`);
    console.log(`📞 Teléfono: ${nuevoTicket.telefono || 'No especificado'}`);
    console.log(`🏢 Empresa: ${nuevoTicket.empresa || 'No especificada'}`);
    console.log(`🏷️ Tipo: ${nuevoTicket.tipo}`);
    console.log(`📂 Categoría: ${nuevoTicket.categoria}`);
    console.log(`📝 Asunto: ${nuevoTicket.asunto}`);
    console.log(`🚨 Urgencia: ${nuevoTicket.urgencia}`);
    console.log(`⭐ Prioridad: ${nuevoTicket.prioridad}`);
    console.log(`📋 Descripción: ${nuevoTicket.descripcion}`);
    console.log(`⏰ Creado: ${nuevoTicket.createdAt}`);
    console.log('============================================================');

    // Enviar notificaciones usando Resend
    try {
      // Notificación al administrador
      await sendTicketNotification(nuevoTicket);
      
      // Confirmación al cliente
      await sendClientConfirmation(nuevoTicket);
      
      console.log('✅ Notificaciones enviadas correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando notificaciones:', emailError);
      // No fallar la creación del ticket si falla el email
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket creado correctamente',
      ticket: nuevoTicket
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creando ticket:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    if (errorMessage.includes('Engine is not yet connected') || 
        (error as { code?: string })?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
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
