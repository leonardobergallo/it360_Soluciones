import { NextRequest, NextResponse } from 'next/server';

// Simulación de MercadoPago para pruebas
// En producción, usar las credenciales reales

export async function POST(request: NextRequest) {
  try {
    const { ticketNumber, amount, description, customerEmail, customerName } = await request.json();

    if (!ticketNumber || !amount || !description) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar datos para la simulación
    console.log('Simulando pago de MercadoPago:', {
      ticketNumber,
      amount,
      description,
      customerEmail,
      customerName
    });

    // Simulación de MercadoPago para pruebas
    // En producción, usar la API real de MercadoPago
    const mockResponse = {
      init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TEST-${Date.now()}`,
      id: `TEST-${Date.now()}`
    };

    return NextResponse.json({
      success: true,
      init_point: mockResponse.init_point,
      preference_id: mockResponse.id
    });

  } catch (error) {
    console.error('Error al crear preferencia de MercadoPago:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
