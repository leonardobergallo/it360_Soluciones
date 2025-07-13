import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: Listar todos los mensajes
export async function GET() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(contacts);
}

// POST: Crear un nuevo mensaje
export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
  }
  const contact = await prisma.contact.create({
    data: { name, email, message },
  });
  return NextResponse.json(contact);
}

// DELETE: Eliminar un mensaje por id
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
  }
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 