'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Mostrar mensaje de éxito si viene de registro
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const msg = params.get('message');
      if (msg) setSuccess(msg);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar el token en localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Migrar carrito del localStorage al backend si existe
        const storedCart = localStorage.getItem('carrito');
        if (storedCart) {
          try {
            const cartItems = JSON.parse(storedCart);
            const productsToMigrate = cartItems.filter((item: { type?: string }) => item.type !== 'cotizacion');
            
            if (productsToMigrate.length > 0) {
              await fetch('/api/cart/migrate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify({ localStorageItems: productsToMigrate })
              });
              
              // Limpiar solo los productos del localStorage (mantener cotizaciones)
              const cotizaciones = cartItems.filter((item: { type?: string }) => item.type === 'cotizacion');
              if (cotizaciones.length > 0) {
                localStorage.setItem('carrito', JSON.stringify(cotizaciones));
              } else {
                localStorage.removeItem('carrito');
              }
            }
          } catch (migrationError) {
            console.error('Error migrando carrito:', migrationError);
          }
        }
        
        // Redirigir según rol
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else if (data.user.role === 'TECNICO') {
          router.push('/admin/presupuestos');
        } else {
          router.push('/catalogo');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al iniciar sesión');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex items-center justify-between mb-2">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors duration-300">Volver al inicio</Link>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
          Iniciar <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Sesión</span>
        </h2>
        <p className="mt-2 text-center text-sm text-white/70">
          Accede a tu cuenta de IT360 Soluciones
        </p>
        {success && (
          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-center font-semibold">
            {success}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-300"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-300"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-300">
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 