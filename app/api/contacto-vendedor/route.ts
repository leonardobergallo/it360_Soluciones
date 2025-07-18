import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Crear una nueva consulta de contacto con vendedor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      email, 
      telefono, 
      mensaje, 
      producto, 
      precio,
      tipoConsulta = 'Consulta de Producto' 
    } = body;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Crear el presupuesto en la base de datos
    const presupuesto = await prisma.presupuesto.create({
      data: {
        nombre,
        email,
        telefono: telefono || '',
        empresa: tipoConsulta,
        servicio: producto || 'Consulta de Producto',
        mensaje,
        estado: 'pendiente',
      },
    });

    // Enviar email al cliente
    try {
      await enviarEmailCliente({
        nombre,
        email,
        producto,
        precio,
        mensaje,
      });
    } catch (emailError) {
      console.error('Error al enviar email al cliente:', emailError);
    }

    // Enviar email al administrador
    try {
      await enviarEmailAdmin({
        nombre,
        email,
        telefono,
        producto,
        precio,
        mensaje,
        tipoConsulta,
      });
    } catch (emailError) {
      console.error('Error al enviar email al admin:', emailError);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Consulta enviada con éxito',
        presupuesto,
        whatsappUrl: generarWhatsAppUrl(nombre, producto, precio, mensaje)
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al procesar consulta de contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para generar URL de WhatsApp
function generarWhatsAppUrl(nombre: string, producto?: string, precio?: number, mensaje?: string) {
  const phone = "5493425089906"; // Número de WhatsApp de IT360 - Santa Fe, Argentina
  
  let whatsappMessage = `¡Hola! Soy ${nombre} y me interesa el producto: ${producto || 'Producto'}`;
  
  if (precio) {
    whatsappMessage += `\nPrecio: $${precio.toLocaleString()}`;
  }
  
  if (mensaje) {
    whatsappMessage += `\n\nMi consulta: ${mensaje}`;
  }
  
  whatsappMessage += `\n\n¿Podrían ayudarme con más información?`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
}

// Función para enviar email al cliente
async function enviarEmailCliente({ 
  nombre, 
  email, 
  producto, 
  precio, 
  mensaje 
}: {
  nombre: string;
  email: string;
  producto?: string;
  precio?: number;
  mensaje: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email al cliente');
    console.log('Email que se enviaría al cliente:', { nombre, email, producto, precio, mensaje });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <info@it360.com>',
    to: [email],
    subject: 'Consulta recibida - IT360 Soluciones',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">IT360 Soluciones</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu consulta ha sido recibida</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${nombre}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hemos recibido tu consulta sobre <strong>${producto || 'nuestro producto'}</strong> y nos pondremos en contacto contigo lo antes posible.
          </p>
          
          ${precio ? `<p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>Precio del producto:</strong> $${precio.toLocaleString()}
          </p>` : ''}
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>Tu mensaje:</strong><br>
            ${mensaje}
          </p>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #1976d2; font-weight: 500;">
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
  producto, 
  precio, 
  mensaje, 
  tipoConsulta 
}: {
  nombre: string;
  email: string;
  telefono?: string;
  producto?: string;
  precio?: number;
  mensaje: string;
  tipoConsulta: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email al admin');
    console.log('Email que se enviaría al admin:', { nombre, email, telefono, producto, precio, mensaje, tipoConsulta });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <info@it360.com>',
    to: ['leonardobergallo@gmail.com'], // Email del administrador
    subject: `Nueva consulta de ${nombre} - ${producto || 'Producto'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Nueva Consulta Recibida</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Detalles de la consulta:</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Nombre:</strong> ${nombre}
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a>
            </p>
            ${telefono ? `<p style="margin: 0 0 10px 0; color: #333;">
              <strong>Teléfono:</strong> <a href="tel:${telefono}" style="color: #007bff;">${telefono}</a>
            </p>` : ''}
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Tipo de consulta:</strong> ${tipoConsulta}
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Producto:</strong> ${producto || 'No especificado'}
            </p>
            ${precio ? `<p style="margin: 0 0 10px 0; color: #333;">
              <strong>Precio:</strong> $${precio.toLocaleString()}
            </p>` : ''}
            <p style="margin: 0; color: #333;">
              <strong>Mensaje:</strong><br>
              ${mensaje}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, tengo una consulta de ${nombre} sobre ${producto || 'un producto'}. ¿Pueden ayudarme?`)}" 
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