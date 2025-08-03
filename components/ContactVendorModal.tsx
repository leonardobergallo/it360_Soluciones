"use client";

import React, { useState, useEffect } from 'react';

// Interfaz para las props del componente
interface ContactVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    name: string;
    price: number;
    description: string;
  };
  selectedProducts?: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

// Componente principal del modal de contacto con vendedor
export default function ContactVendorModal({ isOpen, onClose, product, selectedProducts }: ContactVendorModalProps) {
  // Estados para manejar el formulario y la UI
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  // Función para manejar la tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Agregar event listener cuando el modal está abierto
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    // Cleanup: remover event listener y restaurar scroll
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Generar mensaje inicial basado en productos seleccionados
  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      const productNames = selectedProducts.map(p => p.name).join(', ');
      const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      setFormData(prev => ({
        ...prev,
        mensaje: `Me interesan los siguientes productos: ${productNames}. Precio total: $${totalPrice.toLocaleString()}. ¿Podrían darme más información sobre disponibilidad y formas de pago?`
      }));
    } else if (product) {
      setFormData(prev => ({
        ...prev,
        mensaje: `Me interesa el producto: ${product.name}. ¿Podrían darme más información?`
      }));
    }
  }, [product, selectedProducts]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Preparar datos de productos
      let productosInfo = '';
      let precioTotal = 0;
      
      if (selectedProducts && selectedProducts.length > 0) {
        productosInfo = selectedProducts.map(p => p.name).join(', ');
        precioTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      } else if (product) {
        productosInfo = product.name;
        precioTotal = product.price;
      }

      // Crear ticket usando el sistema unificado
      const ticketData = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || '',
        empresa: '',
        tipo: 'producto',
        categoria: 'venta',
        asunto: `Consulta sobre producto${selectedProducts && selectedProducts.length > 1 ? 's' : ''}: ${productosInfo}`,
        descripcion: `${formData.mensaje}\n\nProductos: ${productosInfo}\nPrecio total: $${precioTotal.toLocaleString()}`,
        urgencia: 'normal',
        prioridad: 'media'
      };

      // Llamada a la API de tickets unificada
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la consulta');
      }

      // Si todo sale bien, mostrar éxito
      setSuccess(true);
      
      // Limpiar el formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });

      // Mostrar número de ticket si está disponible
      if (data.ticket?.ticketNumber) {
        alert(`✅ Consulta enviada exitosamente!\n\nNúmero de ticket: ${data.ticket.ticketNumber}\n\nNos pondremos en contacto contigo pronto.`);
      }

      // Cerrar el modal después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir WhatsApp directamente
  const handleWhatsAppDirect = () => {
    const phone = "5493425089906"; // Número de WhatsApp de IT360
    
    let message = '';
    if (selectedProducts && selectedProducts.length > 0) {
      const productNames = selectedProducts.map(p => p.name).join(', ');
      const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      message = `¡Hola! Me interesan los siguientes productos: ${productNames}\n` +
                `Precio total: $${totalPrice.toLocaleString()}\n\n` +
                `¿Podrían ayudarme con más información sobre disponibilidad y formas de pago?`;
    } else {
      message = `¡Hola! Me interesa el producto: ${product?.name || 'Producto'}\n` +
                `Precio: $${product?.price?.toLocaleString() || 'Consultar'}\n\n` +
                `¿Podrían ayudarme con más información?`;
    }
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    // Overlay del modal con fondo oscuro y blur
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose} // Cerrar al hacer clic en el overlay
    >
      {/* Contenedor principal del modal */}
      <div 
        className="bg-white rounded-xl sm:rounded-2xl max-w-xs sm:max-w-sm md:max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()} // Prevenir que se cierre al hacer clic dentro del modal
      >
        
        {/* Header del modal */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 sm:p-4 md:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold">Contactar Vendedor</h2>
              <p className="text-cyan-100 text-xs sm:text-sm mt-1">
                {selectedProducts && selectedProducts.length > 0 
                  ? `${selectedProducts.length} producto${selectedProducts.length > 1 ? 's' : ''} seleccionado${selectedProducts.length > 1 ? 's' : ''}`
                  : product?.name 
                    ? `Sobre: ${product.name}` 
                    : 'Consulta general'
                }
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-cyan-200 text-xl sm:text-2xl font-bold p-1 rounded-full hover:bg-white/20 transition-colors"
              title="Cerrar (Esc)"
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-3 sm:p-4 md:p-6">
          {/* Información del producto o productos seleccionados */}
          {selectedProducts && selectedProducts.length > 0 ? (
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 border border-cyan-200">
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Productos Seleccionados ({selectedProducts.length})</h3>
              <div className="space-y-2 mb-2 sm:mb-3">
                {selectedProducts.map((prod, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{prod.name}</span>
                    <span className="text-xs sm:text-sm font-bold text-cyan-600">${prod.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cyan-200 pt-2 sm:pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm sm:text-base">Total:</span>
                  <span className="text-lg sm:text-xl font-bold text-cyan-600">
                    ${selectedProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : product && (
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 border border-cyan-200">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{product.name}</h3>
              <p className="text-lg sm:text-2xl font-bold text-cyan-600 mb-2">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                {product.description}
              </p>
            </div>
          )}

          {/* Botón de WhatsApp directo */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={handleWhatsAppDirect}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Contactar por WhatsApp
            </button>
            <p className="text-center text-gray-500 text-xs sm:text-sm mt-2">
              O completa el formulario para recibir un email de confirmación
            </p>
          </div>

          {/* Formulario de contacto */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Campo Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-xs sm:text-sm md:text-base"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-xs sm:text-sm md:text-base"
                placeholder="tu@email.com"
              />
            </div>

            {/* Campo Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-xs sm:text-sm md:text-base"
                placeholder="+54 9 342 123 4567"
              />
            </div>

            {/* Campo Mensaje */}
            <div>
              <label htmlFor="mensaje" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Tu consulta *
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors resize-none text-xs sm:text-sm md:text-base"
                placeholder="Describe tu consulta o pregunta..."
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                ¡Consulta enviada con éxito! Hemos recibido tu solicitud y nos pondremos en contacto contigo lo antes posible.
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando consulta...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar consulta
                </>
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
            <p>• Recibirás un email de confirmación</p>
            <p>• Te contactaremos en las próximas 24 horas</p>
            <p>• También puedes contactarnos por WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
