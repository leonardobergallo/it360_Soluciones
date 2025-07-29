import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPresupuestoNotification } from '@/lib/email-service';

// GET - Obtener todos los presupuestos
export async function GET() {
  try {
    const presupuestos = await prisma.ticket.findMany({
      where: {
        tipo: 'presupuesto'
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(presupuestos);
  } catch (error) {
    console.error('Error fetching presupuestos:', error);
    return NextResponse.json(
      { error: 'Error al obtener presupuestos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo presupuesto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio, presupuesto, mensaje } = body;

    // Validar campos requeridos
    if (!nombre || !email || !servicio) {
      return NextResponse.json(
        { error: 'Nombre, email y servicio son requeridos' },
        { status: 400 }
      );
    }

    // Generar número de ticket único
    const ticketNumber = `PRES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Crear el ticket de presupuesto en la base de datos
    const nuevoPresupuesto = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre,
        email,
        telefono: telefono || null,
        empresa: empresa || null,
        servicio: servicio || null,
        mensaje: mensaje || null,
        tipo: 'presupuesto',
        categoria: 'solicitud',
        asunto: `Solicitud de presupuesto - ${servicio}`,
        descripcion: `Solicitud de presupuesto para el servicio: ${servicio}${mensaje ? `\n\nMensaje: ${mensaje}` : ''}`,
        urgencia: 'normal',
        estado: 'abierto',
        prioridad: 'media'
      }
    });

    // Enviar email de notificación usando Gmail
    try {
      await sendPresupuestoNotification(nuevoPresupuesto);
      console.log('✅ Email de presupuesto enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de presupuesto:', emailError);
      // No fallar si el email no se envía
    }

    return NextResponse.json({
      success: true,
      message: 'Presupuesto enviado correctamente',
      presupuesto: nuevoPresupuesto
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating presupuesto:', error);
    return NextResponse.json(
      { error: 'Error al crear presupuesto' },
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
  presupuesto,
  mensaje
}: {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  servicio: string;
  presupuesto?: number;
  mensaje?: string;
}) {
  // Aquí puedes integrar con tu servicio de email preferido
  // Por ahora solo logueamos la información
  console.log('📧 NUEVO PRESUPUESTO RECIBIDO:');
  console.log('='.repeat(50));
  console.log(`👤 Nombre: ${nombre}`);
  console.log(`📧 Email: ${email}`);
  console.log(`📞 Teléfono: ${telefono || 'No especificado'}`);
  console.log(`🏢 Empresa: ${empresa || 'No especificada'}`);
  console.log(`🔧 Servicio: ${servicio}`);
  console.log(`💰 Presupuesto: ${presupuesto ? `$${presupuesto.toLocaleString()}` : 'No especificado'}`);
  console.log(`💬 Mensaje: ${mensaje || 'No especificado'}`);
  console.log('='.repeat(50));
}

// PUT - Actualizar estado de un presupuesto
export async function PUT(request: NextRequest) {
  try {
    const { id, estado } = await request.json();
    
    if (!id || !estado) {
      return NextResponse.json(
        { error: 'ID y estado son requeridos' },
        { status: 400 }
      );
    }

    const presupuestoActualizado = await prisma.ticket.update({
      where: { id },
      data: { estado }
    });

    return NextResponse.json(presupuestoActualizado);
  } catch (error) {
    console.error('Error updating presupuesto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar presupuesto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un presupuesto
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
    console.error('Error deleting presupuesto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar presupuesto' },
      { status: 500 }
    );
  }
} 
