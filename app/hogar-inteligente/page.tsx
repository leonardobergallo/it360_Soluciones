"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 text-center drop-shadow">Hogar Inteligente – Domótica Premium</h1>
        {/* Sección educativa sobre domótica y agentes inteligentes */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">¿Qué es la domótica?</h2>
          <p className="text-gray-700 text-center mb-4">La <b>domótica</b> es la tecnología que permite automatizar y controlar tu hogar de forma inteligente. Puedes manejar luces, enchufes, cámaras, cerraduras y más desde tu celular o con tu voz, haciendo tu vida más cómoda, segura y eficiente.</p>
          <h3 className="text-xl font-semibold text-blue-600 mb-2 text-center">🤖 Agentes inteligentes para tu hogar</h3>
          <ul className="text-gray-700 mb-2 list-disc list-inside text-center">
            <li>Controla todo con asistentes virtuales como <b>Alexa</b> o <b>Google Assistant</b>.</li>
            <li>Usa apps como <b>Tuya</b>, <b>Smart Life</b> o <b>SmartThings</b> para centralizar el control.</li>
            <li>Crea automatizaciones: por ejemplo, que las luces se enciendan al detectar movimiento o que la puerta se abra con tu huella.</li>
            <li>Recibe alertas y monitorea tu casa desde cualquier lugar del mundo.</li>
          </ul>
          <p className="text-gray-700 text-center">La domótica convierte tu casa en un hogar inteligente, donde los agentes trabajan para ti y tu familia.</p>
        </section>
        {toast && (
          <div className="bg-green-100 border border-green-300 text-green-800 rounded px-4 py-3 mb-6 text-center font-semibold animate-fadeIn">
            {toast}
          </div>
        )}
        {/* Catálogo de productos destacados */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {productosDomotica.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No hay productos de domótica disponibles en este momento.</div>
          ) : (
            productosDomotica.map(producto => (
              <div key={producto.id} className="relative bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center group hover:scale-[1.03] hover:shadow-blue-200 transition-all duration-300 border border-blue-100">
                <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg group-hover:scale-110 transition-transform">Domótica</span>
                <div className="w-32 h-32 mb-4 flex items-center justify-center">
                  <Image src={producto.image || '/servicio-productos.png'} alt={producto.name} width={128} height={128} className="object-contain rounded-xl shadow-md group-hover:shadow-blue-200 transition" />
                </div>
                <h2 className="text-lg font-bold text-blue-700 mb-2 text-center group-hover:text-blue-900 transition">{producto.name}</h2>
                <p className="text-gray-700 mb-2 text-center text-sm">{producto.description}</p>
                <div className="font-extrabold text-2xl text-blue-800 mb-2 drop-shadow">${producto.price.toLocaleString()}</div>
                <button onClick={() => addToCart(producto)} className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 mt-2 flex items-center justify-center gap-2 group-hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 008.48 19h7.04a2 2 0 001.83-1.3L17 13M7 13V6h10v7" /></svg>
                  Agregar al carrito
                </button>
              </div>
            ))
          )}
        </section>
        {/* Beneficios y compatibilidad de apps */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Control total desde tu celular</h3>
          <p className="text-gray-700 text-center mb-4">Todos los productos son compatibles con apps oficiales como <b>Tuya</b>, <b>Smart Life</b>, <b>SmartThings</b>, <b>Alexa</b> y <b>Google Home</b>. Controla tu hogar desde una sola app, con facilidad y seguridad.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">Tuya</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">Smart Life</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">SmartThings</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">Alexa</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">Google Home</span>
          </div>
        </section>
        {/* Formulario CTA para Hogar Inteligente */}
        <section className="bg-gradient-to-r from-blue-100 to-green-100 rounded-3xl shadow-2xl p-8 mb-12 max-w-xl mx-auto mt-16">
          <h3 className="text-2xl font-extrabold text-blue-800 mb-4 text-center flex items-center justify-center gap-2">
            <span role="img" aria-label="robot">🤖</span> ¿Querés asesoramiento en Hogar Inteligente?
          </h3>
          <FormularioHogarInteligente />
        </section>
      </div>
    </div>
  );
} 

// Al final del archivo, agrega el componente del formulario con feedback visual
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
        className="border border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" 
        required 
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        className="border border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" 
        required 
      />
      <input 
        type="tel" 
        name="telefono" 
        placeholder="Teléfono (opcional)" 
        className="border border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" 
      />
      <select 
        name="tipoConsulta" 
        className="border border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        required
      >
        <option value="">Selecciona el tipo de consulta</option>
        <option value="Asesoramiento general">Asesoramiento general</option>
        <option value="Instalación de productos">Instalación de productos</option>
        <option value="Configuración de apps">Configuración de apps</option>
        <option value="Automatización avanzada">Automatización avanzada</option>
        <option value="Presupuesto personalizado">Presupuesto personalizado</option>
      </select>
      <textarea 
        name="mensaje" 
        placeholder="Cuéntanos qué necesitas para tu hogar inteligente..." 
        rows={4} 
        className="border border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none resize-none" 
        required 
      />
      
      <button 
        type="submit" 
        disabled={enviando}
        className="w-full bg-gradient-to-r from-blue-700 to-green-500 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:from-blue-800 hover:to-green-600 transition-all duration-300 mt-2 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Enviar consulta
          </>
        )}
      </button>
      
      {enviado && (
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-xl px-4 py-3 mt-2 text-center font-semibold animate-fadeIn">
          ✅ ¡Consulta enviada con éxito! Te responderemos a la brevedad.
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-4 py-3 mt-2 text-center font-semibold">
          ❌ {error}
        </div>
      )}
    </form>
  );
} 