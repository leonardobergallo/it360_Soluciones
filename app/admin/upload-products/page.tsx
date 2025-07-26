'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UploadResult {
  success: boolean;
  message: string;
  createdCount?: number;
  errorCount?: number;
  errors?: string[];
}

export default function UploadProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload-products', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Error al subir el archivo'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/admin/upload-products');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla-productos.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Error al descargar la plantilla');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Subir Productos desde Excel
          </h1>
          <p className="text-gray-600">
            Sube un archivo Excel con tus productos para cargarlos masivamente
          </p>
        </div>

        {/* Plantilla */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Descargar Plantilla
          </h2>
          <p className="text-gray-600 mb-4">
            Descarga la plantilla Excel para ver el formato requerido
          </p>
          <button
            onClick={downloadTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📥 Descargar Plantilla
          </button>
        </div>

        {/* Formato requerido */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Formato Requerido
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Columna</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Requerido</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">name</td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Sí</td>
                  <td className="border border-gray-300 px-4 py-2">Nombre del producto</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">description</td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Sí</td>
                  <td className="border border-gray-300 px-4 py-2">Descripción del producto</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">price</td>
                  <td className="border border-gray-300 px-4 py-2">Número</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Sí</td>
                  <td className="border border-gray-300 px-4 py-2">Precio del producto</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">stock</td>
                  <td className="border border-gray-300 px-4 py-2">Número</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Sí</td>
                  <td className="border border-gray-300 px-4 py-2">Cantidad en stock</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">category</td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Sí</td>
                  <td className="border border-gray-300 px-4 py-2">Categoría del producto</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">image</td>
                  <td className="border border-gray-300 px-4 py-2">URL</td>
                  <td className="border border-gray-300 px-4 py-2">❌ No</td>
                  <td className="border border-gray-300 px-4 py-2">URL de la imagen</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">active</td>
                  <td className="border border-gray-300 px-4 py-2">Booleano</td>
                  <td className="border border-gray-300 px-4 py-2">❌ No</td>
                  <td className="border border-gray-300 px-4 py-2">Producto activo (true/false)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Subida de archivo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📤 Subir Archivo Excel
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar archivo Excel (.xlsx, .xls)
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {file && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  ✅ Archivo seleccionado: <strong>{file.name}</strong>
                </p>
                <p className="text-green-600 text-sm">
                  Tamaño: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                !file || isUploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isUploading ? '⏳ Procesando...' : '🚀 Subir Productos'}
            </button>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <div className={`rounded-lg p-6 ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? '✅ Éxito' : '❌ Error'}
            </h3>
            <p className={`mb-4 ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>

            {result.success && (
              <div className="space-y-2">
                {result.createdCount !== undefined && (
                  <p className="text-green-700">
                    📦 Productos creados: <strong>{result.createdCount}</strong>
                  </p>
                )}
                {result.errorCount !== undefined && result.errorCount > 0 && (
                  <p className="text-yellow-700">
                    ⚠️ Errores: <strong>{result.errorCount}</strong>
                  </p>
                )}
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-red-800 mb-2">Detalles de errores:</h4>
                <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                  {result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Botón volver */}
        <div className="mt-8">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Volver al Panel
          </button>
        </div>
      </div>
    </div>
  );
} 