"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import FooterNav from '@/components/FooterNav';

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "product" | "service";
  image?: string;
}

const productImages = [
  "/servicio-productos.png",
  "/servicio-pc.png",
  "/servicio-software.png"
];
const serviceImages = [
  "/servicio-apps.png",
  "/servicio-redes.png",
  "/servicio-software.png"
];

export default function CatalogoPage() {
  const [products, setProducts] = useState<Item[]>([]);
  const [services, setServices] = useState<Item[]>([]);
  const [toast, setToast] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map((p: { id: string; name: string; description: string; price: number }, i: number) => ({ ...p, type: "product", image: productImages[i % productImages.length] })));
        } else {
          console.error('La API no devolvió un array:', data);
          setProducts([]);
        }
      })
      .catch(error => {
        console.error('Error cargando productos:', error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(data => {
        setServices(data.map((s: { id: string; name: string; description: string; price: number }, i: number) => ({ ...s, type: "service", image: serviceImages[i % serviceImages.length] })));
      });
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedProduct]);

  const addToCart = async (item: Item) => {
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
        
        // Verificar si el producto ya está en el carrito
        const existingIndex = cart.findIndex((cartItem: { productId: string; type?: string }) => 
          cartItem.productId === item.id && cartItem.type !== 'cotizacion'
        );
        
        if (existingIndex >= 0) {
          // Incrementar cantidad
          cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
          // Agregar nuevo producto
          cart.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            type: 'product'
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
                Catálogo IT360
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

        {/* Sección Productos */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50"></div>
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Nuestros Productos
              </h2>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              Descubre nuestra línea de productos tecnológicos de alta calidad diseñados para impulsar tu negocio hacia el futuro
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((p, index) => (
              <div 
                key={p.id} 
                className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:-translate-y-4 overflow-hidden cursor-pointer relative"
                onClick={() => setSelectedProduct(p)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-56 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center p-8 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-t-3xl"></div>
                  <img src={p.image} alt={p.name} className="relative w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="relative p-8">
                  <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {p.name}
                  </h3>
                  <p className="text-white/70 mb-6 text-sm leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-3xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      ${p.price.toLocaleString()}
                    </span>
                    <span className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 text-xs px-3 py-1 rounded-full font-medium">
                      Disponible
                    </span>
                  </div>
                  <button 
                    onClick={e => { e.stopPropagation(); addToCart(p); }} 
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
            ))}
          </div>
        </div>

        {/* Sección Servicios */}
        <div>
          <div className="text-center mb-16">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-lg opacity-50"></div>
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-4">
                Nuestros Servicios
              </h2>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              Soluciones profesionales y personalizadas para todas tus necesidades tecnológicas del futuro
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, index) => (
              <div 
                key={s.id} 
                className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center p-8 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-t-3xl"></div>
                  <img src={s.image} alt={s.name} className="relative w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="relative p-8">
                  <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-purple-400 transition-colors duration-300">
                    {s.name}
                  </h3>
                  <p className="text-white/70 mb-6 text-sm leading-relaxed">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-3xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      ${s.price.toLocaleString()}
                    </span>
                    <span className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs px-3 py-1 rounded-full font-medium">
                      Servicio
                    </span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/contacto'} 
                    className="w-full backdrop-blur-md bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 group/btn"
                  >
                    <div className="w-2 h-2 bg-white rounded-full group-hover/btn:animate-pulse"></div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" />
                    </svg>
                    Solicitar cotización
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal futurista de detalle de producto */}
      {selectedProduct && selectedProduct.type === 'product' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50" onClick={() => setSelectedProduct(null)}>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-white/60 hover:text-cyan-400 text-2xl font-bold transition-colors duration-300" onClick={() => setSelectedProduct(null)} aria-label="Cerrar modal">&times;</button>
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50"></div>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="relative w-40 h-40 object-contain" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 text-center">
                {selectedProduct.name}
              </h2>
              <p className="text-white/70 mb-6 text-center leading-relaxed">
                {selectedProduct.description}
              </p>
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
                ${selectedProduct.price.toLocaleString()}
              </div>
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Agregar al carrito
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full backdrop-blur-md bg-white/10 border border-white/20 text-white/90 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Ver catálogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FooterNav: navegación inferior para usuarios */}
      <FooterNav />
    </div>
  );
} 