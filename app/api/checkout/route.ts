import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// POST - Procesar solicitud de checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      email, 
      telefono, 
      direccion, 
      metodoPago,
      items,
      total,
      userId 
    } = body;

    // Validaciones básicas
    if (!nombre || !email || !telefono || !direccion || !metodoPago || !items || !total) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Generar número de ticket único
    const ticketNumber = `COMPRA-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Crear ticket de solicitud de compra en la base de datos
    const ticketCompra = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre,
        email,
        telefono,
        empresa: 'Solicitud de Compra',
        servicio: `Checkout - ${metodoPago.toUpperCase()}`,
        mensaje: `Solicitud de compra por ${metodoPago}. Productos: ${items.map((item: any) => `${item.product?.name || item.name} x${item.quantity}`).join(', ')}. Total: $${total.toLocaleString()}. Dirección: ${direccion}`,
        tipo: 'venta',
        categoria: 'checkout',
        asunto: `Solicitud de compra - ${metodoPago.toUpperCase()} - $${total.toLocaleString()}`,
        descripcion: `Cliente: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nDirección: ${direccion}\nMétodo de pago: ${metodoPago.toUpperCase()}\nTotal: $${total.toLocaleString()}\n\nProductos:\n${items.map((item: any) => `• ${item.product?.name || item.name} x${item.quantity} - $${(item.product?.price || item.price) * item.quantity}`).join('\n')}`,
        urgencia: metodoPago === 'transferencia' ? 'alta' : 'normal',
        estado: 'abierto',
        prioridad: metodoPago === 'transferencia' ? 'alta' : 'media',
      },
    });

    console.log('✅ Ticket de compra creado:', {
      id: ticketCompra.id,
      cliente: nombre,
      email,
      telefono,
      total: `$${total.toLocaleString()}`,
      metodoPago,
      requiereAprobacion: metodoPago === 'transferencia'
    });

    // Generar URL de WhatsApp para contacto directo
    const whatsappUrl = generarWhatsAppUrl(nombre, items, total, metodoPago);

    // Si es transferencia, agregar mensaje especial
    const mensajeEspecial = metodoPago === 'transferencia' ? 
      'PENDIENTE DE APROBACIÓN - El administrador verificará stock y habilitará la compra.' : '';

    return NextResponse.json(
      { 
        success: true, 
        message: 'Solicitud enviada con éxito',
        ticketCompra,
        whatsappUrl,
        mensajeEspecial,
        requiereAprobacion: metodoPago === 'transferencia'
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al procesar checkout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener configuración de métodos de pago (para el admin)
export async function GET() {
  try {
    // Por ahora retornamos configuración hardcodeada
    // En el futuro esto podría venir de la base de datos
    return NextResponse.json({
      mercadopago: {
        habilitado: true,
        nombre: 'MercadoPago',
        descripcion: 'Pago seguro con tarjeta o efectivo'
      },
      transferencia: {
        habilitado: true,
        nombre: 'Transferencia bancaria',
        descripcion: 'Transferencia directa al banco',
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

// Función para generar URL de WhatsApp
function generarWhatsAppUrl(nombre: string, items: any[], total: number, metodoPago: string) {
  const phone = "5493425089906"; // Número de WhatsApp de IT360
  
  let whatsappMessage = `¡Hola! Soy ${nombre} y quiero realizar una compra por ${metodoPago.toUpperCase()}.`;
  
  whatsappMessage += `\n\nProductos:`;
  items.forEach((item: any) => {
    const productName = item.product?.name || item.name;
    const quantity = item.quantity;
    const price = item.product?.price || item.price;
    whatsappMessage += `\n• ${productName} x${quantity} - $${price.toLocaleString()}`;
  });
  
  whatsappMessage += `\n\nTotal: $${total.toLocaleString()}`;
  whatsappMessage += `\n\n¿Podrían ayudarme a completar la compra?`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
} 
