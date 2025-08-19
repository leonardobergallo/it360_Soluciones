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

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Respuesta del servidor no válida');
      }

      const data = await response.json();
      
      if (response.ok) {
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
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error de conexión');
      }
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

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-110">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <Link href="/" className="text-cyan-300 hover:text-cyan-200 font-semibold text-sm transition-colors duration-300 hover:scale-105 transform">
            ← Volver al inicio
          </Link>
        </div>
        
        <div className="text-center">
          <h2 className="text-4xl font-display font-extrabold text-white mb-2">
            Bienvenido de vuelta
          </h2>
          <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Iniciar Sesión
          </h3>
          <p className="text-lg text-white/90 font-medium">
            Accede a tu cuenta de IT360 Soluciones
          </p>
        </div>
        {success && (
          <div className="bg-white/15 backdrop-blur-sm border border-green-500/30 text-green-300 px-6 py-4 rounded-xl text-center font-semibold shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">✅</span>
              {success}
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-cyan-400">📧</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-4 py-4 bg-white/15 backdrop-blur-sm border border-white/30 placeholder-white/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:z-10 text-base transition-all duration-300 hover:bg-white/25"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-cyan-400">🔒</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-4 py-4 bg-white/15 backdrop-blur-sm border border-white/30 placeholder-white/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:z-10 text-base transition-all duration-300 hover:bg-white/25"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🚀</span>
                  Iniciar Sesión
                </div>
              )}
            </button>
          </div>

          <div className="text-center pt-4 space-y-2">
            <div>
              <Link href="/register" className="text-cyan-300 hover:text-cyan-200 text-base font-medium transition-all duration-300 hover:scale-105 transform">
                ¿No tienes cuenta? <span className="underline">Regístrate aquí</span>
              </Link>
            </div>
            <div>
              <Link href="/reset-password" className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-all duration-300 hover:scale-105 transform">
                ¿Olvidaste tu contraseña? <span className="underline">Resetear aquí</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 
