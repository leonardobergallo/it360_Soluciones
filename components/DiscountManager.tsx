'use client';

import { useState, useEffect } from 'react';

interface VolumeDiscount {
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage: number;
  discountAmount?: number;
}

interface CustomerDiscount {
  customerType: 'wholesale' | 'retail' | 'vip' | 'bulk';
  discountPercentage: number;
  discountAmount?: number;
  minOrderValue?: number;
}

interface DiscountManagerProps {
  productId: string;
  currentVolumeDiscounts?: VolumeDiscount[];
  currentCustomerDiscounts?: CustomerDiscount[];
  onSave: (volumeDiscounts: VolumeDiscount[], customerDiscounts: CustomerDiscount[]) => void;
  className?: string;
}

export default function DiscountManager({
  productId,
  currentVolumeDiscounts = [],
  currentCustomerDiscounts = [],
  onSave,
  className = ""
}: DiscountManagerProps) {
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscount[]>(currentVolumeDiscounts);
  const [customerDiscounts, setCustomerDiscounts] = useState<CustomerDiscount[]>(currentCustomerDiscounts);
  const [activeTab, setActiveTab] = useState<'volume' | 'customer'>('volume');

  // Plantillas predefinidas
  const volumeTemplates = [
    {
      name: "Descuento Básico",
      discounts: [
        { minQuantity: 5, discountPercentage: 5 },
        { minQuantity: 10, discountPercentage: 10 },
        { minQuantity: 20, discountPercentage: 15 }
      ]
    },
    {
      name: "Descuento Agresivo",
      discounts: [
        { minQuantity: 3, discountPercentage: 8 },
        { minQuantity: 6, discountPercentage: 15 },
        { minQuantity: 12, discountPercentage: 25 },
        { minQuantity: 25, discountPercentage: 35 }
      ]
    },
    {
      name: "Descuento Conservador",
      discounts: [
        { minQuantity: 10, discountPercentage: 3 },
        { minQuantity: 25, discountPercentage: 7 },
        { minQuantity: 50, discountPercentage: 12 }
      ]
    }
  ];

  const customerTemplates = [
    {
      name: "Mayorista",
      discounts: [
        { customerType: 'wholesale' as const, discountPercentage: 20, minOrderValue: 100000 },
        { customerType: 'bulk' as const, discountPercentage: 15, minOrderValue: 50000 }
      ]
    },
    {
      name: "VIP",
      discounts: [
        { customerType: 'vip' as const, discountPercentage: 10, minOrderValue: 0 },
        { customerType: 'retail' as const, discountPercentage: 5, minOrderValue: 10000 }
      ]
    }
  ];

  const addVolumeDiscount = () => {
    setVolumeDiscounts([...volumeDiscounts, {
      minQuantity: 1,
      discountPercentage: 0
    }]);
  };

  const removeVolumeDiscount = (index: number) => {
    setVolumeDiscounts(volumeDiscounts.filter((_, i) => i !== index));
  };

  const updateVolumeDiscount = (index: number, field: keyof VolumeDiscount, value: any) => {
    const updated = [...volumeDiscounts];
    updated[index] = { ...updated[index], [field]: value };
    setVolumeDiscounts(updated);
  };

  const addCustomerDiscount = () => {
    setCustomerDiscounts([...customerDiscounts, {
      customerType: 'retail',
      discountPercentage: 0
    }]);
  };

  const removeCustomerDiscount = (index: number) => {
    setCustomerDiscounts(customerDiscounts.filter((_, i) => i !== index));
  };

  const updateCustomerDiscount = (index: number, field: keyof CustomerDiscount, value: any) => {
    const updated = [...customerDiscounts];
    updated[index] = { ...updated[index], [field]: value };
    setCustomerDiscounts(updated);
  };

  const applyTemplate = (template: any, type: 'volume' | 'customer') => {
    if (type === 'volume') {
      setVolumeDiscounts(template.discounts);
    } else {
      setCustomerDiscounts(template.discounts);
    }
  };

  const handleSave = () => {
    onSave(volumeDiscounts, customerDiscounts);
  };

  const validateDiscounts = () => {
    const errors: string[] = [];

    // Validar descuentos por volumen
    volumeDiscounts.forEach((discount, index) => {
      if (discount.minQuantity <= 0) {
        errors.push(`Descuento por volumen ${index + 1}: La cantidad mínima debe ser mayor a 0`);
      }
      if (discount.discountPercentage < 0 || discount.discountPercentage > 100) {
        errors.push(`Descuento por volumen ${index + 1}: El porcentaje debe estar entre 0 y 100`);
      }
      if (discount.maxQuantity && discount.maxQuantity <= discount.minQuantity) {
        errors.push(`Descuento por volumen ${index + 1}: La cantidad máxima debe ser mayor a la mínima`);
      }
    });

    // Validar descuentos por cliente
    customerDiscounts.forEach((discount, index) => {
      if (discount.discountPercentage < 0 || discount.discountPercentage > 100) {
        errors.push(`Descuento por cliente ${index + 1}: El porcentaje debe estar entre 0 y 100`);
      }
      if (discount.minOrderValue && discount.minOrderValue < 0) {
        errors.push(`Descuento por cliente ${index + 1}: El valor mínimo de orden debe ser positivo`);
      }
    });

    return errors;
  };

  const errors = validateDiscounts();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🎯 Gestión de Descuentos
        </h3>
        <p className="text-gray-600">
          Configura descuentos por volumen y tipo de cliente
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('volume')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'volume'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📦 Por Volumen
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'customer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            👥 Por Cliente
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Descuentos por Volumen */}
        {activeTab === 'volume' && (
          <div>
            {/* Plantillas */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Plantillas Predefinidas</h4>
              <div className="flex flex-wrap gap-2">
                {volumeTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template, 'volume')}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de descuentos */}
            <div className="space-y-4">
              {volumeDiscounts.map((discount, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cantidad Mínima
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={discount.minQuantity}
                        onChange={(e) => updateVolumeDiscount(index, 'minQuantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cantidad Máxima
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={discount.maxQuantity || ''}
                        onChange={(e) => updateVolumeDiscount(index, 'maxQuantity', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Sin límite"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descuento (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discount.discountPercentage}
                        onChange={(e) => updateVolumeDiscount(index, 'discountPercentage', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descuento Fijo ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={discount.discountAmount || ''}
                        onChange={(e) => updateVolumeDiscount(index, 'discountAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeVolumeDiscount(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addVolumeDiscount}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Agregar Descuento por Volumen
            </button>
          </div>
        )}

        {/* Descuentos por Cliente */}
        {activeTab === 'customer' && (
          <div>
            {/* Plantillas */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Plantillas Predefinidas</h4>
              <div className="flex flex-wrap gap-2">
                {customerTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template, 'customer')}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de descuentos */}
            <div className="space-y-4">
              {customerDiscounts.map((discount, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo de Cliente
                      </label>
                      <select
                        value={discount.customerType}
                        onChange={(e) => updateCustomerDiscount(index, 'customerType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="retail">Retail</option>
                        <option value="wholesale">Mayorista</option>
                        <option value="vip">VIP</option>
                        <option value="bulk">Compra Masiva</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descuento (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discount.discountPercentage}
                        onChange={(e) => updateCustomerDiscount(index, 'discountPercentage', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descuento Fijo ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={discount.discountAmount || ''}
                        onChange={(e) => updateCustomerDiscount(index, 'discountAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Opcional"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Orden Mínima ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={discount.minOrderValue || ''}
                        onChange={(e) => updateCustomerDiscount(index, 'minOrderValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Sin mínimo"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeCustomerDiscount(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addCustomerDiscount}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Agregar Descuento por Cliente
            </button>
          </div>
        )}

        {/* Errores */}
        {errors.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Errores de validación:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleSave}
            disabled={errors.length > 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            💾 Guardar Descuentos
          </button>
        </div>
      </div>
    </div>
  );
}
