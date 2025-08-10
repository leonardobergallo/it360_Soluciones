import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function verificarTickets() {
  console.log('🔍 Verificando todos los tickets...\n');

  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Total de tickets: ${tickets.length}\n`);

    tickets.forEach((ticket, index) => {
      console.log(`${index + 1}. Ticket: ${ticket.ticketNumber}`);
      console.log(`   Tipo: ${ticket.tipo}`);
      console.log(`   Estado: ${ticket.estado}`);
      console.log(`   Cliente: ${ticket.nombre} (${ticket.email})`);
      console.log(`   Fecha: ${new Date(ticket.createdAt).toLocaleString()}`);
      console.log(`   Descripción: ${ticket.descripcion.substring(0, 100)}...`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarTickets();
