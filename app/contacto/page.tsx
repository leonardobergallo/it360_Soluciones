'use client';

import React, { useState, useEffect } from 'react';
import ModernLogo from '@/components/ModernLogo';

// Tipos de consulta disponibles
const TIPOS_CONSULTA = [
  { id: 'general', nombre: 'Consulta General', icon: '💬', descripcion: 'Información general, dudas o preguntas' },
  { id: 'presupuesto', nombre: 'Solicitud de Presupuesto', icon: '💰', descripcion: 'Cotización para servicios o productos' },
  { id: 'soporte', nombre: 'Soporte Técnico', icon: '🔧', descripcion: 'Ayuda con problemas técnicos' },
  { id: 'hogar-inteligente', nombre: 'Hogar Inteligente', icon: '🏠', descripcion: 'Consultas sobre domótica y automatización' },
  { id: 'desarrollo', nombre: 'Desarrollo de Software', icon: '💻', descripcion: 'Aplicaciones web, móviles o sistemas' },
  { id: 'redes', nombre: 'Infraestructura y Redes', icon: '🌐', descripcion: 'Configuración de redes y servidores' },
  { id: 'venta', nombre: 'Venta de Productos', icon: '🛒', descripcion: 'Compra de equipos o productos' }
];

// Categorías de urgencia
const URGENCIAS = [
  { id: 'baja', nombre: 'Baja', color: 'text-green-500', bgColor: 'bg-green-100' },
  { id: 'normal', nombre: 'Normal', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { id: 'alta', nombre: 'Alta', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { id: 'critica', nombre: 'Crítica', color: 'text-red-500', bgColor: 'bg-red-100' }
];

export default function ContactoPage() {
  const [services, setServices] = useState<string[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [ticketCreado, setTicketCreado] = useState<{ ticketNumber: string } | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    tipoConsulta: 'general',
    urgencia: 'normal',
    asunto: '',
    descripcion: '',
    servicio: '',
    presupuesto: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Tipo de consulta, 2: Información personal, 3: Detalles

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: { name: string }[]) => setServices(data.map((s) => s.name)));
    
    // Verificar si hay un servicio pre-seleccionado en la URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const servicioParam = urlParams.get('servicio');
      if (servicioParam) {
        setForm(prev => ({
          ...prev,
          tipoConsulta: 'presupuesto',
          servicio: servicioParam
        }));
        // Ir directamente al paso 3 si hay servicio pre-seleccionado
        setStep(3);
      }
    }
  }, []);

  // Función para manejar la tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && enviado) {
        setEnviado(false);
        setStep(1);
        setTicketCreado(null);
      }
    };

    if (enviado) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [enviado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Si cambia el tipo de consulta, actualizar el asunto automáticamente
    if (name === 'tipoConsulta') {
      const tipoSeleccionado = TIPOS_CONSULTA.find(t => t.id === value);
      if (tipoSeleccionado && !form.asunto) {
        setForm(prev => ({ ...prev, asunto: tipoSeleccionado.nombre }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos requeridos estén completos
    if (!form.email || !form.telefono || !form.asunto || !form.descripcion) {
      alert('Por favor, completa todos los campos requeridos: Email, Teléfono, Asunto y Descripción.');
      return;
    }
    
    const datosCompletos = {
      nombre: form.nombre || 'Usuario',
      email: form.email,
      telefono: form.telefono,
      empresa: form.empresa || '',
      tipo: form.tipoConsulta,
      categoria: form.tipoConsulta,
      asunto: form.asunto,
      descripcion: `${form.descripcion}${form.servicio ? `\n\nServicio específico: ${form.servicio}` : ''}${form.presupuesto ? `\n\nPresupuesto estimado: $${form.presupuesto}` : ''}`,
      urgencia: form.urgencia || 'normal'
    };
    
    setLoading(true);
    
    try {
      console.log('Enviando datos:', datosCompletos); // Para debug

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletos),
      });

      const result = await res.json();
      
      if (!res.ok) {
        console.error('Error del servidor:', result);
        throw new Error(result.error || 'Error al enviar consulta');
      }
      
      setTicketCreado(result.ticket);
      setEnviado(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al enviar tu consulta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      tipoConsulta: 'general',
      urgencia: 'normal',
      asunto: '',
      descripcion: '',
      servicio: '',
      presupuesto: ''
    });
    setStep(1);
    setEnviado(false);
    setTicketCreado(null);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo futurista con animaciones */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-4 sm:py-8 lg:py-12 px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <ModernLogo size="lg" />
          </div>
          <div className="inline-block mb-3 sm:mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50"></div>
            <h1 className="relative text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Centro de Contacto
            </h1>
          </div>
          <p className="text-white/70 text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed px-3">
            Sistema unificado de consultas y soporte. Tu solicitud será procesada para atención inmediata.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Información de contacto */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-3">
                Información de Contacto
              </h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl group-hover:bg-green-500/30 transition-all duration-300 flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">WhatsApp</h3>
                  <a href="https://wa.me/5493425089906" target="_blank" rel="noopener noreferrer" className="text-green-400 font-bold hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group/link text-xs sm:text-sm lg:text-base">
                    +54 9 342 508-9906
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-400 group-hover/link:animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12 12 0 003.48 20.52l-1.3 4.77a1 1 0 001.22 1.22l4.77-1.3A12 12 0 0020.52 3.48zm-8.5 16.5a10.06 10.06 0 01-5.1-1.4l-.36-.21-2.83.77.77-2.83-.21-.36A10.06 10.06 0 013.5 12a10 10 0 1110 10zm5.7-7.3l-2.1-2.1a1 1 0 00-1.42 0l-.7.7a8 8 0 01-3.6-3.6l.7-.7a1 1 0 000-1.42l-2.1-2.1a1 1 0 00-1.42 0l-.7.7A2.5 2.5 0 005 8.5c0 5.25 4.25 9.5 9.5 9.5a2.5 2.5 0 002.5-2.5l-.7-.7a1 1 0 00-1.42 0z"/></svg>
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl group-hover:bg-blue-500/30 transition-all duration-300 flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Teléfono</h3>
                  <p className="text-white/70 text-xs sm:text-sm lg:text-lg">3425089906</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <div className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl group-hover:bg-purple-500/30 transition-all duration-300 flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Ubicación</h3>
                  <p className="text-white/70 text-xs sm:text-sm lg:text-lg">Santa Fe, Argentina</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 lg:mt-10 p-3 sm:p-4 lg:p-6 xl:p-8 backdrop-blur-md bg-cyan-500/10 border border-cyan-400/30 rounded-lg sm:rounded-xl lg:rounded-2xl">
              <h3 className="font-semibold text-white text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 lg:mb-6">¿Por qué elegirnos?</h3>
              <ul className="space-y-2 sm:space-y-3 lg:space-y-4 text-white/80">
                <li className="flex items-center group">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 sm:mr-3 lg:mr-4 group-hover:animate-pulse"></div>
                  <span className="text-xs sm:text-sm lg:text-lg">Respuesta rápida en 24 horas</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 sm:mr-3 lg:mr-4 group-hover:animate-pulse"></div>
                  <span className="text-xs sm:text-sm lg:text-lg">Sistema de tickets para seguimiento</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 sm:mr-3 lg:mr-4 group-hover:animate-pulse"></div>
                  <span className="text-xs sm:text-sm lg:text-lg">Atención personalizada</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
            {enviado ? (
              <div className="text-center py-6 sm:py-8 lg:py-12">
                <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 p-3 sm:p-4 lg:p-6 rounded-full w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6">¡Consulta Enviada!</h3>
                {ticketCreado && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl border border-white/20">
                    <p className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2">Número de Consulta:</p>
                    <p className="text-cyan-400 font-bold text-sm sm:text-base lg:text-lg">{ticketCreado.ticketNumber}</p>
                  </div>
                )}
                <p className="text-white/70 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-2">
                  Tu consulta ha sido registrada correctamente. Recibirás una respuesta a la brevedad.
                </p>
                <button
                  onClick={resetForm}
                  className="backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                  title="Presiona Esc para volver"
                >
                  Enviar nueva consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Indicador de progreso */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                        step >= stepNumber 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-white/20 text-white/50'
                      }`}>
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 ${
                          step > stepNumber ? 'bg-cyan-500' : 'bg-white/20'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Paso 1: Tipo de consulta */}
                {step === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">¿Qué tipo de consulta tienes?</h3>
                      <div className="grid gap-3 sm:gap-4">
                        {TIPOS_CONSULTA.map((tipo) => (
                          <label
                            key={tipo.id}
                            className={`relative cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                              form.tipoConsulta === tipo.id
                                ? 'border-cyan-400 bg-cyan-500/20'
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                          >
                            <input
                              type="radio"
                              name="tipoConsulta"
                              value={tipo.id}
                              checked={form.tipoConsulta === tipo.id}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="text-lg sm:text-xl lg:text-2xl">{tipo.icon}</span>
                              <div>
                                <h4 className="font-semibold text-white text-sm sm:text-base lg:text-lg">{tipo.nombre}</h4>
                                <p className="text-white/60 text-xs sm:text-sm lg:text-base">{tipo.descripcion}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-2 sm:mb-3">
                        Nivel de urgencia
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {URGENCIAS.map((urgencia) => (
                          <label
                            key={urgencia.id}
                            className={`relative cursor-pointer p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 text-center ${
                              form.urgencia === urgencia.id
                                ? 'border-cyan-400 bg-cyan-500/20'
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                          >
                            <input
                              type="radio"
                              name="urgencia"
                              value={urgencia.id}
                              checked={form.urgencia === urgencia.id}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <span className={`font-medium text-xs sm:text-sm ${urgencia.color}`}>{urgencia.nombre}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!form.tipoConsulta}
                      className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {/* Paso 2: Información personal */}
                {step === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Información de contacto</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                            Nombre completo (opcional)
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                            placeholder="tu@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                            Teléfono *
                          </label>
                          <input
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                            placeholder="+54 9 11 1234-5678"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                            Empresa
                          </label>
                          <input
                            type="text"
                            name="empresa"
                            value={form.empresa}
                            onChange={handleChange}
                            className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                            placeholder="Nombre de tu empresa"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Validación visual */}
                    {(!form.email || !form.telefono) && (
                      <div className="p-2 sm:p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <p className="text-red-300 text-xs sm:text-sm">
                          ⚠️ Por favor, completa tu email y teléfono para continuar
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm"
                      >
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!form.email || !form.telefono}
                        className="flex-1 backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xs sm:text-sm"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* Paso 3: Detalles de la consulta */}
                {step === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Detalles de tu consulta</h3>
                      
                      {/* Campos de contacto en el paso 3 */}
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/10 rounded-lg border border-white/20">
                        <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4">Información de contacto</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              required
                              className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                              placeholder="tu@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                              Teléfono *
                            </label>
                            <input
                              type="tel"
                              name="telefono"
                              value={form.telefono}
                              onChange={handleChange}
                              required
                              className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                              placeholder="+54 9 11 1234-5678"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                            Asunto *
                          </label>
                          <input
                            type="text"
                            name="asunto"
                            value={form.asunto}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                            placeholder="Resumen de tu consulta"
                          />
                        </div>

                        {/* Campos específicos según el tipo de consulta */}
                        {(form.tipoConsulta === 'presupuesto' || form.tipoConsulta === 'venta') && (
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                              Servicio de interés
                            </label>
                            <select
                              name="servicio"
                              value={form.servicio}
                              onChange={handleChange}
                              className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white text-sm sm:text-base"
                            >
                              <option value="" className="bg-slate-800">Selecciona un servicio</option>
                              {services.map((s, i) => (
                                <option key={i} value={s} className="bg-slate-800">{s}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {form.tipoConsulta === 'presupuesto' && (
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                              Presupuesto estimado (opcional)
                            </label>
                            <input
                              type="number"
                              name="presupuesto"
                              value={form.presupuesto}
                              onChange={handleChange}
                              className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                              placeholder="Monto en pesos argentinos"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-1 sm:mb-2">
                            Descripción detallada *
                          </label>
                          <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 resize-none text-white placeholder-white/50 hover:bg-white/25 text-sm sm:text-base"
                            placeholder="Describe tu consulta en detalle, incluyendo cualquier información relevante que nos ayude a entender mejor tu necesidad..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Validación de campos requeridos */}
                    {(!form.email || !form.telefono || !form.asunto || !form.descripcion) && (
                      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <p className="text-red-300 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                          ⚠️ Campos requeridos faltantes:
                        </p>
                        <ul className="text-red-300/80 text-xs space-y-1">
                          {!form.email && <li>• Email</li>}
                          {!form.telefono && <li>• Teléfono</li>}
                          {!form.asunto && <li>• Asunto</li>}
                          {!form.descripcion && <li>• Descripción</li>}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm"
                      >
                        Atrás
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !form.email || !form.telefono || !form.asunto || !form.descripcion}
                        className="flex-1 backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-xs sm:text-sm"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enviando consulta...
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            Enviar Consulta
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
