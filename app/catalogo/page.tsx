"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ContactVendorModal from "../../components/ContactVendorModal";

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "product" | "service";
  image?: string;
  imagenes?: string[]; // Múltiples imágenes para el producto
  icon?: string; // Icono para el producto
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para la galería de imágenes
  const [contactModalOpen, setContactModalOpen] = useState(false); // Estado para el modal de contacto

  // Función para generar múltiples imágenes para un producto
  const generateProductImages = (productName: string, mainImage: string) => {
    const images = [mainImage];
    
    // Agregar imágenes adicionales basadas en el tipo de producto
    const productNameLower = productName.toLowerCase();
    
    if (productNameLower.includes('laptop') || productNameLower.includes('notebook') || productName.includes('computadora')) {
      images.push(
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'
      );
    } else if (productNameLower.includes('mouse') || productNameLower.includes('ratón')) {
      images.push(
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&flip=h',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&flip=v'
      );
    } else if (productNameLower.includes('teclado') || productNameLower.includes('keyboard')) {
      images.push(
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop&flip=h',
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop&flip=v'
      );
    } else if (productNameLower.includes('monitor') || productNameLower.includes('pantalla')) {
      images.push(
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop&flip=h',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop&flip=v'
      );
    } else if (productNameLower.includes('auricular') || productNameLower.includes('headphone') || productNameLower.includes('audífono')) {
      images.push(
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&flip=h',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&flip=v'
      );
    } else {
      // Para productos genéricos, agregar variaciones de la imagen principal
      images.push(
        mainImage,
        mainImage,
        mainImage
      );
    }
    
    return images;
  };

  // Función para obtener icono basado en el nombre del producto
  const getProductIcon = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('laptop') || name.includes('notebook') || name.includes('computadora')) return '💻';
    if (name.includes('mouse') || name.includes('ratón')) return '🖱️';
    if (name.includes('teclado') || name.includes('keyboard')) return '⌨️';
    if (name.includes('monitor') || name.includes('pantalla')) return '🖥️';
    if (name.includes('auricular') || name.includes('headphone') || name.includes('audífono')) return '🎧';
    if (name.includes('webcam') || name.includes('cámara')) return '📹';
    if (name.includes('router') || name.includes('wifi') || name.includes('red')) return '📡';
    if (name.includes('impresora') || name.includes('printer')) return '🖨️';
    if (name.includes('tablet') || name.includes('ipad')) return '📱';
    if (name.includes('servidor') || name.includes('server')) return '🖥️';
    return '💻'; // Icono por defecto
  };

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
          setProducts(data.map((p: { id: string; name: string; description: string; price: number }, i: number) => {
            const mainImage = productImages[i % productImages.length];
            return { 
              ...p, 
              type: "product", 
              image: mainImage,
              imagenes: generateProductImages(p.name, mainImage),
              icon: getProductIcon(p.name)
            };
          }));
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

  // Función para manejar la selección de productos
  const handleProductSelect = (product: Item) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

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
          <div className="text-center mb-12">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50"></div>
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Nuestros Productos
              </h2>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
              Descubre nuestra línea de productos tecnológicos de alta calidad diseñados para impulsar tu negocio hacia el futuro
            </p>
            

          </div>
          
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p, index) => (
              <div 
                key={p.id} 
                className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden cursor-pointer relative"
                onClick={() => handleProductSelect(p)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-28 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-t-xl"></div>
                  <img src={p.image} alt={p.name} className="relative w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="relative p-4">
                  <h3 className="font-bold text-sm mb-1 text-white group-hover:text-cyan-400 transition-colors duration-300 truncate">
                    {p.name}
                  </h3>
                  <p className="text-white/70 mb-3 text-xs leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      ${p.price.toLocaleString()}
                    </span>
                    <span className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Stock
                    </span>
                  </div>
                  <button 
                    onClick={e => { e.stopPropagation(); addToCart(p); }} 
                    className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-3 rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1.5 group/btn text-xs"
                  >
                    <div className="w-1 h-1 bg-white rounded-full group-hover/btn:animate-pulse"></div>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Agregar
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
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4">
            {services.map((s, index) => (
              <div 
                key={s.id} 
                className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-28 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-t-xl"></div>
                  <img src={s.image} alt={s.name} className="relative w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="relative p-4">
                  <h3 className="font-bold text-sm mb-1 text-white group-hover:text-purple-400 transition-colors duration-300 truncate">
                    {s.name}
                  </h3>
                  <p className="text-white/70 mb-3 text-xs leading-relaxed line-clamp-2">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      ${s.price.toLocaleString()}
                    </span>
                    <span className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Servicio
                    </span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/contacto'} 
                    className="w-full backdrop-blur-md bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1.5 group/btn text-xs"
                  >
                    <div className="w-1 h-1 bg-white rounded-full group-hover/btn:animate-pulse"></div>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" />
                    </svg>
                    Cotizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal compacto de detalle de producto */}
      {selectedProduct && selectedProduct.type === 'product' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-sm sm:max-w-md w-full max-h-[85vh] overflow-y-auto">
            <div className="p-3 sm:p-4">
              {/* Header del modal */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-lg sm:text-xl">{selectedProduct.icon}</span>
                  <span className="truncate">{selectedProduct.name}</span>
                </h2>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Galería de imágenes */}
              <div className="mb-3">
                <div className="relative h-32 sm:h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img 
                    src={selectedProduct.imagenes?.[currentImageIndex] || selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Navegación de imágenes */}
                  {selectedProduct.imagenes && selectedProduct.imagenes.length > 1 && (
                    <>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.imagenes!.length - 1)}
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow transition-colors text-xs sm:text-sm"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev < selectedProduct.imagenes!.length - 1 ? prev + 1 : 0)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow transition-colors text-xs sm:text-sm"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
                {/* Miniaturas */}
                {selectedProduct.imagenes && selectedProduct.imagenes.length > 1 && (
                  <div className="flex gap-1 justify-center">
                    {selectedProduct.imagenes.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-cyan-500 scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed mb-2 text-xs sm:text-sm">
                    {selectedProduct.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500">Categoría:</span>
                      <span className="text-gray-800 font-medium">Tecnología</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500">Disponibilidad:</span>
                      <span className="text-green-600 font-medium">En Stock</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500">Garantía:</span>
                      <span className="text-gray-800 font-medium">1 año</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-cyan-600 mb-2">
                      ${selectedProduct.price.toLocaleString()}
                    </div>
                    <div className="space-y-2 mb-3">
                      <button 
                        onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm"
                      >
                        Agregar al Carrito
                      </button>
                      <button 
                        onClick={() => setContactModalOpen(true)}
                        className="w-full bg-white border-2 border-cyan-500 text-cyan-600 py-2 px-3 rounded-lg font-semibold hover:bg-cyan-50 transition-all duration-300 text-xs sm:text-sm"
                      >
                        Contactar Vendedor
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Envío gratis en compras superiores a $500</p>
                      <p>• Devolución gratuita en 30 días</p>
                      <p>• Soporte técnico incluido</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de contacto con vendedor */}
      <ContactVendorModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        product={selectedProduct ? {
          name: selectedProduct.name,
          price: selectedProduct.price,
          description: selectedProduct.description
        } : undefined}
      />
    </div>
  );
} 