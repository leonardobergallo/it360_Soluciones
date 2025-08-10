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
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    
    if (decoded.role !== 'ADMIN') {
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

    // Buscar la solicitud en la tabla Ticket
    const solicitud = await prisma.ticket.findUnique({
      where: { id: solicitudId }
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    if (accion === 'aprobar') {
      // Verificar stock antes de aprobar
      const stockDisponible = await verificarStock(solicitud.descripcion);
      
      if (!stockDisponible.disponible) {
        return NextResponse.json(
          { 
            error: 'Stock insuficiente', 
            detalles: stockDisponible.productosSinStock 
          },
          { status: 400 }
        );
      }

      const esTransferencia = solicitud.descripcion.toLowerCase().includes('transferencia');
      
      // Aprobar solicitud
      await prisma.ticket.update({
        where: { id: solicitudId },
        data: { 
          estado: 'en_proceso',
          notas: solicitud.notas + `\n\n✅ APROBADO - ${esTransferencia ? 'Pago habilitado. Puedes proceder con la transferencia bancaria.' : 'Solicitud de MercadoPago aprobada. Gestionando pedido.'}`
        }
      });

      // Reducir stock de productos
      await reducirStock(solicitud.descripcion);

      if (esTransferencia) {
        // Enviar email de aprobación al cliente con datos bancarios
        await enviarEmailAprobacion({
          nombre: solicitud.nombre,
          email: solicitud.email,
          telefono: solicitud.telefono || '',
          direccion: solicitud.empresa || '',
          mensaje: solicitud.descripcion
        });
      } else {
        // Enviar email de aprobación para MercadoPago
        await enviarEmailAprobacionMercadoPago({
          nombre: solicitud.nombre,
          email: solicitud.email,
          telefono: solicitud.telefono || '',
          direccion: solicitud.empresa || '',
          mensaje: solicitud.descripcion
        });
      }

      return NextResponse.json({
        success: true,
        message: `Solicitud aprobada exitosamente. ${esTransferencia ? 'Se habilitó el pago y se envió email al cliente.' : 'Se notificó al cliente sobre la gestión del pedido.'}`
      });

    } else if (accion === 'rechazar') {
      // Rechazar solicitud
      await prisma.ticket.update({
        where: { id: solicitudId },
        data: { 
          estado: 'cerrado',
          notas: solicitud.notas + `\n\n❌ RECHAZADO${motivo ? ` - Motivo: ${motivo}` : ''}`
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

// Función para verificar stock de productos
async function verificarStock(descripcion: string): Promise<{ disponible: boolean; productosSinStock: string[] }> {
  const productosSinStock: string[] = [];
  
  // Extraer productos de la descripción
  const productos = extraerProductos(descripcion);
  
  for (const producto of productos) {
    const productoDB = await prisma.product.findFirst({
      where: {
        name: { contains: producto.nombre, mode: 'insensitive' }
      }
    });
    
    if (!productoDB) {
      productosSinStock.push(`${producto.nombre} - No encontrado`);
    } else if (productoDB.stock < producto.cantidad) {
      productosSinStock.push(`${producto.nombre} - Stock: ${productoDB.stock}, Solicitado: ${producto.cantidad}`);
    }
  }
  
  return {
    disponible: productosSinStock.length === 0,
    productosSinStock
  };
}

// Función para reducir stock de productos
async function reducirStock(descripcion: string) {
  const productos = extraerProductos(descripcion);
  
  for (const producto of productos) {
    const productoDB = await prisma.product.findFirst({
      where: {
        name: { contains: producto.nombre, mode: 'insensitive' }
      }
    });
    
    if (productoDB) {
      await prisma.product.update({
        where: { id: productoDB.id },
        data: { stock: productoDB.stock - producto.cantidad }
      });
    }
  }
}

// Función para extraer productos de la descripción
function extraerProductos(descripcion: string): Array<{ nombre: string; cantidad: number }> {
  const productos: Array<{ nombre: string; cantidad: number }> = [];
  
  // Buscar patrones como "Producto: X - Cantidad: Y" o "X - $Y"
  const lineas = descripcion.split('\n');
  lineas.forEach(linea => {
    // Buscar productos con cantidad
    const match = linea.match(/([^-]+)-?\s*Cantidad[:\s]*(\d+)/i);
    if (match) {
      productos.push({
        nombre: match[1].trim(),
        cantidad: parseInt(match[2])
      });
    } else {
      // Buscar productos sin cantidad específica (asumir 1)
      const match2 = linea.match(/([^-]+)-?\s*\$?(\d+(?:\.\d{2})?)/);
      if (match2 && !linea.toLowerCase().includes('total')) {
        productos.push({
          nombre: match2[1].trim(),
          cantidad: 1
        });
      }
    }
  });
  
  return productos;
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
