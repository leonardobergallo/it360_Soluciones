import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Crear una nueva consulta de Hogar Inteligente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, mensaje, tipoConsulta } = body;

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
        empresa: tipoConsulta || 'Hogar Inteligente',
        servicio: 'Hogar Inteligente',
        mensaje,
        estado: 'pendiente',
      },
    });

    // Enviar email (función simple por ahora)
    try {
      await enviarEmailConsulta({
        nombre,
        email,
        telefono,
        mensaje,
        tipoConsulta,
      });
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // No fallamos si el email no se envía, solo lo registramos
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Consulta enviada con éxito',
        presupuesto 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al procesar consulta de Hogar Inteligente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para enviar email usando Resend
async function enviarEmailConsulta(data: {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  tipoConsulta?: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY no configurada, solo logueando email');
      console.log('=== EMAIL DE CONSULTA HOGAR INTELIGENTE ===');
      console.log('Para: info@it360.com.ar');
      console.log('Asunto: Nueva consulta de Hogar Inteligente');
      console.log('Contenido:', data);
      console.log('==========================================');
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🤖 Nueva Consulta de Hogar Inteligente</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">📋 Detalles de la Consulta</h2>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #667eea;">👤 Nombre:</strong>
            <p style="margin: 5px 0; color: #555;">${data.nombre}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #667eea;">📧 Email:</strong>
            <p style="margin: 5px 0; color: #555;">${data.email}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #667eea;">📞 Teléfono:</strong>
            <p style="margin: 5px 0; color: #555;">${data.telefono || 'No proporcionado'}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #667eea;">🎯 Tipo de Consulta:</strong>
            <p style="margin: 5px 0; color: #555;">${data.tipoConsulta || 'General'}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #667eea;">💬 Mensaje:</strong>
            <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; color: #555; line-height: 1.6;">
              ${data.mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #333; font-weight: 500;">
              ⏰ <strong>Fecha:</strong> ${new Date().toLocaleString('es-AR', { 
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
          <p>Este email fue enviado desde el formulario de Hogar Inteligente de IT360 Soluciones</p>
          <p>Para responder, contacta directamente a: ${data.email}</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'IT360 Soluciones <noreply@it360.com.ar>',
      to: ['leonardobergallo@gmail.com'],
      subject: `🤖 Nueva consulta de Hogar Inteligente - ${data.nombre}`,
      html: htmlContent,
      replyTo: data.email,
    });

    console.log('✅ Email enviado exitosamente a leonardobergallo@gmail.com');
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    // No lanzamos el error para no fallar el endpoint completo
  }
}

// GET - Obtener todas las consultas de Hogar Inteligente (solo para admin)
export async function GET() {
  try {
    const consultas = await prisma.presupuesto.findMany({
      where: {
        servicio: 'Hogar Inteligente',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(consultas);
  } catch (error) {
    console.error('Error al obtener consultas de Hogar Inteligente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 