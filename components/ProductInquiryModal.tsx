"use client";

import { useState } from 'react';

interface ProductInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm?: string;
}

export default function ProductInquiryModal({ isOpen, onClose, searchTerm = "" }: ProductInquiryModalProps) {
  const [formData, setFormData] = useState({
    productName: searchTerm,
    description: '',
    category: '',
    estimatedPrice: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Crear ticket en lugar de enviar email
      const response = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.customerName,
          email: formData.customerEmail,
          telefono: formData.customerPhone,
          tipo: 'consulta',
          categoria: 'producto',
          asunto: `Consulta de Producto: ${formData.productName}`,
          descripcion: `
Consulta de Producto No Disponible

Producto solicitado: ${formData.productName}
Descripción: ${formData.description}
Categoría: ${formData.category}
Precio estimado: ${formData.estimatedPrice ? '$' + formData.estimatedPrice : 'No especificado'}

Mensaje adicional:
${formData.message}

---
Esta consulta fue enviada desde el catálogo de productos.
          `,
          urgencia: 'normal',
          prioridad: 'media'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus('success');
        setFormData({
          productName: '',
          description: '',
          category: '',
          estimatedPrice: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          message: ''
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                🔍 Consultar Producto
              </h2>
              <p className="text-gray-600 mt-1">
                ¿No encuentras lo que buscas? ¡Déjanos saber qué necesitas!
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Producto solicitado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto que buscas *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: iPhone 15 Pro, MacBook Air M2, etc."
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del producto
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe las características específicas que necesitas..."
              />
            </div>

            {/* Categoría y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Celulares">Celulares</option>
                  <option value="Notebooks">Notebooks</option>
                  <option value="Monitores">Monitores</option>
                  <option value="Audio">Audio</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Almacenamiento">Almacenamiento</option>
                  <option value="Accesorios Auto">Accesorios Auto</option>
                  <option value="Electrodomésticos">Electrodomésticos</option>
                  <option value="Cámaras">Cámaras</option>
                  <option value="Redes">Redes</option>
                  <option value="Periféricos">Periféricos</option>
                  <option value="Muebles">Muebles</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio estimado
                </label>
                <input
                  type="number"
                  name="estimatedPrice"
                  value={formData.estimatedPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 500000"
                />
              </div>
            </div>

            {/* Datos del cliente */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📞 Tus datos de contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
            </div>

            {/* Mensaje adicional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje adicional
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="¿Alguna especificación adicional? ¿Cuándo lo necesitas? ¿Presupuesto aproximado?"
              />
            </div>

            {/* Submit Status */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-green-600 text-xl mr-2">🎫</span>
                  <div>
                    <p className="text-green-800 font-medium">
                      ¡Ticket creado exitosamente!
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Hemos creado un ticket con tu consulta. Te contactaremos pronto.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-600 text-xl mr-2">❌</span>
                  <p className="text-red-800 font-medium">
                    Error al enviar la consulta. Intenta nuevamente.
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
