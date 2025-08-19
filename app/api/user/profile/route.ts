import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
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

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
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
      email,
      phone, 
      company, 
      address, 
      city, 
      province, 
      postalCode 
    } = body;

    // Validar datos requeridos
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

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

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name,
        email: email,
        phone: phone || null,
        company: company || null,
        address: address || null,
        city: city || null,
        province: province || null,
        postalCode: postalCode || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
