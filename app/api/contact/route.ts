import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactNotification } from '@/lib/email-service';

// POST - Crear un nuevo contacto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio, mensaje } = body;

    // Validar campos requeridos
    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const contactoExistente = await prisma.contact.findUnique({
      where: { email }
    });

    let nuevoContacto;

    if (contactoExistente) {
      // Si el email ya existe, actualizar el mensaje
      nuevoContacto = await prisma.contact.update({
        where: { email },
        data: {
          name: nombre, // Actualizar el nombre también
          message: `Servicio solicitado: ${servicio || 'No especificado'}
Empresa: ${empresa || 'No especificada'}
Teléfono: ${telefono || 'No especificado'}
Mensaje: ${mensaje || 'Sin mensaje adicional'}

--- Mensaje anterior ---
${contactoExistente.message}`
        }
      });
    } else {
      // Si el email no existe, crear nuevo contacto
      nuevoContacto = await prisma.contact.create({
        data: {
          name: nombre,
          email,
          message: `Servicio solicitado: ${servicio || 'No especificado'}
Empresa: ${empresa || 'No especificada'}
Teléfono: ${telefono || 'No especificado'}
Mensaje: ${mensaje || 'Sin mensaje adicional'}`
        }
      });
    }

    // Enviar email de notificación (opcional)
    try {
      await enviarEmailNotificacion({
        nombre,
        email,
        telefono,
        empresa,
        servicio,
        mensaje
      });
    } catch (emailError) {
      console.error('Error enviando email de notificación:', emailError);
      // No fallar si el email no se envía
    }

    // Enviar email de notificación usando Gmail
    try {
      await sendContactNotification(nuevoContacto);
      console.log('✅ Email de contacto enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de contacto:', emailError);
      // No fallar si el email no se envía
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      contacto: nuevoContacto
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Error al enviar solicitud' },
      { status: 500 }
    );
  }
}

// Función para enviar email de notificación
async function enviarEmailNotificacion({
  nombre,
  email,
  telefono,
  empresa,
  servicio,
  mensaje
}: {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  servicio?: string;
  mensaje?: string;
}) {
  // Aquí puedes integrar con tu servicio de email preferido
  // Por ahora solo logueamos la información
  console.log('📧 NUEVA SOLICITUD RECIBIDA:');
  console.log('='.repeat(50));
  console.log(`👤 Nombre: ${nombre}`);
  console.log(`📧 Email: ${email}`);
  console.log(`📞 Teléfono: ${telefono || 'No proporcionado'}`);
  console.log(`🏢 Empresa: ${empresa || 'No proporcionada'}`);
  console.log(`🔧 Servicio: ${servicio || 'No especificado'}`);
  console.log(`💬 Mensaje: ${mensaje || 'Sin mensaje'}`);
  console.log('='.repeat(50));
  console.log('📱 WhatsApp: +54 9 342 508-9906');
  console.log('📞 Teléfono: 3425089906');
  console.log('🌐 Web: www.it360.com.ar');
} 
