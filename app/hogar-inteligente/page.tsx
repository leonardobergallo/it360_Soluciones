"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import FooterNav from '@/components/FooterNav';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}


export default function HogarInteligentePage() {
  const [productosDomotica, setProductosDomotica] = useState<Product[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then((data: Product[]) => {
        setProductosDomotica(data.filter(p => p.category && p.category.toLowerCase().includes('domot')));
      });
  }, []);

  const addToCart = async (item: Product) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Usuario logueado: usar API del backend
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: item.id, quantity: 1 })
        });
        const data = await res.json();
        if (res.ok) {
          setToast("✅ Agregado al carrito");
          setTimeout(() => setToast(""), 2000);
        } else {
          if (data.error === 'Token expirado') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setToast('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            setTimeout(() => {
              window.location.href = '/login?message=Sesion expirada. Inicia sesión de nuevo.';
            }, 1500);
            return;
          }
          setToast(data.error || 'No se pudo agregar al carrito');
          setTimeout(() => setToast(""), 2000);
        }
      } catch {
        setToast('Error de conexión al agregar al carrito');
        setTimeout(() => setToast(""), 2000);
      }
    } else {
      // Usuario no logueado: usar localStorage
      try {
        const stored = localStorage.getItem('carrito');
        const cart = stored ? JSON.parse(stored) : [];
        const existingIndex = cart.findIndex((cartItem: { productId: string; type?: string }) => 
          cartItem.productId === item.id && cartItem.type !== 'cotizacion'
        );
        if (existingIndex >= 0) {
          cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
          cart.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            type: 'product',
            image: item.image
          });
        }
        localStorage.setItem('carrito', JSON.stringify(cart));
        setToast("✅ Agregado al carrito (modo local)");
        setTimeout(() => setToast(""), 2000);
      } catch {
        setToast('Error al guardar en carrito local');
        setTimeout(() => setToast(""), 2000);
      }
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

      {/* Header futurista con glassmorphism */}
      <div className="relative z-10 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur-sm"></div>
                <img src="/logo-it360.png" alt="IT360" className="relative w-12 h-12 rounded-xl" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Hogar Inteligente
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-white/90 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group">
                <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:animate-pulse"></div>
                ← Volver al inicio
              </Link>
              <a href="/carrito" className="relative text-white/90 hover:text-cyan-400 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="relative w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-16 px-4">
        {/* Toast futurista */}
        {toast && (
          <div className="fixed top-6 right-6 backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 px-6 py-4 rounded-2xl shadow-2xl z-50 animate-bounce flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {toast}
          </div>
        )}

        {/* Título principal futurista */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50"></div>
            <h1 className="relative text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Hogar Inteligente – Domótica Premium
            </h1>
          </div>
          <p className="text-white/70 max-w-3xl mx-auto text-xl leading-relaxed">
            Transforma tu hogar en un espacio inteligente del futuro con tecnología de vanguardia
          </p>
        </div>

        {/* Sección educativa sobre domótica con glassmorphism */}
        <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-16 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6 text-center">
              ¿Qué es la domótica?
            </h2>
            <p className="text-white/80 text-center mb-6 text-lg leading-relaxed">
              La <b className="text-cyan-400">domótica</b> es la tecnología que permite automatizar y controlar tu hogar de forma inteligente. 
              Puedes manejar luces, enchufes, cámaras, cerraduras y más desde tu celular o con tu voz, 
              haciendo tu vida más cómoda, segura y eficiente.
            </p>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4 text-center">
              🤖 Agentes inteligentes para tu hogar
            </h3>
            <ul className="text-white/70 mb-6 space-y-2 text-center">
              <li className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                Controla todo con asistentes virtuales como <b className="text-cyan-400">Alexa</b> o <b className="text-cyan-400">Google Assistant</b>.
              </li>
              <li className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Usa apps como <b className="text-purple-400">Tuya</b>, <b className="text-purple-400">Smart Life</b> o <b className="text-purple-400">SmartThings</b> para centralizar el control.
              </li>
              <li className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                Crea automatizaciones: por ejemplo, que las luces se enciendan al detectar movimiento o que la puerta se abra con tu huella.
              </li>
              <li className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Recibe alertas y monitorea tu casa desde cualquier lugar del mundo.
              </li>
            </ul>
            <p className="text-white/80 text-center text-lg">
              La domótica convierte tu casa en un hogar inteligente, donde los agentes trabajan para ti y tu familia.
            </p>
          </div>
        </section>

        {/* Catálogo de productos destacados con diseño futurista */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-lg opacity-50"></div>
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-4">
                Productos de Domótica
              </h2>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              Descubre nuestra línea de productos inteligentes que transformarán tu hogar
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosDomotica.length === 0 ? (
              <div className="col-span-full text-center text-white/50 py-12 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-lg">No hay productos de domótica disponibles en este momento.</p>
                <p className="text-sm text-white/40">Pronto tendremos nuevos productos inteligentes</p>
              </div>
            ) : (
              productosDomotica.map((producto, index) => (
                <div 
                  key={producto.id} 
                  className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:-translate-y-4 overflow-hidden relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Badge de domótica */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      Domótica
                    </div>
                  </div>
                  
                  {/* Imagen del producto */}
                  <div className="relative h-56 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-t-3xl"></div>
                    <Image 
                      src={producto.image || '/servicio-productos.png'} 
                      alt={producto.name} 
                      width={128} 
                      height={128} 
                      className="relative w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  {/* Información del producto */}
                  <div className="relative p-8">
                    <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300 text-center">
                      {producto.name}
                    </h3>
                    <p className="text-white/70 mb-6 text-sm leading-relaxed text-center">
                      {producto.description}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-bold text-3xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ${producto.price.toLocaleString()}
                      </span>
                      <span className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 text-xs px-3 py-1 rounded-full font-medium">
                        Disponible
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(producto)} 
                      className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 group/btn"
                    >
                      <div className="w-2 h-2 bg-white rounded-full group-hover/btn:animate-pulse"></div>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Beneficios y compatibilidad de apps con glassmorphism */}
        <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-16 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6 text-center">
              Control total desde tu celular
            </h3>
            <p className="text-white/80 text-center mb-8 text-lg leading-relaxed">
              Todos los productos son compatibles con apps oficiales como <b className="text-purple-400">Tuya</b>, 
              <b className="text-purple-400"> Smart Life</b>, <b className="text-purple-400">SmartThings</b>, 
              <b className="text-purple-400"> Alexa</b> y <b className="text-purple-400">Google Home</b>. 
              Controla tu hogar desde una sola app, con facilidad y seguridad.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Tuya', 'Smart Life', 'SmartThings', 'Alexa', 'Google Home'].map((app, index) => (
                <span 
                  key={app}
                  className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 text-purple-300 px-4 py-2 rounded-full font-semibold hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Formulario CTA para Hogar Inteligente con diseño futurista */}
        <section className="backdrop-blur-md bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/20 rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6 text-center flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              ¿Querés asesoramiento en Hogar Inteligente?
            </h3>
            <FormularioHogarInteligente />
          </div>
        </section>
      </div>

      {/* FooterNav: navegación inferior para usuarios */}
      <FooterNav />
    </div>
  );
} 

// Componente del formulario con diseño futurista
function FormularioHogarInteligente() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      mensaje: formData.get('mensaje') as string,
      tipoConsulta: formData.get('tipoConsulta') as string,
    };

    try {
      const response = await fetch('/api/contacto-hogar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setEnviado(true);
        setTimeout(() => setEnviado(false), 5000);
        // Limpiar formulario
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error || 'Error al enviar la consulta');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="nombre" 
        placeholder="Nombre completo" 
        className="backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300" 
        required 
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        className="backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300" 
        required 
      />
      <input 
        type="tel" 
        name="telefono" 
        placeholder="Teléfono (opcional)" 
        className="backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300" 
      />
      <select 
        name="tipoConsulta" 
        className="backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300"
        required
      >
        <option value="" className="bg-slate-800">Selecciona el tipo de consulta</option>
        <option value="Asesoramiento general" className="bg-slate-800">Asesoramiento general</option>
        <option value="Instalación de productos" className="bg-slate-800">Instalación de productos</option>
        <option value="Configuración de apps" className="bg-slate-800">Configuración de apps</option>
        <option value="Automatización avanzada" className="bg-slate-800">Automatización avanzada</option>
        <option value="Presupuesto personalizado" className="bg-slate-800">Presupuesto personalizado</option>
      </select>
      <textarea 
        name="mensaje" 
        placeholder="Cuéntanos qué necesitas para tu hogar inteligente..." 
        rows={4} 
        className="backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none resize-none transition-all duration-300" 
        required 
      />
      
      <button 
        type="submit" 
        disabled={enviando}
        className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
      >
        {enviando ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-white rounded-full group-hover/btn:animate-pulse"></div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enviar consulta
          </>
        )}
      </button>
      
      {enviado && (
        <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 rounded-2xl px-4 py-3 text-center font-semibold animate-bounce flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          ¡Consulta enviada con éxito! Te responderemos a la brevedad.
        </div>
      )}
      
      {error && (
        <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl px-4 py-3 text-center font-semibold flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </form>
  );
} 
