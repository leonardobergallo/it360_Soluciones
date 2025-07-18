import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Verificar si el usuario es administrador
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAdmin: false, error: 'No autenticado' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    
    if (!decoded || !decoded.userId) {
      return { isAdmin: false, error: 'Token inválido' };
    }

    // Verificar que el usuario existe y es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return { isAdmin: false, error: 'No autorizado' };
    }

    return { isAdmin: true, userId: decoded.userId };
  } catch (error: any) {
    return { isAdmin: false, error: 'Error verificando permisos' };
  }
}

// GET - Obtener configuración actual de métodos de pago
export async function GET(request: NextRequest) {
  const { isAdmin, error } = await verifyAdmin(request);
  
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 401 });
  }

  try {
    // Por ahora retornamos configuración hardcodeada
    // En el futuro esto podría venir de la base de datos
    return NextResponse.json({
      mercadopago: {
        habilitado: true,
        nombre: 'MercadoPago',
        descripcion: 'Pago seguro con tarjeta o efectivo',
        configurado: true
      },
      transferencia: {
        habilitado: true,
        nombre: 'Transferencia bancaria',
        descripcion: 'Transferencia directa al banco',
        configurado: true,
        datos: {
          alias: 'GENIA.GRAMO.PERSA',
          banco: 'Banco de la Nación Argentina',
          cbu: '0110123456789012345678'
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración de pagos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración de métodos de pago
export async function PUT(request: NextRequest) {
  const { isAdmin, error } = await verifyAdmin(request);
  
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mercadopago, transferencia } = body;

    // Validar datos
    if (typeof mercadopago?.habilitado !== 'boolean' || typeof transferencia?.habilitado !== 'boolean') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    // Por ahora solo logueamos los cambios
    // En el futuro esto se guardaría en la base de datos
    console.log('Configuración de pagos actualizada:', {
      mercadopago: mercadopago.habilitado,
      transferencia: transferencia.habilitado,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada correctamente',
      config: {
        mercadopago: {
          habilitado: mercadopago.habilitado,
          nombre: 'MercadoPago',
          descripcion: 'Pago seguro con tarjeta o efectivo'
        },
        transferencia: {
          habilitado: transferencia.habilitado,
          nombre: 'Transferencia bancaria',
          descripcion: 'Transferencia directa al banco',
          datos: {
            alias: 'GENIA.GRAMO.PERSA',
            banco: 'Banco de la Nación Argentina',
            cbu: '0110123456789012345678'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error al actualizar configuración de pagos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 