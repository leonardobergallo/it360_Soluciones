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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements - Homogenizado con la página principal */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl top-1/4 left-1/4 animate-float"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-float animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float animation-delay-4000"></div>
      </div>

      <div className="bg-white/15 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-display font-extrabold text-white mb-2">
            Crear cuenta
          </h1>
          <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Únete a IT360
          </h3>
          <p className="text-lg text-white/90 font-medium">
            Accede a soluciones tecnológicas integrales
          </p>
        </div>
        {success ? (
          <div className="bg-white/15 backdrop-blur-sm border border-green-500/30 text-green-300 px-6 py-4 rounded-xl text-center font-semibold shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">✅</span>
              ¡Registro exitoso! Redirigiendo al login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-cyan-300 mb-2">Nombre completo *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-cyan-400">👤</span>
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="appearance-none relative block w-full pl-10 pr-4 py-4 bg-white/15 backdrop-blur-sm border border-white/30 placeholder-white/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:z-10 text-base transition-all duration-300 hover:bg-white/25"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-cyan-300 mb-2">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-cyan-400">📧</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="appearance-none relative block w-full pl-10 pr-4 py-4 bg-white/15 backdrop-blur-sm border border-white/30 placeholder-white/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:z-10 text-base transition-all duration-300 hover:bg-white/25"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-cyan-300 mb-2">Contraseña *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-cyan-400">🔒</span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="appearance-none relative block w-full pl-10 pr-4 py-4 bg-white/15 backdrop-blur-sm border border-white/30 placeholder-white/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:z-10 text-base transition-all duration-300 hover:bg-white/25"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-cyan-300 mb-2">Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-cyan-400">📞</span>
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-4 py-4 bg-white/15 backdrop-blur-sm border border-white/30 placeholder-white/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:z-10 text-base transition-all duration-300 hover:bg-white/25"
                    placeholder="Ej: 3425089906"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-cyan-300 mb-2">Empresa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-cyan-400">🏢</span>
                  </div>
                  <input
                    type="text"
                    name="empresa"
                    value={form.empresa}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-4 py-4 bg-white/15 backdrop-blur-sm border border-white/30 placeholder-white/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:z-10 text-base transition-all duration-300 hover:bg-white/25"
                    placeholder="Nombre de tu empresa (opcional)"
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-white/15 backdrop-blur-sm border border-red-500/30 text-red-300 px-6 py-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">❌</span>
                  {error}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Registrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    Crear cuenta
                  </div>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link href="/login" className="text-cyan-300 hover:text-cyan-200 text-base font-medium transition-all duration-300 hover:scale-105 transform">
                ¿Ya tienes cuenta? <span className="underline">Inicia sesión aquí</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 