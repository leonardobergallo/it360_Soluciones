"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Función para leer el archivo CSV
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Por favor selecciona un archivo CSV válido');
      return;
    }

    setFile(selectedFile);
    setError('');
    setMessage('');

    try {
      const text = await selectedFile.text();
      const products = parseCSV(text);
      setPreview(products);
    } catch (err) {
      setError('Error al leer el archivo CSV');
      console.error(err);
    }
  };

  // Función para parsear CSV
  const parseCSV = (csvText: string): Product[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('El archivo CSV debe tener al menos una fila de encabezados y una fila de datos');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'description', 'price', 'stock', 'category'];
    
    // Verificar que estén todos los headers requeridos
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Faltan los siguientes campos: ${missingHeaders.join(', ')}`);
    }

    const products: Product[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Manejar comas dentro de campos (campos con comillas)
      const values = parseCSVLine(line);
      
      if (values.length < 5) {
        console.warn(`Fila ${i + 1} ignorada: datos insuficientes`);
        continue;
      }

      const product: Product = {
        name: values[headers.indexOf('name')]?.trim() || '',
        description: values[headers.indexOf('description')]?.trim() || '',
        price: parseFloat(values[headers.indexOf('price')]?.trim() || '0'),
        stock: parseInt(values[headers.indexOf('stock')]?.trim() || '0'),
        category: values[headers.indexOf('category')]?.trim() || '',
        image: values[headers.indexOf('image')]?.trim() || ''
      };

      // Validar datos básicos
      if (product.name && product.description && product.price > 0) {
        products.push(product);
      } else {
        console.warn(`Fila ${i + 1} ignorada: datos inválidos`);
      }
    }

    return products;
  };

  // Función para parsear línea CSV con comas dentro de campos
  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values.map(v => v.replace(/^"|"$/g, '')); // Remover comillas del inicio y final
  };

  // Función para importar productos
  const handleImport = async () => {
    if (!preview.length) {
      setError('No hay productos para importar');
      return;
    }

    setImporting(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/import-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products: preview })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.imported} productos importados exitosamente`);
        setPreview([]);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(data.error || 'Error al importar productos');
      }
    } catch (err) {
      setError('Error de conexión al importar productos');
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  // Función para descargar template CSV
  const downloadTemplate = () => {
    const template = `name,description,price,stock,category,image
"Laptop HP Pavilion","Laptop de alta gama con procesador Intel i7",150000,10,"Computadoras","https://ejemplo.com/laptop.jpg"
"Mouse Gaming","Mouse inalámbrico para gaming profesional",25000,50,"Periféricos","https://ejemplo.com/mouse.jpg"
"Monitor 24 pulgadas","Monitor LED Full HD 1920x1080",45000,15,"Monitores","https://ejemplo.com/monitor.jpg"`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_productos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              📦 Importar Productos desde CSV
            </h1>
            <p className="text-white/70 text-lg">
              Carga múltiples productos de forma rápida desde un archivo Excel/CSV
            </p>
          </div>

          {/* Mensajes */}
          {message && (
            <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 rounded-2xl px-6 py-4 mb-6 text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-6 py-4 mb-6 text-center">
              ❌ {error}
            </div>
          )}

          {/* Instrucciones */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📋 Instrucciones</h2>
            <div className="grid md:grid-cols-2 gap-6 text-white/80">
              <div>
                <h3 className="font-semibold text-white mb-2">Formato del CSV:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>name:</strong> Nombre del producto (requerido)</li>
                  <li>• <strong>description:</strong> Descripción del producto (requerido)</li>
                  <li>• <strong>price:</strong> Precio en pesos (requerido)</li>
                  <li>• <strong>stock:</strong> Cantidad en stock (requerido)</li>
                  <li>• <strong>category:</strong> Categoría del producto (requerido)</li>
                  <li>• <strong>image:</strong> URL de la imagen (opcional)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Pasos:</h3>
                <ol className="space-y-1 text-sm">
                  <li>1. Descarga el template de ejemplo</li>
                  <li>2. Completa con tus productos</li>
                  <li>3. Guarda como archivo CSV</li>
                  <li>4. Sube el archivo aquí</li>
                  <li>5. Revisa la vista previa</li>
                  <li>6. Confirma la importación</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              📥 Descargar Template CSV
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
            >
              📁 Seleccionar Archivo CSV
            </button>
          </div>

          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Vista previa */}
          {preview.length > 0 && (
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  👀 Vista Previa ({preview.length} productos)
                </h2>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Importando...
                    </>
                  ) : (
                    <>
                      🚀 Importar {preview.length} Productos
                    </>
                  )}
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {preview.map((product, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2 truncate">{product.name}</h3>
                    <p className="text-white/70 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="space-y-1 text-xs text-white/60">
                      <p><strong>Precio:</strong> ${product.price.toLocaleString()}</p>
                      <p><strong>Stock:</strong> {product.stock}</p>
                      <p><strong>Categoría:</strong> {product.category}</p>
                      {product.image && (
                        <p><strong>Imagen:</strong> {product.image.length > 30 ? product.image.substring(0, 30) + '...' : product.image}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón volver */}
          <div className="text-center">
            <button
              onClick={() => router.push('/admin')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20"
            >
              ← Volver al Panel de Administración
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 