import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields.map(f => f.trim());
}

export async function GET() {
  try {
    const filePathCandidates = [
      // Usar el CSV principal del proyecto
      path.join(process.cwd(), 'listaGrande.csv')
    ];

    let filePath: string | null = null;
    for (const candidate of filePathCandidates) {
      try {
        await fs.access(candidate);
        filePath = candidate;
        break;
      } catch {}
    }

    if (!filePath) {
      return NextResponse.json({ error: 'No se encontró listaGrande.csv' }, { status: 404 });
    }

    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l.length > 0);
    if (lines.length === 0) {
      return NextResponse.json({ categories: [] });
    }

    const headerFields = splitCsvLine(lines[0]);
    const rubroIndex = headerFields.findIndex(h => h.toLowerCase().includes('rubro'));
    if (rubroIndex === -1) {
      return NextResponse.json({ error: 'Columna Rubro no encontrada' }, { status: 422 });
    }

    const normalizedToDisplay = new Map<string, string>();
    for (let i = 1; i < lines.length; i++) {
      const row = splitCsvLine(lines[i]);
      if (rubroIndex < row.length) {
        const raw = row[rubroIndex] ?? '';
        const display = raw.replace(/\s+/g, ' ').trim();
        if (display) {
          const key = display.toLowerCase();
          if (!normalizedToDisplay.has(key)) {
            normalizedToDisplay.set(key, display);
          }
        }
      }
    }

    const categories = Array.from(normalizedToDisplay.values()).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando categorías' }, { status: 500 });
  }
}


