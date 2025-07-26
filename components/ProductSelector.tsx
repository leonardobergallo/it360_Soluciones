"use client";

import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  icon?: string;
}

interface ProductSelectorProps {
  products: Product[];
  onContact: (selectedProducts: Product[]) => void;
  onClose: () => void;
}

export default function ProductSelector({ products, onContact, onClose }: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((sum, product) => sum + product.price, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Seleccionar Productos</h2>
              <p className="text-cyan-100 text-sm mt-1">
                Selecciona los productos que te interesan para contactar al vendedor
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-cyan-200 text-2xl font-bold p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Productos disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {products.map((product) => {
              const isSelected = selectedProducts.some(p => p.id === product.id);
              return (
                <div 
                  key={product.id}
                  onClick={() => toggleProduct(product)}
                  className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 ${
                    isSelected 
                      ? 'border-cyan-500 bg-cyan-50 shadow-lg' 
                      : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
                      <p className="text-cyan-600 font-bold">${product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen de selección */}
          {selectedProducts.length > 0 && (
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Productos Seleccionados ({selectedProducts.length})
              </h3>
              <div className="space-y-2 mb-3">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{product.name}</span>
                    <span className="text-sm font-bold text-cyan-600">${product.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cyan-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-cyan-600">
                    ${getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => onContact(selectedProducts)}
              disabled={selectedProducts.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Contactar Vendedor ({selectedProducts.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
