import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
// Configurar Resend con manejo de errores
let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  } else {
    console.warn('⚠️ RESEND_API_KEY no encontrada. Los emails no se enviarán.');
  }
} catch (error) {
  console.error('❌ Error configurando Resend:', error);
}

// POST - Habilitar pago y enviar email al usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, metodoPago } = body;

    if (!ticketId || !metodoPago) {
      return NextResponse.json(
        { error: 'ID de ticket y método de pago son requeridos' },
        { status: 400 }
      );
    }

    // Buscar el ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    // Verificar stock antes de habilitar pago
    const stockDisponible = await verificarStock(ticket.descripcion);
    
    if (!stockDisponible.disponible) {
      return NextResponse.json(
        { 
          error: 'Stock insuficiente', 
          detalles: stockDisponible.productosSinStock 
        },
        { status: 400 }
      );
    }

    // Actualizar estado del ticket
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        estado: 'pago_habilitado',
        notas: ticket.notas + `\n\n✅ PAGO HABILITADO - Método: ${metodoPago} - ${new Date().toLocaleString('es-AR')}`
      }
    });

    // Reducir stock de productos
    await reducirStock(ticket.descripcion);

    // Vaciar el carrito del usuario
    await vaciarCarritoUsuario(ticket.email);

    // Disparar evento personalizado para actualizar el frontend
    // Esto se manejará en el frontend cuando se reciba la respuesta

    // Enviar email al usuario con opciones de pago
    await enviarEmailPagoHabilitado({
      nombre: ticket.nombre,
      email: ticket.email,
      ticketNumber: ticket.ticketNumber,
      descripcion: ticket.descripcion,
      metodoPago: metodoPago
    });

    return NextResponse.json({
      success: true,
      message: `Pago habilitado exitosamente. Email enviado al cliente con instrucciones de ${metodoPago}.`
    });

  } catch (error) {
    console.error('Error al habilitar pago:', error);
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
        name: { contains: producto.nombre }
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
  try {
    const productos = extraerProductos(descripcion);
    
    for (const producto of productos) {
      const productoDB = await prisma.product.findFirst({
        where: {
          name: { contains: producto.nombre }
        }
      });
      
      if (productoDB) {
        const nuevoStock = Math.max(0, productoDB.stock - producto.cantidad);
        await prisma.product.update({
          where: { id: productoDB.id },
          data: { stock: nuevoStock }
        });
        console.log(`✅ Stock reducido: ${producto.nombre} - ${productoDB.stock} → ${nuevoStock}`);
      } else {
        console.log(`⚠️ Producto no encontrado: ${producto.nombre}`);
      }
    }
  } catch (error) {
    console.error('Error reduciendo stock:', error);
  }
}

// Función para extraer productos de la descripción
function extraerProductos(descripcion: string): Array<{ nombre: string; cantidad: number }> {
  const productos: Array<{ nombre: string; cantidad: number }> = [];
  
  const lineas = descripcion.split('\n');
  lineas.forEach(linea => {
    // Buscar productos con formato "Producto x1 - $precio"
    const match = linea.match(/([^-]+)\s*x(\d+)\s*-\s*\$?([\d,]+)/i);
    if (match) {
      const nombre = match[1].trim();
      const cantidad = parseInt(match[2]);
      
      // Filtrar líneas que no son productos (teléfono, dirección, etc.)
      if (!nombre.toLowerCase().includes('teléfono') && 
          !nombre.toLowerCase().includes('dirección') &&
          !nombre.toLowerCase().includes('email') &&
          !nombre.toLowerCase().includes('nombre') &&
          !nombre.toLowerCase().includes('total')) {
        productos.push({
          nombre: nombre.replace(/^[•\s]+/, ''), // Remover símbolos al inicio
          cantidad: cantidad
        });
      }
    } else {
      // Buscar productos con formato "Producto - $precio"
      const match2 = linea.match(/([^-]+)\s*-\s*\$?([\d,]+)/i);
      if (match2 && !linea.toLowerCase().includes('total')) {
        const nombre = match2[1].trim();
        
        // Filtrar líneas que no son productos
        if (!nombre.toLowerCase().includes('teléfono') && 
            !nombre.toLowerCase().includes('dirección') &&
            !nombre.toLowerCase().includes('email') &&
            !nombre.toLowerCase().includes('nombre')) {
          productos.push({
            nombre: nombre.replace(/^[•\s]+/, ''), // Remover símbolos al inicio
            cantidad: 1
          });
        }
      }
    }
  });
  
  return productos;
}

// Función para enviar email de pago habilitado
async function enviarEmailPagoHabilitado({
  nombre,
  email,
  ticketNumber,
  descripcion,
  metodoPago
}: {
  nombre: string;
  email: string;
  ticketNumber: string;
  descripcion: string;
  metodoPago: string;
}) {
  try {
    const total = extraerTotal(descripcion);
    const productos = extraerProductos(descripcion);
    
         let instruccionesPago = '';
    
         if (metodoPago === 'TRANSFERENCIA_BANCARIA') {
       instruccionesPago = `
         <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
           <h3 style="color: #1e40af; margin-top: 0;">🏦 Datos Bancarios para Transferencia</h3>
                       <p><strong>Banco:</strong> Banco Santander</p>
           <p><strong>Titular:</strong> Aníbal Leonardo Bergallo</p>
           <p><strong>CUIT/CUIL:</strong> 23-27487833-9</p>
           <p><strong>Tipo de Cuenta:</strong> Cuenta Corriente</p>
           <p><strong>CBU:</strong> 0720156788000001781072</p>
           <p><strong>Alias:</strong> IT360.SOLUCIONES</p>
           <p><strong>Monto a transferir:</strong> $${total.toFixed(2)}</p>
         </div>
         
         <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
           <p style="margin: 0; color: #92400e;">
             <strong>⚠️ Importante:</strong> Una vez realizada la transferencia, envía el comprobante a <strong>it360tecnologia@gmail.com</strong> con el número de ticket: <strong>${ticketNumber}</strong>
           </p>
         </div>
         
                   <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:3001/pagar/${ticketNumber}" style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🏦 Ir a la página de pago
            </a>
          </div>
       `;
    } else if (metodoPago === 'MERCADOPAGO') {
      instruccionesPago = `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">💳 Pago con MercadoPago</h3>
          <p>Para completar tu compra con MercadoPago, sigue estos pasos:</p>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>Haz clic en el botón "Pagar con MercadoPago"</li>
            <li>Completa los datos de pago</li>
            <li>Confirma la transacción</li>
            <li>Recibirás confirmación por email</li>
          </ol>
          <p><strong>Monto a pagar:</strong> $${total.toFixed(2)}</p>
        </div>
        
                 <div style="text-align: center; margin: 25px 0;">
           <a href="http://localhost:3001/pagar/${ticketNumber}" style="background-color: #00d4aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
             💳 Pagar con MercadoPago
           </a>
         </div>
      `;
    }

    if (!resend) {
      console.warn('⚠️ Resend no configurado. Email no enviado.');
      return;
    }

    const { error } = await resend.emails.send({
      from: 'IT360 Soluciones <onboarding@resend.dev>',
      to: email,
      subject: `✅ Pago Habilitado - Ticket ${ticketNumber} - IT360 Soluciones`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Pago Habilitado</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Tu solicitud de compra ha sido aprobada</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #374151; margin-top: 0;">¡Hola ${nombre}!</h2>
            
            <p>Tu solicitud de compra ha sido <strong>aprobada</strong> y el pago está habilitado.</p>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">📋 Detalles de tu pedido</h3>
              <p><strong>Número de Ticket:</strong> ${ticketNumber}</p>
              <p><strong>Método de Pago:</strong> ${metodoPago === 'TRANSFERENCIA_BANCARIA' ? 'Transferencia Bancaria' : 'MercadoPago'}</p>
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            </div>
            
            ${instruccionesPago}
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">📦 Productos solicitados:</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${productos.map(p => `<li>${p.nombre} - Cantidad: ${p.cantidad}</li>`).join('')}
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>📞 ¿Necesitas ayuda?</strong> Contactanos:<br>
                📧 it360tecnologia@gmail.com<br>
                📱 +54 9 342 508-9906
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
              Gracias por elegir IT360 Soluciones
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Error enviando email:', error);
      
      // Intentar con Gmail como fallback
      try {
        await enviarEmailGmailFallback({
          nombre,
          email,
          ticketNumber,
          descripcion,
          metodoPago
        });
      } catch (gmailError) {
        console.error('Error con Gmail fallback:', gmailError);
      }
    } else {
      console.log('✅ Email de pago habilitado enviado a:', email);
    }

  } catch (error) {
    console.error('Error en función de email:', error);
  }
}

// Función para vaciar el carrito del usuario
async function vaciarCarritoUsuario(email: string) {
  try {
    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`Usuario no encontrado para email: ${email}`);
      return;
    }

    // Buscar el carrito del usuario
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true }
    });

    if (!cart) {
      console.log(`Carrito no encontrado para usuario: ${user.id}`);
      return;
    }

    // Eliminar todos los items del carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    console.log(`✅ Carrito vaciado para usuario: ${email}`);
  } catch (error) {
    console.error('Error vaciando carrito:', error);
  }
}

// Función para extraer total de la descripción
function extraerTotal(descripcion: string): number {
  const match = descripcion.match(/Total[:\s]*\$?([\d,]+)/i);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  
  const match2 = descripcion.match(/Total[:\s]*\$?(\d+(?:\.\d{2})?)/i);
  return match2 ? parseFloat(match2[1]) : 0;
}

// Función de fallback con Gmail
async function enviarEmailGmailFallback({ nombre, email, ticketNumber, descripcion, metodoPago }: {
  nombre: string;
  email: string;
  ticketNumber: string;
  descripcion: string;
  metodoPago: string;
}) {
  try {
    const nodemailer = await import('nodemailer');
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.log('⚠️ Gmail no configurado para fallback');
      return;
    }

    const transporter = nodemailer.default.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    // Extraer información del ticket
    const productos = [];
    const lines = descripcion.split('\n');
    
    for (const line of lines) {
      const match = line.match(/•\s*(.+?)\s*-\s*x(\d+)\s*-\s*\$([\d,]+\.?\d*)/);
      if (match) {
        productos.push({
          nombre: match[1].trim(),
          cantidad: parseInt(match[2]),
          precio: parseFloat(match[3].replace(',', ''))
        });
      }
    }
    
    const total = extraerTotal(descripcion);

    // Generar instrucciones de pago
    let instruccionesPago = '';
    if (metodoPago === 'TRANSFERENCIA_BANCARIA') {
      instruccionesPago = `
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">🏦 Datos Bancarios</h3>
          <p><strong>Banco:</strong> Santander</p>
          <p><strong>Titular:</strong> Aníbal Leonardo Bergallo</p>
          <p><strong>CBU:</strong> 0720156788000001781072</p>
          <p><strong>Alias:</strong> IT360.SOLUCIONES</p>
          <p><strong>Monto a transferir:</strong> $${total.toFixed(2)}</p>
        </div>
      `;
    } else {
      instruccionesPago = `
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h3 style="color: #15803d; margin-top: 0;">💳 Pago con MercadoPago</h3>
          <p>Haz clic en el enlace de abajo para proceder con el pago:</p>
          <a href="${process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL : 'http://localhost:3000'}/pagar/${ticketNumber}" 
             style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 0;">
            💳 PAGAR AHORA
          </a>
        </div>
      `;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `✅ ¡Pago Habilitado! - ${ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Pago Habilitado</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Tu solicitud de compra ha sido aprobada</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #374151; margin-top: 0;">¡Hola ${nombre}!</h2>
            
            <p>Tu solicitud de compra ha sido <strong>aprobada</strong> y el pago está habilitado.</p>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">📋 Detalles de tu pedido</h3>
              <p><strong>Número de Ticket:</strong> ${ticketNumber}</p>
              <p><strong>Método de Pago:</strong> ${metodoPago === 'TRANSFERENCIA_BANCARIA' ? 'Transferencia Bancaria' : 'MercadoPago'}</p>
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            </div>
            
            ${instruccionesPago}
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">📦 Productos solicitados:</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${productos.map(p => `<li>${p.nombre} - Cantidad: ${p.cantidad}</li>`).join('')}
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>📞 ¿Necesitas ayuda?</strong> Contactanos:<br>
                📧 it360tecnologia@gmail.com<br>
                📱 +54 9 342 508-9906
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
              Gracias por elegir IT360 Soluciones
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de pago habilitado enviado con Gmail a:', email);

  } catch (error) {
    console.error('Error enviando email con Gmail:', error);
    throw error;
  }
}
