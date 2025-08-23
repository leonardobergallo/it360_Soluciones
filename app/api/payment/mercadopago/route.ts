import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { ticketNumber, amount, description, customerEmail, customerName } = await request.json();

    if (!ticketNumber || !amount || !description) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    // Determinar si estamos en producción o desarrollo
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? 'https://www.it360.com.ar' 
      : (process.env.NEXTAUTH_URL || 'http://localhost:3000');
    
    // Para pruebas, usar modo de simulación
    console.log('🧪 Usando modo de simulación para pruebas');
    
    // Crear una página de simulación en lugar de redirigir a MercadoPago
    const mockResponse = {
      init_point: `${baseUrl}/payment/simulation?ticket=${ticketNumber}&amount=${amount}&pref_id=TEST-${Date.now()}`,
      id: `TEST-${Date.now()}`
    };

    console.log('✅ Simulación de MercadoPago creada:', {
      ticketNumber,
      amount,
      description,
      customerEmail,
      customerName,
      preference_id: mockResponse.id,
      baseUrl
    });

    return NextResponse.json({
      success: true,
      init_point: mockResponse.init_point,
      preference_id: mockResponse.id,
      mode: 'simulation'
    });

    console.log('Creando preferencia de MercadoPago:', {
      ticketNumber,
      amount,
      description,
      customerEmail,
      customerName
    });

    // Crear preferencia usando la API REST de MercadoPago
    const preference = {
      items: [{
        title: `Ticket ${ticketNumber} - ${description}`,
        quantity: 1,
        unit_price: Number(amount),
        currency_id: 'ARS',
      }],
      payer: {
        name: customerName,
        email: customerEmail,
      },
      back_urls: {
        success: `${baseUrl}/payment/success?ticket=${ticketNumber}`,
        failure: `${baseUrl}/payment/failure?ticket=${ticketNumber}`,
        pending: `${baseUrl}/payment/pending?ticket=${ticketNumber}`,
      },
      auto_return: 'approved',
      external_reference: ticketNumber,
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
    };

    console.log('Enviando preferencia a MercadoPago...');
    
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });
    
    console.log('Respuesta de MercadoPago:', mpResponse.status, mpResponse.statusText);
    
    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error('Error de MercadoPago:', errorText);
      console.error('Status:', mpResponse.status);
      console.error('StatusText:', mpResponse.statusText);
      
      return NextResponse.json(
        { error: `Error de MercadoPago: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await mpResponse.json();
    
    console.log('Preferencia creada exitosamente:', data.id);

    return NextResponse.json({
      success: true,
      init_point: data.init_point,
      preference_id: data.id,
      mode: 'production'
    });
    
    // Código original comentado para pruebas
    /*
    // Verificar si el token es válido
    if (!accessToken) {
      console.log('⚠️ Token de MercadoPago no configurado, usando modo de simulación');
      
      // Modo de simulación para pruebas
      const mockResponse = {
        init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TEST-${Date.now()}`,
        id: `TEST-${Date.now()}`
      };

      console.log('✅ Simulación de MercadoPago creada:', {
        ticketNumber,
        amount,
        description,
        customerEmail,
        customerName,
        preference_id: mockResponse.id
      });

      return NextResponse.json({
        success: true,
        init_point: mockResponse.init_point,
        preference_id: mockResponse.id,
        mode: 'simulation'
      });
    }

    /*
    console.log('Creando preferencia de MercadoPago:', {
      ticketNumber,
      amount,
      description,
      customerEmail,
      customerName
    });

    // Crear preferencia usando la API REST de MercadoPago
    const preference = {
      items: [{
        title: `Ticket ${ticketNumber} - ${description}`,
        quantity: 1,
        unit_price: Number(amount),
        currency_id: 'ARS',
      }],
      payer: {
        name: customerName,
        email: customerEmail,
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success?ticket=${ticketNumber}`,
        failure: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/failure?ticket=${ticketNumber}`,
        pending: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/pending?ticket=${ticketNumber}`,
      },
      auto_return: 'approved',
      external_reference: ticketNumber,
      notification_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/mercadopago/webhook`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
    };

    console.log('Enviando preferencia a MercadoPago...');
    
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });
    
    console.log('Respuesta de MercadoPago:', mpResponse.status, mpResponse.statusText);
    
    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error('Error de MercadoPago:', errorText);
      console.error('Status:', mpResponse.status);
      console.error('StatusText:', mpResponse.statusText);
      
      // Si el token no es válido, usar modo de simulación
      if (mpResponse.status === 401 || mpResponse.status === 403) {
        console.log('🔄 Token inválido, cambiando a modo de simulación...');
        
        const mockResponse = {
          init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TEST-${Date.now()}`,
          id: `TEST-${Date.now()}`
        };

        console.log('✅ Simulación de MercadoPago creada:', {
          ticketNumber,
          amount,
          description,
          customerEmail,
          customerName,
          preference_id: mockResponse.id
        });

        return NextResponse.json({
          success: true,
          init_point: mockResponse.init_point,
          preference_id: mockResponse.id,
          mode: 'simulation'
        });
      }
      
      return NextResponse.json(
        { error: `Error de MercadoPago: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await mpResponse.json();
    
    console.log('Preferencia creada exitosamente:', data.id);

    return NextResponse.json({
      success: true,
      init_point: data.init_point,
      preference_id: data.id,
      mode: 'production'
    });
    */

  } catch (error) {
    console.error('Error al crear preferencia de MercadoPago:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
