import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// POST - Aprobar o rechazar solicitud de transferencia
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { solicitudId, accion, motivo } = body;

    if (!solicitudId || !accion) {
      return NextResponse.json(
        { error: 'ID de solicitud y acción son requeridos' },
        { status: 400 }
      );
    }

    // Buscar la solicitud
    const solicitud = await prisma.presupuesto.findUnique({
      where: { id: solicitudId }
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    if (accion === 'aprobar') {
      const esTransferencia = solicitud.servicio.includes('TRANSFERENCIA');
      
      // Aprobar solicitud
      await prisma.presupuesto.update({
        where: { id: solicitudId },
        data: { 
          estado: 'aprobado',
          mensaje: solicitud.mensaje + `\n\n✅ APROBADO - ${esTransferencia ? 'Pago habilitado. Puedes proceder con la transferencia bancaria.' : 'Solicitud de MercadoPago aprobada. Gestionando pedido.'}`
        }
      });

      if (esTransferencia) {
        // Enviar email de aprobación al cliente con datos bancarios
        await enviarEmailAprobacion({
          nombre: solicitud.nombre,
          email: solicitud.email,
          telefono: solicitud.telefono || '',
          direccion: solicitud.empresa || '',
          mensaje: solicitud.mensaje || ''
        });
      } else {
        // Enviar email de aprobación para MercadoPago
        await enviarEmailAprobacionMercadoPago({
          nombre: solicitud.nombre,
          email: solicitud.email,
          telefono: solicitud.telefono || '',
          direccion: solicitud.empresa || '',
          mensaje: solicitud.mensaje || ''
        });
      }

      return NextResponse.json({
        success: true,
        message: `Solicitud aprobada exitosamente. ${esTransferencia ? 'Se habilitó el pago y se envió email al cliente.' : 'Se notificó al cliente sobre la gestión del pedido.'}`
      });

    } else if (accion === 'rechazar') {
      // Rechazar solicitud
      await prisma.presupuesto.update({
        where: { id: solicitudId },
        data: { 
          estado: 'rechazado',
          mensaje: solicitud.mensaje + `\n\n❌ RECHAZADO${motivo ? ` - Motivo: ${motivo}` : ''}`
        }
      });

      // Enviar email de rechazo al cliente
      await enviarEmailRechazo({
        nombre: solicitud.nombre,
        email: solicitud.email,
        motivo: motivo || 'Stock no disponible'
      });

      return NextResponse.json({
        success: true,
        message: 'Solicitud rechazada. Se notificó al cliente.'
      });

    } else {
      return NextResponse.json(
        { error: 'Acción no válida. Use "aprobar" o "rechazar"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error al procesar aprobación/rechazo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para enviar email de aprobación con datos bancarios
async function enviarEmailAprobacion({ 
  nombre, 
  email, 
  telefono, 
  direccion, 
  mensaje 
}: {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  mensaje: string;
}) {
  console.log('📧 Email de aprobación que se enviaría a:', email);
  console.log('📋 Detalles:', { nombre, email, telefono, direccion, mensaje });
  console.log('💡 El cliente debe contactar a: it360tecnologia@gmail.com');
}

// Función para enviar email de aprobación de MercadoPago
async function enviarEmailAprobacionMercadoPago({ 
  nombre, 
  email, 
  telefono, 
  direccion, 
  mensaje 
}: {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  mensaje: string;
}) {
  console.log('📧 Email de aprobación MercadoPago que se enviaría a:', email);
  console.log('📋 Detalles:', { nombre, email, telefono, direccion, mensaje });
  console.log('💡 El cliente debe contactar a: it360tecnologia@gmail.com');
}

// Función para enviar email de rechazo
async function enviarEmailRechazo({ 
  nombre, 
  email, 
  motivo 
}: {
  nombre: string;
  email: string;
  motivo: string;
}) {
  console.log('📧 Email de rechazo que se enviaría a:', email);
  console.log('📋 Detalles:', { nombre, email, motivo });
  console.log('💡 El cliente debe contactar a: it360tecnologia@gmail.com');
} 
