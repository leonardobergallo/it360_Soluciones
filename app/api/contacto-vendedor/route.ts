import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Crear un nuevo contacto de vendedor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, mensaje } = body;

    // Validar campos requeridos
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
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
          message: `Consulta de Producto
Teléfono: ${telefono || 'No proporcionado'}
Mensaje: ${mensaje}

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
          message: `Consulta de Producto
Teléfono: ${telefono || 'No proporcionado'}
Mensaje: ${mensaje}`
        }
      });
    }

    // Log de la notificación
    console.log('📧 NUEVA CONSULTA DE PRODUCTO:');
    console.log('='.repeat(50));
    console.log(`👤 Nombre: ${nuevoContacto.name}`);
    console.log(`📧 Email: ${nuevoContacto.email}`);
    console.log(`📞 Teléfono: ${telefono || 'No proporcionado'}`);
    console.log(`📋 Mensaje: ${mensaje}`);
    console.log('='.repeat(50));
    console.log('📱 WhatsApp: +54 9 342 508-9906');
    console.log('📞 Teléfono: 3425089906');
    console.log('🌐 Web: www.it360.com.ar');

    return NextResponse.json({
      success: true,
      message: 'Consulta enviada correctamente',
      contacto: nuevoContacto
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las consultas de productos (solo para admin)
export async function GET() {
  try {
    const consultas = await prisma.contact.findMany({
      where: {
        message: {
          contains: 'Consulta de Producto'
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(consultas);
  } catch (error) {
    console.error('Error al obtener consultas de productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
