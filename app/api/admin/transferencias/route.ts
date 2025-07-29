import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET - Obtener todas las solicitudes de venta (transferencia bancaria y MercadoPago)
export async function GET(request: NextRequest) {
  try {
    // Verificar token de admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado - Solo administradores' },
        { status: 403 }
      );
    }

    // Obtener todas las solicitudes de venta (tickets de tipo "venta")
    const solicitudes = await prisma.ticket.findMany({
      where: {
        tipo: 'venta',
        estado: {
          in: ['abierto', 'en_proceso']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformar los datos para el frontend
    const solicitudesFormateadas = solicitudes.map(solicitud => ({
      id: solicitud.id,
      nombre: solicitud.nombre,
      email: solicitud.email,
      telefono: solicitud.telefono || 'No proporcionado',
      direccion: extraerDireccion(solicitud.descripcion),
      servicio: determinarMetodoPago(solicitud.descripcion),
      mensaje: solicitud.descripcion,
      estado: solicitud.estado,
      createdAt: solicitud.createdAt.toISOString(),
      total: extraerTotal(solicitud.descripcion),
      items: extraerItems(solicitud.descripcion)
    }));

    return NextResponse.json({
      success: true,
      solicitudes: solicitudesFormateadas
    });

  } catch (error) {
    console.error('Error al obtener solicitudes de venta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para extraer dirección del mensaje
function extraerDireccion(descripcion: string): string {
  const match = descripcion.match(/Dirección[:\s]+([^\n]+)/i);
  return match ? match[1].trim() : 'No especificada';
}

// Función para determinar método de pago
function determinarMetodoPago(descripcion: string): string {
  if (descripcion.toLowerCase().includes('transferencia')) {
    return 'TRANSFERENCIA_BANCARIA';
  } else if (descripcion.toLowerCase().includes('mercadopago') || descripcion.toLowerCase().includes('mercado pago')) {
    return 'MERCADOPAGO';
  } else {
    return 'PENDIENTE_DEFINIR';
  }
}

// Función para extraer total del mensaje
function extraerTotal(descripcion: string): number {
  const match = descripcion.match(/Total[:\s]*\$?([\d,]+)/i);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  
  // Buscar en formato "Total: $X" o "Total: X"
  const match2 = descripcion.match(/Total[:\s]*\$?(\d+(?:\.\d{2})?)/i);
  return match2 ? parseFloat(match2[1]) : 0;
}

// Función para extraer items del mensaje
function extraerItems(descripcion: string): any[] {
  const items: any[] = [];
  
  // Buscar líneas que contengan productos
  const lineas = descripcion.split('\n');
  lineas.forEach(linea => {
    // Buscar patrones como "Producto: X - $Y" o "X - $Y"
    const match = linea.match(/([^-]+)-?\s*\$?(\d+(?:\.\d{2})?)/);
    if (match && !linea.toLowerCase().includes('total')) {
      items.push({
        nombre: match[1].trim(),
        precio: parseFloat(match[2])
      });
    }
  });
  
  return items;
} 
