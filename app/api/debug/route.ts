import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Verificar variables de entorno
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    // Intentar conectar a la base de datos
    let dbConnection = 'UNKNOWN';
    let userCount = 0;
    
    try {
      await prisma.$connect();
      dbConnection = 'SUCCESS';
      
      // Intentar una consulta simple
      userCount = await prisma.user.count();
    } catch (dbError) {
      dbConnection = `ERROR: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`;
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        connection: dbConnection,
        userCount: userCount
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 