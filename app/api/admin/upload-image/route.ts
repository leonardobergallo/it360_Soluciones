import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'No se encontró archivo de imagen' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'El archivo debe ser una imagen' }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'El archivo es demasiado grande. Máximo 5MB' }, { status: 400 });
    }

    // Crear directorio si no existe
    const imagesDir = join(process.cwd(), 'public', 'images');
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `uploaded-${timestamp}.${fileExtension}`;
    const filePath = join(imagesDir, fileName);

    // Convertir archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retornar la ruta de la imagen
    const imagePath = `/images/${fileName}`;

    return NextResponse.json({ 
      message: 'Imagen subida exitosamente',
      imagePath: imagePath,
      fileName: fileName
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al subir imagen' },
      { status: 500 }
    );
  }
}
