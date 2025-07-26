'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ContactoPage() {
  const [services, setServices] = useState<string[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    servicio: services[0] || '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: { name: string }[]) => setServices(data.map((s) => s.name)));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/presupuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al enviar presupuesto');
      setEnviado(true);
    } catch {
      alert('Hubo un error al enviar tu solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
      setForm({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        servicio: services[0] || '',
        mensaje: '',
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo futurista con animaciones */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-16 px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-50"></div>
              <Image src="/logo-it360.png" alt="IT360 Logo" width={120} height={60} className="relative rounded-2xl" />
            </div>
          </div>
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50"></div>
            <h1 className="relative text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Solicitar Presupuesto
            </h1>
          </div>
          <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
            Cuéntanos sobre tu proyecto y te proporcionaremos una cotización personalizada para el futuro
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Información de contacto */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Información de Contacto
              </h2>
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group">
                <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 p-4 rounded-2xl group-hover:bg-green-500/30 transition-all duration-300">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-2">WhatsApp</h3>
                  <a href="https://wa.me/5493425089906" target="_blank" rel="noopener noreferrer" className="text-green-400 font-bold hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group/link">
                    +54 9 342 508-9906
                    <svg className="w-5 h-5 text-green-400 group-hover/link:animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12 12 0 003.48 20.52l-1.3 4.77a1 1 0 001.22 1.22l4.77-1.3A12 12 0 0020.52 3.48zm-8.5 16.5a10.06 10.06 0 01-5.1-1.4l-.36-.21-2.83.77.77-2.83-.21-.36A10.06 10.06 0 013.5 12a10 10 0 1110 10zm5.7-7.3l-2.1-2.1a1 1 0 00-1.42 0l-.7.7a8 8 0 01-3.6-3.6l.7-.7a1 1 0 000-1.42l-2.1-2.1a1 1 0 00-1.42 0l-.7.7A2.5 2.5 0 005 8.5c0 5.25 4.25 9.5 9.5 9.5a2.5 2.5 0 002.5-2.5l-.7-.7a1 1 0 00-1.42 0z"/></svg>
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 p-4 rounded-2xl group-hover:bg-blue-500/30 transition-all duration-300">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-2">Teléfono</h3>
                  <p className="text-white/70 text-lg">3425089906</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 p-4 rounded-2xl group-hover:bg-purple-500/30 transition-all duration-300">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-2">Ubicación</h3>
                  <p className="text-white/70 text-lg">Santa Fe, Argentina</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-8 backdrop-blur-md bg-cyan-500/10 border border-cyan-400/30 rounded-2xl">
              <h3 className="font-semibold text-white text-xl mb-6">¿Por qué elegirnos?</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-center group">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4 group-hover:animate-pulse"></div>
                  <span className="text-lg">Respuesta rápida en 24 horas</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4 group-hover:animate-pulse"></div>
                  <span className="text-lg">Presupuestos sin compromiso</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4 group-hover:animate-pulse"></div>
                  <span className="text-lg">Atención personalizada</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            {enviado ? (
              <div className="text-center py-12">
                <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 p-6 rounded-full w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-6">¡Solicitud Enviada!</h3>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  Gracias por contactarnos. Hemos recibido tu solicitud y te responderemos a la brevedad.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/25"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      required
                      className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50"
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-3">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={form.empresa}
                      onChange={handleChange}
                      className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cyan-300 mb-3">
                    Servicio de interés *
                  </label>
                  <select
                    name="servicio"
                    value={form.servicio}
                    onChange={handleChange}
                    className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white"
                  >
                    <option value="" className="bg-slate-800">Selecciona un servicio</option>
                    {services.map((s, i) => (
                      <option key={i} value={s} className="bg-slate-800">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cyan-300 mb-3">
                    Descripción del proyecto *
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 resize-none text-white placeholder-white/50"
                    placeholder="Cuéntanos sobre tu proyecto, necesidades específicas, presupuesto aproximado, timeline, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-5 px-6 rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full group-hover:animate-pulse"></div>
                      Solicitar Presupuesto
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
