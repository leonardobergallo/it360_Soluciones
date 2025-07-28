"use client";

import AdminLayout from '@/components/AdminLayout';
import { useState, useRef } from 'react';
import Link from 'next/link';

interface CategoryMarkup {
  category: string;
  markup: number; // Porcentaje de markup
}

interface ImportedProduct {
  name: string;
  description: string;
  basePrice: number;
  category: string;
  stock: number;
  image?: string;
}

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categoryMarkups, setCategoryMarkups] = useState<CategoryMarkup[]>([
    { category: 'hardware', markup: 25 },
    { category: 'perifericos', markup: 30 },
    { category: 'monitores', markup: 20 },
    { category: 'almacenamiento', markup: 35 },
    { category: 'redes', markup: 40 },
    { category: 'impresoras', markup: 25 },
    { category: 'cables', markup: 50 },
    { category: 'accesorios', markup: 45 }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setMessage('');

    // Leer el archivo Excel
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/import-products', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPreview(data.products);
        setMessage(`✅ Archivo cargado exitosamente. ${data.products.length} productos encontrados.`);
      } else {
        const error = await response.json();
        setMessage(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      setMessage('❌ Error al procesar el archivo');
    }
  };

  const updateMarkup = (category: string, markup: number) => {
    setCategoryMarkups(prev => 
      prev.map(cat => 
        cat.category === category ? { ...cat, markup } : cat
      )
  );
  };

  const calculateFinalPrice = (basePrice: number, category: string) => {
    const markup = categoryMarkups.find(cat => cat.category === category)?.markup || 0;
    return basePrice * (1 + markup / 100);
  };

  const handleImport = async () => {
    if (!preview.length) {
      setMessage('❌ No hay productos para importar');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const productsWithMarkup = preview.map(product => ({
        ...product,
        price: calculateFinalPrice(product.basePrice, product.category)
      }));

      const response = await fetch('/api/admin/import-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: productsWithMarkup,
          categoryMarkups
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ Importación exitosa! ${result.created} productos creados.`);
        setPreview([]);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const error = await response.json();
        setMessage(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      setMessage('❌ Error durante la importación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Importar Productos</h1>
            <p className="text-gray-600">Importa productos desde Excel con markup por categoría</p>
          </div>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ← Ir al dashboard
          </Link>
        </div>

        {/* Configuración de Markup por Categoría */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Markup por Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryMarkups.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {cat.category}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={cat.markup}
                    onChange={(e) => updateMarkup(cat.category, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    min="0"
                    max="200"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subida de archivo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subir Archivo Excel</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">Sube tu archivo Excel</p>
                <p className="text-gray-500">Formatos soportados: .xlsx, .xls, .csv</p>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Seleccionar Archivo
              </button>
            </div>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>Archivo seleccionado:</strong> {file.name}
              </p>
            </div>
          )}
        </div>

        {/* Mensaje */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Vista previa */}
        {preview.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Vista Previa ({preview.length} productos)
              </h2>
              <button
                onClick={handleImport}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Importando...' : 'Importar Productos'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Base</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Markup</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Final</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.slice(0, 10).map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ${product.basePrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {categoryMarkups.find(cat => cat.category === product.category)?.markup || 0}%
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ${calculateFinalPrice(product.basePrice, product.category).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {product.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {preview.length > 10 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Mostrando 10 de {preview.length} productos
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Instrucciones para el archivo Excel</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Columnas requeridas:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>name:</strong> Nombre del producto</li>
                <li>• <strong>description:</strong> Descripción del producto</li>
                <li>• <strong>basePrice:</strong> Precio base (sin markup)</li>
                <li>• <strong>category:</strong> Categoría del producto</li>
                <li>• <strong>stock:</strong> Cantidad en stock</li>
                <li>• <strong>image:</strong> URL de la imagen (opcional)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Categorías disponibles:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {categoryMarkups.map(cat => (
                  <li key={cat.category}>• <strong>{cat.category}:</strong> {cat.markup}% markup</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
