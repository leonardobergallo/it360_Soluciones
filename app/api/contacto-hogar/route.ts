import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Log de la notificación
    console.log('📧 NUEVA CONSULTA DE HOGAR INTELIGENTE:');
    console.log('='.repeat(60));
    console.log(`👤 Nombre: ${contacto.name}`);
    console.log(`📧 Email: ${contacto.email}`);
    console.log(`📞 Teléfono: ${telefono || 'No proporcionado'}`);
    console.log(`🏷️ Tipo: ${tipoConsulta || 'General'}`);
    console.log(`📋 Mensaje: ${mensaje}`);
    console.log('='.repeat(60));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Consulta enviada con éxito',
        contacto 
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
