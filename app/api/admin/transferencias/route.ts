import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET - Obtener todas las solicitudes de transferencia bancaria
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acceso denegado - Solo administradores' },
        { status: 403 }
      );
    }

    // Obtener todas las solicitudes de transferencia bancaria y MercadoPago
    const solicitudes = await prisma.presupuesto.findMany({
      where: {
        OR: [
          {
            servicio: {
              contains: 'TRANSFERENCIA'
            }
          },
          {
            servicio: {
              contains: 'MERCADOPAGO'
            }
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      solicitudes: solicitudes
    });

  } catch (error) {
    console.error('Error al obtener solicitudes de transferencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 