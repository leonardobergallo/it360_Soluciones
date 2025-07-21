import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email de aprobación');
    console.log('Email que se enviaría al cliente:', { nombre, email, mensaje });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <info@it360.com>',
    to: [email],
    subject: '✅ Tu solicitud de compra ha sido APROBADA - IT360 Soluciones',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✅ SOLICITUD APROBADA</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">¡Excelente ${nombre}!</h2>
          
          <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #155724;">🎉 ¡Tu solicitud ha sido aprobada!</h3>
            <p style="margin: 0; color: #155724; font-weight: bold;">Hemos verificado el stock y todo está disponible. Ya puedes proceder con el pago.</p>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px;">🏦 Datos bancarios para la transferencia:</h3>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; border-radius: 5px;">
              <p style="margin: 0 0 8px 0; color: #1976d2;"><strong>Alias:</strong> GENIA.GRAMO.PERSA</p>
              <p style="margin: 0 0 8px 0; color: #1976d2;"><strong>Banco:</strong> Banco de la Nación Argentina</p>
              <p style="margin: 0 0 8px 0; color: #1976d2;"><strong>CBU:</strong> 0110123456789012345678</p>
              <p style="margin: 0; color: #1976d2;"><strong>Titular:</strong> IT360 Soluciones</p>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0; color: #856404;">📋 Instrucciones importantes:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #856404;">
                <li>Realiza la transferencia con el monto exacto de tu compra</li>
                <li>Envía el comprobante por WhatsApp o email</li>
                <li>Procesaremos tu pedido inmediatamente después de confirmar el pago</li>
                <li>Te contactaremos para coordinar la entrega</li>
              </ul>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px;">📋 Detalles de tu compra:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 14px; color: #666;">
              ${mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, soy ${nombre}. Ya realicé la transferencia bancaria para mi compra. Adjunto comprobante.`)}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📱 Enviar comprobante por WhatsApp
            </a>
            <a href="mailto:it360tecnologia@gmail.com" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📧 Enviar comprobante por Email
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Gracias por confiar en IT360 Soluciones. ¡Estamos listos para procesar tu pedido!
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error al enviar email de aprobación:', error);
    throw error;
  }

  console.log('Email de aprobación enviado:', data);
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
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email de aprobación MercadoPago');
    console.log('Email que se enviaría al cliente:', { nombre, email, mensaje });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <info@it360.com>',
    to: [email],
    subject: '✅ Tu solicitud de MercadoPago ha sido APROBADA - IT360 Soluciones',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00d4aa 0%, #009ee3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✅ SOLICITUD APROBADA</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">¡Excelente ${nombre}!</h2>
          
          <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #155724;">🎉 ¡Tu solicitud de MercadoPago ha sido aprobada!</h3>
            <p style="margin: 0; color: #155724; font-weight: bold;">Hemos verificado el stock y todo está disponible. Estamos gestionando tu pedido.</p>
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #1976d2;">📋 Proceso de gestión:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #1976d2;">
              <li>Tu solicitud ha sido aprobada y registrada</li>
              <li>Estamos procesando tu pedido</li>
              <li>Te contactaremos para coordinar la entrega</li>
              <li>Si tienes alguna consulta, no dudes en contactarnos</li>
            </ul>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px;">📋 Detalles de tu compra:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 14px; color: #666;">
              ${mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, soy ${nombre}. Tengo una consulta sobre mi pedido de MercadoPago.`)}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📱 Consultar por WhatsApp
            </a>
            <a href="mailto:it360tecnologia@gmail.com" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📧 Consultar por Email
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Gracias por confiar en IT360 Soluciones. ¡Estamos procesando tu pedido!
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error al enviar email de aprobación MercadoPago:', error);
    throw error;
  }

  console.log('Email de aprobación MercadoPago enviado:', data);
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
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email de rechazo');
    console.log('Email que se enviaría al cliente:', { nombre, email, motivo });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <info@it360.com>',
    to: [email],
    subject: 'Información sobre tu solicitud de compra - IT360 Soluciones',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Información importante</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hola ${nombre},</h2>
          
          <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #721c24;">Información sobre tu solicitud:</h3>
            <p style="margin: 0; color: #721c24;">
              Lamentamos informarte que no podemos procesar tu solicitud en este momento. 
              ${motivo ? `<strong>Motivo:</strong> ${motivo}` : 'Stock no disponible actualmente.'}
            </p>
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #1976d2;">💡 Alternativas disponibles:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #1976d2;">
              <li>Puedes consultar por otros productos similares</li>
              <li>Te notificaremos cuando el stock esté disponible</li>
              <li>Considera usar MercadoPago para pagos inmediatos</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, soy ${nombre}. Me gustaría consultar por alternativas o cuando tendrán stock disponible.`)}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📱 Consultar por WhatsApp
            </a>
            <a href="mailto:it360tecnologia@gmail.com" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📧 Consultar por Email
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Gracias por tu interés en IT360 Soluciones. Estaremos encantados de ayudarte a encontrar la mejor solución para tus necesidades.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error al enviar email de rechazo:', error);
    throw error;
  }

  console.log('Email de rechazo enviado:', data);
} 