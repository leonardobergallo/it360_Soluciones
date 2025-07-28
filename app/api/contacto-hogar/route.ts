import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para generar número de ticket único
function generateTicketNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HOGAR-${timestamp}-${random}`;
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

    // Crear ticket en lugar de presupuesto
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre,
        email,
        telefono: telefono || null,
        empresa: tipoConsulta || 'Hogar Inteligente',
        servicio: 'Hogar Inteligente',
        mensaje,
        tipo: 'presupuesto',
        categoria: 'hogar-inteligente',
        asunto: `Consulta de Hogar Inteligente - ${tipoConsulta || 'General'}`,
        descripcion: mensaje,
        urgencia: 'normal',
        prioridad: 'media',
        estado: 'abierto'
      },
    });

    // Log de la notificación
    console.log('🎫 NUEVO TICKET DE HOGAR INTELIGENTE CREADO:');
    console.log('='.repeat(60));
    console.log(`🔢 Número: ${ticket.ticketNumber}`);
    console.log(`👤 Nombre: ${ticket.nombre}`);
    console.log(`📧 Email: ${ticket.email}`);
    console.log(`📞 Teléfono: ${ticket.telefono || 'No proporcionado'}`);
    console.log(`🏷️ Tipo: ${ticket.tipo}`);
    console.log(`📂 Categoría: ${ticket.categoria}`);
    console.log(`📝 Asunto: ${ticket.asunto}`);
    console.log(`📋 Descripción: ${ticket.descripcion}`);
    console.log('='.repeat(60));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Consulta enviada con éxito',
        ticket 
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
    const consultas = await prisma.ticket.findMany({
      where: {
        tipo: 'presupuesto',
        categoria: 'hogar-inteligente',
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
