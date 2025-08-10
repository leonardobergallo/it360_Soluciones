import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en API de prueba' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'POST funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
} 
