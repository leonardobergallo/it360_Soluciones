import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// POST - Solicitar reseteo de contraseña
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Generar token de reseteo (válido por 1 hora)
    const resetToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'password_reset'
      },
      process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024',
      { expiresIn: '1h' }
    );

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
      }
    });

    // En producción, aquí se enviaría un email con el link de reseteo
    console.log('📧 Email de reseteo que se enviaría a:', email);
    console.log('🔗 Link de reseteo:', `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`);

    return NextResponse.json({
      success: true,
      message: 'Se ha enviado un email con instrucciones para resetear tu contraseña'
    });

  } catch (error) {
    console.error('Error solicitando reseteo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Resetear contraseña con token
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    
    if (decoded.type !== 'password_reset') {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.resetToken !== token) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Verificar que el token no haya expirado
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 400 }
      );
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error reseteando contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
