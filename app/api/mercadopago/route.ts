import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Log para depuración
    console.log('MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN);
    const body = await request.json();
    const { items, nombre, email, telefono, direccion, userId } = body;
    
    // Validaciones
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No hay items en el carrito' }, { status: 400 });
    }
    if (!nombre || !email || !telefono || !direccion) {
      return NextResponse.json({ error: 'Faltan datos del comprador' }, { status: 400 });
    }
    
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'Configuración de Mercado Pago incompleta' }, { status: 500 });
    }

    // Calcular total
    const total = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
    
    // Crear preferencia
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        items: items.map((item: any) => ({
          title: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          currency_id: 'ARS',
          picture_url: item.product.image || undefined,
        })),
        payer: {
          name: nombre,
          email,
          phone: { number: telefono },
          address: { street_name: direccion }
        },
        back_urls: {
          success: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/carrito?status=success&payment_id={payment_id}`,
          failure: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/carrito?status=failure`,
          pending: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/carrito?status=pending`,
        },
        auto_return: 'approved',
        external_reference: userId ? `user_${userId}_${Date.now()}` : `guest_${Date.now()}`,
        notification_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/mercadopago/webhook`,
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      })
    });
    
    const mpData = await mpRes.json();
    
    if (!mpRes.ok) {
      console.error('Error Mercado Pago:', mpData);
      return NextResponse.json({ 
        error: 'Error al crear preferencia de pago', 
        details: mpData.error || mpData.message 
      }, { status: 500 });
    }
    
    if (!mpData.init_point) {
      return NextResponse.json({ 
        error: 'No se pudo generar el enlace de pago', 
        details: mpData 
      }, { status: 500 });
    }

    // Guardar preferencia en base de datos para tracking
    try {
      await prisma.paymentPreference.create({
        data: {
          preferenceId: mpData.id,
          userId: userId || null,
          total,
          status: 'pending',
          items: JSON.stringify(items),
          payerInfo: JSON.stringify({ nombre, email, telefono, direccion })
        }
      });
    } catch (dbError) {
      console.error('Error guardando preferencia:', dbError);
      // No fallar si no se puede guardar en DB
    }

    return NextResponse.json({ 
      url: mpData.init_point,
      preferenceId: mpData.id 
    });
    
  } catch (error) {
    console.error('Error en endpoint Mercado Pago:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

// Webhook para recibir notificaciones de Mercado Pago
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const paymentId = searchParams.get('data.id');
  
  if (topic === 'payment' && paymentId) {
    try {
      // Obtener información del pago
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        
        // Actualizar estado en base de datos
        if (paymentData.status === 'approved') {
          // Registrar venta exitosa
          const preference = await prisma.paymentPreference.findFirst({
            where: { preferenceId: paymentData.external_reference?.split('_')[1] }
          });
          
          if (preference) {
            const items = JSON.parse(preference.items);
            const payerInfo = JSON.parse(preference.payerInfo);
            
            // Registrar ventas
            for (const item of items) {
              await prisma.sale.create({
                data: {
                  userId: preference.userId,
                  productId: item.product.id,
                  amount: item.product.price * item.quantity,
                  nombre: payerInfo.nombre,
                  email: payerInfo.email,
                  telefono: payerInfo.telefono,
                  direccion: payerInfo.direccion,
                  metodoPago: 'mercadopago',
                  paymentId: paymentId,
                  status: 'completed'
                }
              });
            }
            
            // Actualizar preferencia
            await prisma.paymentPreference.update({
              where: { id: preference.id },
              data: { status: 'completed' }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error procesando webhook:', error);
    }
  }
  
  return NextResponse.json({ ok: true });
} 