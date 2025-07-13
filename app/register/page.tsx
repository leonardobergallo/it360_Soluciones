'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    empresa: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);
    if (!form.nombre || !form.email || !form.password) {
      setError('Por favor completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.nombre, // <--- CAMBIO CLAVE
          email: form.email,
          password: form.password,
          telefono: form.telefono,
          empresa: form.empresa,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Error al registrar.');
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError('Error de red. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Crear cuenta</h1>
        {success ? (
          <div className="text-green-700 text-center font-semibold py-8">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre completo *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ej: 3425089906"
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
                placeholder="Nombre de tu empresa (opcional)"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition-all duration-300 mt-2 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 