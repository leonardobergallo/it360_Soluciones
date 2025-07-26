import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los presupuestos
export async function GET() {
  try {
    const presupuestos = await prisma.presupuesto.findMany({
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

    // Crear el presupuesto en la base de datos
    const nuevoPresupuesto = await prisma.presupuesto.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        empresa: empresa || null,
        servicio,
        mensaje: mensaje || null,
        estado: 'pendiente'
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
        presupuesto,
        mensaje
      });
    } catch (emailError) {
      console.error('Error enviando email de notificación:', emailError);
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

    const presupuestoActualizado = await prisma.presupuesto.update({
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

    await prisma.presupuesto.delete({
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
