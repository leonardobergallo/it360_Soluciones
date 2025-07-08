'use client';

import React, { useState } from 'react';

const servicios = [
  'Desarrollo de Software',
  'Ciberseguridad',
  'Soporte Técnico',
];

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    servicio: servicios[0],
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Agregar la cotización al carrito (localStorage)
    const stored = localStorage.getItem('carrito');
    let cart = stored ? JSON.parse(stored) : [];
    cart.push({ ...form, type: 'cotizacion', qty: 1 });
    localStorage.setItem('carrito', JSON.stringify(cart));
    setTimeout(() => {
      setEnviado(true);
      setLoading(false);
      setForm({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        servicio: servicios[0],
        mensaje: '',
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Solicitar Cotización</h1>
        {enviado ? (
          <div className="text-green-700 text-center font-semibold py-8">
            ¡Gracias por tu solicitud!<br />La hemos agregado a tu carrito y te responderemos a la brevedad.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Empresa</label>
              <input
                type="text"
                name="empresa"
                value={form.empresa}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Servicio de interés</label>
              <select
                name="servicio"
                value={form.servicio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {servicios.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Mensaje</label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="¿Qué necesitas? ¿En qué podemos ayudarte?"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition-all duration-300 mt-2"
            >
              {loading ? 'Enviando...' : 'Agregar cotización al carrito'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 