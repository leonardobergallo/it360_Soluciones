"use client";
import { useEffect, useState } from "react";

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

const hardcodedServices = [
  {
    id: 'servicio-1',
    name: 'Desarrollo de Software',
    description: 'Aplicaciones web, móviles y sistemas a medida para tu negocio con las últimas tecnologías.',
    price: 2500,
    type: 'service',
    image: '/servicio-apps.png'
  },
  {
    id: 'servicio-2',
    name: 'Ciberseguridad',
    description: 'Protege tus datos y tu infraestructura con soluciones avanzadas de seguridad.',
    price: 3200,
    type: 'service',
    image: '/servicio-redes.png'
  },
  {
    id: 'servicio-3',
    name: 'Soporte Técnico',
    description: 'Asistencia rápida y profesional para mantener tu empresa operativa 24/7.',
    price: 800,
    type: 'service',
    image: '/servicio-software.png'
  }
];

export default function CatalogoPage() {
  const [products, setProducts] = useState<Item[]>([]);
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
          setProducts(data.map((p: any, i: number) => ({ ...p, type: "product", image: productImages[i % productImages.length] })));
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
    if (!selectedProduct) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedProduct]);

  const addToCart = async (item: Item) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = "/login";
      return;
    }
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
      setToast("Agregado al carrito");
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header con navegación */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-it360.png" alt="IT360" className="w-10 h-10 rounded" />
              <h1 className="text-2xl font-bold text-blue-700">Catálogo IT360</h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-blue-700 hover:text-blue-800 transition-colors">← Volver al inicio</a>
              <a href="/carrito" className="relative text-blue-700 hover:text-blue-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {toast && (
          <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {toast}
          </div>
        )}

        {/* Sección Productos */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Nuestros Productos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Descubre nuestra línea de productos tecnológicos de alta calidad diseñados para impulsar tu negocio</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(p)}>
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-6">
                  <img src={p.image} alt={p.name} className="w-32 h-32 object-contain" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-800">{p.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-2xl text-blue-700">${p.price.toLocaleString()}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Disponible</span>
                  </div>
                  <button 
                    onClick={e => { e.stopPropagation(); addToCart(p); }} 
                    className="w-full bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Soluciones profesionales y personalizadas para todas tus necesidades tecnológicas</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {hardcodedServices.map(s => (
              <div key={s.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center p-6">
                  <img src={s.image} alt={s.name} className="w-32 h-32 object-contain" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-800">{s.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{s.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-2xl text-indigo-700">${s.price.toLocaleString()}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Servicio</span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/contacto'} 
                    className="w-full bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-indigo-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
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

      {/* Modal de detalle de producto */}
      {selectedProduct && selectedProduct.type === 'product' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setSelectedProduct(null)} aria-label="Cerrar modal">&times;</button>
            <div className="flex flex-col items-center">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-40 h-40 object-contain mb-6" />
              <h2 className="text-2xl font-bold text-blue-800 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-700 mb-4 text-center">{selectedProduct.description}</p>
              <div className="text-3xl font-bold text-blue-700 mb-2">${selectedProduct.price.toLocaleString()}</div>
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition-all duration-300 mt-4"
              >Agregar al carrito</button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full mt-2 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
              >Ver catálogo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 