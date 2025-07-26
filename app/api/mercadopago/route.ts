import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import mercadopago from 'mercadopago';

// const prisma = new PrismaClient();

// Configurar MercadoPago - TEMPORALMENTE DESHABILITADO
// if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
//   mercadopago.configure({
//     access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
//   });
// }

export async function POST(request: NextRequest) {
  try {
    // Log para depuración
    console.log('Iniciando proceso de Mercado Pago...');
    console.log('MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Configurado' : 'NO CONFIGURADO');
    
    const body = await request.json();
    const { items, nombre, email, telefono, direccion, userId } = body;
    
    // Validaciones
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: 'No hay items en el carrito',
        success: false 
      }, { status: 400 });
    }
    
    if (!nombre || !email || !telefono || !direccion) {
      return NextResponse.json({ 
        error: 'Faltan datos del comprador',
        success: false 
      }, { status: 400 });
    }
    
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Error: MERCADOPAGO_ACCESS_TOKEN no configurado');
      return NextResponse.json({ 
        error: 'Configuración de Mercado Pago incompleta. Contacte al administrador.',
        success: false 
      }, { status: 500 });
    }

    // Calcular total
    const total = items.reduce((sum: number, item: { product: { price: number }; quantity: number }) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    console.log('Total calculado:', total);
    console.log('Items:', items.length);
    
    // Crear preferencia usando la API REST directamente
    const preference = {
      items: items.map((item: { product: { name: string; price: number; image?: string }; quantity: number }) => ({
        title: item.product.name,
        quantity: item.quantity,
        unit_price: Number(item.product.price),
        currency_id: 'ARS',
        picture_url: item.product.image || undefined,
      })),
      payer: {
        name: nombre,
        email: email,
        phone: { 
          number: telefono.toString() 
        },
        address: { 
          street_name: direccion 
        }
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
    };

    console.log('Creando preferencia de Mercado Pago...');
    
    try {
      // Usar fetch directamente en lugar de la librería
      const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preference)
      });
      
      console.log('Respuesta de Mercado Pago:', mpResponse.status, mpResponse.statusText);
      
      if (!mpResponse.ok) {
        const errorData = await mpResponse.text();
        console.error('Error response from MP:', errorData);
        throw new Error(`Mercado Pago error: ${mpResponse.status} - ${errorData}`);
      }
      
      const mpData = await mpResponse.json();
      console.log('Datos de MP:', mpData);
      
      if (!mpData.init_point) {
        console.error('Error: No se pudo generar el enlace de pago');
        return NextResponse.json({ 
          error: 'No se pudo generar el enlace de pago. Intente nuevamente.',
          success: false,
          details: mpData 
        }, { status: 500 });
      }

      // Guardar preferencia en base de datos para tracking - TEMPORALMENTE DESHABILITADO
      // try {
      //   await prisma.paymentPreference.create({
      //     data: {
      //       preferenceId: mpData.id,
      //       userId: userId || null,
      //       total,
      //       status: 'pending',
      //       items: JSON.stringify(items),
      //       payerInfo: JSON.stringify({ nombre, email, telefono, direccion })
      //     }
      //   });
      //   console.log('Preferencia guardada en base de datos');
      // } catch (dbError) {
      //   console.error('Error guardando preferencia en DB:', dbError);
      //   // No fallar si no se puede guardar en DB
      // }

      console.log('Proceso completado exitosamente');
      return NextResponse.json({ 
        success: true,
        url: mpData.init_point,
        preferenceId: mpData.id 
      });
      
    } catch (mpError: unknown) {
      console.error('Error Mercado Pago:', mpError);
      
      // Manejar errores específicos de Mercado Pago
      let errorMessage = 'Error al crear preferencia de pago';
      if (mpError && typeof mpError === 'object' && 'message' in mpError) {
        errorMessage = String(mpError.message);
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        success: false,
        details: mpError
      }, { status: 500 });
    }
    
  } catch (error: unknown) {
    console.error('Error en endpoint Mercado Pago:', error);
    
    // Manejar errores de parsing JSON
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('JSON')) {
      return NextResponse.json({ 
        error: 'Error en el formato de datos enviados',
        success: false
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Error interno del servidor. Intente nuevamente.',
      success: false
    }, { status: 500 });
  }
}

// Webhook para recibir notificaciones de Mercado Pago
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const paymentId = searchParams.get('data.id');
    
    console.log('Webhook recibido:', { topic, paymentId });
    
    if (topic === 'payment' && paymentId) {
      try {
        // Obtener información del pago
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!accessToken) {
          console.error('Error: No hay access token para webhook');
          return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
        }
        
        const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          console.log('Datos del pago:', paymentData);
          
          // Actualizar estado en base de datos - TEMPORALMENTE DESHABILITADO
          // if (paymentData.status === 'approved') {
          //   // Registrar venta exitosa
          //   const preference = await prisma.paymentPreference.findFirst({
          //     where: { preferenceId: paymentData.external_reference?.split('_')[1] }
          //   });
          //   
          //   if (preference) {
          //     const items = JSON.parse(preference.items);
          //     const payerInfo = JSON.parse(preference.payerInfo);
          //     
          //     // Registrar ventas
          //     for (const item of items) {
          //       await prisma.sale.create({
          //         data: {
          //           userId: preference.userId,
          //           productId: item.product.id,
          //           amount: item.product.price * item.quantity,
          //           nombre: payerInfo.nombre,
          //           email: payerInfo.email,
          //           telefono: payerInfo.telefono,
          //           direccion: payerInfo.direccion,
          //           metodoPago: 'mercadopago',
          //           paymentId: paymentId,
          //           status: 'completed'
          //         }
          //       });
          //   }
          //   
          //   // Actualizar preferencia
          //   await prisma.paymentPreference.update({
          //     where: { id: preference.id },
          //     data: { status: 'completed' }
          //   });
          //   
          //   console.log('Venta registrada exitosamente');
          // }
        } else {
          console.error('Error obteniendo datos del pago:', paymentRes.status);
        }
      } catch (error) {
        console.error('Error procesando webhook:', error);
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error en webhook:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
} 
