import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';




// GET: Listar todos los mensajes
export async function GET() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(contacts);
}

// POST: Crear un nuevo mensaje
export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
  }
  
  const contact = await prisma.contact.create({
    data: { name, email, message },
  });

  // Enviar email de notificación al administrador
  try {
    await enviarEmailAdmin({ name, email, message });
  } catch (emailError) {
    console.error('Error al enviar email al admin:', emailError);
  }

  return NextResponse.json(contact);
}

// DELETE: Eliminar un mensaje por id
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
  }
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// Función para enviar email al administrador
async function enviarEmailAdmin({ 
  name, 
  email, 
  message 
}: {
  name: string;
  email: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, solo logueando email al admin');
    console.log('Email que se enviaría al admin:', { name, email, message });
    return;
  }

  const { data, error } = await resend.emails.send({
    from: 'IT360 Soluciones <it360tecnologia@gmail.com>',
    to: ['it360tecnologia@gmail.com'], // Email principal de IT360
    subject: `Nuevo mensaje de contacto de ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Nuevo Mensaje de Contacto</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">IT360 Soluciones</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Detalles del mensaje:</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Nombre:</strong> ${name}
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a>
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Mensaje:</strong>
            </p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; color: #666; font-style: italic;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📧 Responder por Email
            </a>
            <a href="https://wa.me/5493425089906?text=${encodeURIComponent(`Hola, tengo un nuevo mensaje de contacto de ${name} (${email}). ¿Pueden ayudarme a responder?`)}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px;">
              📱 Contactar por WhatsApp
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
