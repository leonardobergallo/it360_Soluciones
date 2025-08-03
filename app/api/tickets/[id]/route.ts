import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Función para enviar notificación de pago habilitado
async function enviarNotificacionPagoHabilitado(ticket: any) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Generar enlace directo para pagar
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const paymentLink = `${baseUrl}/pagar/${ticket.id}`;

    // Enviar email al usuario
    await resend.emails.send({
      from: 'IT360 Soluciones <noreply@it360.com>',
      to: ticket.email,
      subject: `✅ ¡Pago Habilitado! - ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #06b6d4; margin: 0; font-size: 28px;">✅ ¡Pago Habilitado!</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Tu solicitud ha sido aprobada</p>
            </div>

            <!-- Información del ticket -->
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #2d5a2d; margin: 0 0 15px 0;">📋 Detalles de tu solicitud:</h3>
              <p style="margin: 8px 0;"><strong>Número:</strong> ${ticket.ticketNumber}</p>
              <p style="margin: 8px 0;"><strong>Asunto:</strong> ${ticket.asunto}</p>
              <p style="margin: 8px 0;"><strong>Fecha:</strong> ${new Date(ticket.createdAt).toLocaleDateString('es-AR')}</p>
            </div>

            <!-- Datos bancarios -->
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin: 0 0 15px 0;">🏦 Datos Bancarios:</h3>
              <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6;">
                <p style="margin: 8px 0;"><strong>Banco:</strong> Banco de la Nación Argentina</p>
                <p style="margin: 8px 0;"><strong>Tipo de cuenta:</strong> Cuenta Corriente</p>
                <p style="margin: 8px 0;"><strong>Número de cuenta:</strong> 1234567890</p>
                <p style="margin: 8px 0;"><strong>CBU:</strong> 0110123456789012345678</p>
                <p style="margin: 8px 0;"><strong>Titular:</strong> IT360 Soluciones S.A.</p>
                <p style="margin: 8px 0;"><strong>CUIT:</strong> 30-12345678-9</p>
              </div>
              <p style="color: #856404; font-size: 14px; margin: 15px 0 0 0;">
                <strong>💡 Importante:</strong> Envía el comprobante de pago a <a href="mailto:pagos@it360.com" style="color: #06b6d4;">pagos@it360.com</a>
              </p>
            </div>

            <!-- Botón de pago -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${paymentLink}" 
                 style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3); transition: all 0.3s ease;">
                💳 PAGAR AHORA
              </a>
            </div>

            <!-- Información adicional -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333; margin: 0 0 15px 0;">📞 ¿Necesitas ayuda?</h4>
              <p style="margin: 8px 0; color: #666;">
                • <strong>WhatsApp:</strong> +54 9 11 1234-5678<br>
                • <strong>Email:</strong> <a href="mailto:soporte@it360.com" style="color: #06b6d4;">soporte@it360.com</a><br>
                • <strong>Horario:</strong> Lunes a Viernes 9:00 - 18:00
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                IT360 Soluciones - Soluciones tecnológicas integrales<br>
                Av. Corrientes 1234, CABA, Argentina
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log('✅ Email de pago habilitado enviado a:', ticket.email);

    // Enviar notificación adicional al administrador
    await resend.emails.send({
      from: 'IT360 Soluciones <noreply@it360.com>',
      to: 'it360tecnologia@gmail.com',
      subject: `💰 Pago Habilitado - ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">💰 Pago Habilitado</h2>
          <p>Se ha habilitado el pago para el ticket <strong>${ticket.ticketNumber}</strong></p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Detalles del Cliente:</h3>
            <p><strong>Nombre:</strong> ${ticket.nombre}</p>
            <p><strong>Email:</strong> ${ticket.email}</p>
            <p><strong>Teléfono:</strong> ${ticket.telefono || 'No especificado'}</p>
            <p><strong>Asunto:</strong> ${ticket.asunto}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>💳 Estado del Pago:</h3>
            <p>✅ Pago habilitado - Esperando confirmación del cliente</p>
            <p>🔗 Enlace de pago: <a href="${paymentLink}">${paymentLink}</a></p>
          </div>

          <p style="color: #666; font-size: 14px;">
            El cliente recibió un email con los datos bancarios y el enlace para pagar.
          </p>
        </div>
      `
    });

    console.log('✅ Notificación de pago habilitado enviada a it360tecnologia@gmail.com');
  } catch (error) {
    console.error('❌ Error enviando email de pago habilitado:', error);
  }
}

// PATCH - Actualizar un ticket específico
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { estado, notas } = body;

    // Validar que el ticket existe
    const ticketExistente = await prisma.ticket.findUnique({
      where: { id }
    });

    if (!ticketExistente) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el ticket
    const ticketActualizado = await prisma.ticket.update({
      where: { id },
      data: {
        estado,
        notas: notas || null,
        updatedAt: new Date()
      }
    });

    // Si el estado cambió a 'pago_habilitado', enviar notificación
    if (estado === 'pago_habilitado' && ticketExistente.estado !== 'pago_habilitado') {
      await enviarNotificacionPagoHabilitado(ticketActualizado);
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket actualizado correctamente',
      ticket: ticketActualizado
    });

  } catch (error) {
    console.error('Error actualizando ticket:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el ticket' },
      { status: 500 }
    );
  }
}

// GET - Obtener un ticket específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);

  } catch (error) {
    console.error('Error obteniendo ticket:', error);
    return NextResponse.json(
      { error: 'Error al obtener el ticket' },
      { status: 500 }
    );
  }
} 