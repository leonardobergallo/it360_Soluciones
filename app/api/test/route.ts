import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'POST funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
} 
