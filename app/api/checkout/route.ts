import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Crear la solicitud de compra en la base de datos
    const solicitudCompra = await prisma.presupuesto.create({
      data: {
        nombre,
        email,
        telefono,
        empresa: 'Solicitud de Compra',
        servicio: `Checkout - ${metodoPago.toUpperCase()}`,
        mensaje: `Solicitud de compra por ${metodoPago}. Productos: ${items.map((item: any) => `${item.product?.name || item.name} x${item.quantity}`).join(', ')}. Total: $${total.toLocaleString()}. Dirección: ${direccion}`,
        estado: 'pendiente',
      },
    });

    // Enviar email de confirmación al cliente
    try {
      await enviarEmailCliente({
        nombre,
        email,
        items,
        total,
        metodoPago,
        direccion,
      });
    } catch (emailError) {
      console.error('Error al enviar email al cliente:', emailError);
    }

    // Enviar email de notificación al administrador
    try {
      await enviarEmailAdmin({
        nombre,
        email,
        telefono,
        direccion,
        items,
        total,
        metodoPago,
        solicitudId: solicitudCompra.id,
      });
    } catch (emailError) {
      console.error('Error al enviar email al admin:', emailError);
    }

    // Generar URL de WhatsApp para contacto directo
    const whatsappUrl = generarWhatsAppUrl(nombre, items, total, metodoPago);

    // Si es transferencia, agregar mensaje especial
    const mensajeEspecial = metodoPago === 'transferencia' ? 
      'PENDIENTE DE APROBACIÓN - El administrador verificará stock y habilitará la compra.' : '';

    return NextResponse.json(
      { 
        success: true, 
        message: 'Solicitud enviada con éxito',
        solicitudCompra,
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

// Función para enviar email al cliente
async function enviarEmailCliente({ 
  nombre, 
  email, 
  items, 
  total, 
  metodoPago,
  direccion 
}: {
  nombre: string;
  email: string;
  items: any[];
  total: number;
  metodoPago: string;
  direccion: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email al cliente');
    console.log('Email que se enviaría al cliente:', { nombre, email, items, total, metodoPago });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <info@it360.com>',
    to: [email],
    subject: 'Solicitud de compra recibida - IT360 Soluciones',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">IT360 Soluciones</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu solicitud de compra ha sido recibida</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${nombre}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hemos recibido tu solicitud de compra. ${metodoPago === 'transferencia' ? 
              '<strong style="color: #ff6b35;">IMPORTANTE:</strong> Tu solicitud está pendiente de aprobación. Verificaremos el stock disponible y te contactaremos para confirmar la disponibilidad y habilitar la compra.' : 
              'Nos pondremos en contacto contigo lo antes posible para completar el proceso.'
            }
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px;">Detalles de tu compra:</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Productos:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${items.map((item: any) => {
                  const productName = item.product?.name || item.name;
                  const quantity = item.quantity;
                  const price = item.product?.price || item.price;
                  return `<li style="color: #666; margin-bottom: 5px;">${productName} x${quantity} - $${price.toLocaleString()}</li>`;
                }).join('')}
              </ul>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Total:</strong> <span style="color: #007bff; font-weight: bold;">$${total.toLocaleString()}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Método de pago:</strong> <span style="color: #28a745; font-weight: bold;">${metodoPago.toUpperCase()}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Dirección de entrega:</strong> <span style="color: #666;">${direccion}</span>
            </div>
          </div>
          
          ${metodoPago === 'transferencia' ? `
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ IMPORTANTE - PENDIENTE DE APROBACIÓN:</h4>
            <p style="margin: 0 0 10px 0; color: #856404; font-weight: bold;">Tu solicitud está siendo revisada.</p>
            <p style="margin: 0 0 10px 0; color: #856404;">• Verificaremos el stock disponible</p>
            <p style="margin: 0 0 10px 0; color: #856404;">• Te contactaremos para confirmar disponibilidad</p>
            <p style="margin: 0; color: #856404;">• Solo después de la confirmación podrás proceder con el pago</p>
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #1976d2;">Datos para transferencia (solo después de aprobación):</h4>
            <p style="margin: 0 0 5px 0; color: #1976d2;"><strong>Alias:</strong> GENIA.GRAMO.PERSA</p>
            <p style="margin: 0 0 5px 0; color: #1976d2;"><strong>Banco:</strong> Banco de la Nación Argentina</p>
            <p style="margin: 0; color: #1976d2;"><strong>CBU:</strong> 0110123456789012345678</p>
          </div>
          ` : ''}
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #856404; font-weight: 500;">
              💬 También puedes contactarnos directamente por WhatsApp para una respuesta más rápida.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Gracias por confiar en IT360 Soluciones para tus necesidades tecnológicas.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 14px;">
              Este es un email automático de confirmación. Nuestro equipo se pondrá en contacto contigo pronto.
            </p>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error al enviar email al cliente:', error);
    throw error;
  }

  console.log('Email enviado al cliente:', data);
}

// Función para enviar email al administrador
async function enviarEmailAdmin({ 
  nombre, 
  email, 
  telefono, 
  direccion,
  items, 
  total, 
  metodoPago,
  solicitudId 
}: {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  items: any[];
  total: number;
  metodoPago: string;
  solicitudId: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email al admin');
    console.log('Email que se enviaría al admin:', { nombre, email, telefono, items, total, metodoPago });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <info@it360.com>',
    to: ['leonardobergallo@gmail.com'], // Email del administrador
    subject: `Nueva solicitud de compra de ${nombre} - $${total.toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Nueva Solicitud de Compra</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Detalles de la solicitud:</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Cliente:</strong> ${nombre}
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a>
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Teléfono:</strong> <a href="tel:${telefono}" style="color: #007bff;">${telefono}</a>
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Dirección:</strong> ${direccion}
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Método de pago:</strong> <span style="color: #28a745; font-weight: bold;">${metodoPago.toUpperCase()}</span>
              ${metodoPago === 'transferencia' ? ' <span style="color: #ff6b35; font-weight: bold;">(REQUIERE APROBACIÓN)</span>' : ''}
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Total:</strong> <span style="color: #007bff; font-weight: bold;">$${total.toLocaleString()}</span>
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>ID de solicitud:</strong> ${solicitudId}
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px;">Productos solicitados:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${items.map((item: any) => {
                const productName = item.product?.name || item.name;
                const quantity = item.quantity;
                const price = item.product?.price || item.price;
                return `<li style="color: #666; margin-bottom: 5px;"><strong>${productName}</strong> x${quantity} - $${price.toLocaleString()}</li>`;
              }).join('')}
            </ul>
          </div>
          
          ${metodoPago === 'transferencia' ? `
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ ACCIÓN REQUERIDA:</h4>
            <p style="margin: 0 0 10px 0; color: #856404; font-weight: bold;">Esta solicitud requiere tu aprobación antes de proceder.</p>
            <p style="margin: 0 0 10px 0; color: #856404;">• Verifica el stock disponible de los productos</p>
            <p style="margin: 0 0 10px 0; color: #856404;">• Confirma la disponibilidad con el cliente</p>
            <p style="margin: 0; color: #856404;">• Solo después de la confirmación, proporciona los datos bancarios</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, tengo una nueva solicitud de compra de ${nombre} por $${total.toLocaleString()} (${metodoPago.toUpperCase()}). ${metodoPago === 'transferencia' ? 'REQUIERE APROBACIÓN - ¿Pueden ayudarme a verificar stock?' : '¿Pueden ayudarme a procesarla?'}`)}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📱 Contactar por WhatsApp
            </a>
            <a href="mailto:${email}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📧 Responder por Email
            </a>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error al enviar email al admin:', error);
    throw error;
  }

  console.log('Email enviado al admin:', data);
} 