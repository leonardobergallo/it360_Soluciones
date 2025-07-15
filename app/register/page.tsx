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
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Crear <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">cuenta</span>
        </h1>
        {success ? (
          <div className="text-green-400 text-center font-semibold py-8 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-1">Nombre completo *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                placeholder="Ej: 3425089906"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Empresa</label>
              <input
                type="text"
                name="empresa"
                value={form.empresa}
                onChange={handleChange}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                placeholder="Nombre de tu empresa (opcional)"
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center font-semibold bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 mt-2 disabled:opacity-50 transform hover:scale-105"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 