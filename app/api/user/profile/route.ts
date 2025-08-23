import { NextRequest, NextResponse } from 'next/server';
import { prisma, connectPrisma, disconnectPrisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// GET - Obtener perfil del usuario
export async function GET(request: NextRequest) {
  try {
    // Verificar token de autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    
    // Conectar explícitamente a Prisma
    await connectPrisma();
    
    // Buscar usuario (solo campos que existen en el modelo)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error: any) {
    console.error('Error obteniendo perfil:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P1001' || error.message?.includes('Engine is not yet connected')) {
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

// PUT - Actualizar perfil del usuario
export async function PUT(request: NextRequest) {
  try {
    // Verificar token de autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    
    const body = await request.json();
    const { 
      name, 
      email
    } = body;

    // Validar datos requeridos
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Conectar explícitamente a Prisma
    await connectPrisma();

    // Verificar que el email no esté en uso por otro usuario
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: decoded.userId }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está en uso por otro usuario' },
        { status: 400 }
      );
    }

    // Actualizar usuario (solo campos que existen en el modelo)
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name,
        email: email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Error actualizando perfil:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P1001' || error.message?.includes('Engine is not yet connected')) {
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
