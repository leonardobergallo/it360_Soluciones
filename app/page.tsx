"use client";
import { useEffect, useState, useRef } from 'react';
import CartIconWithBadge from "@/components/CartIconWithBadge";
import FooterNav from "@/components/FooterNav";
import ModernLogo from "@/components/ModernLogo";
import ContactVendorModal from "@/components/ContactVendorModal";

export default function Home() {
  // Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Animación simple de fade-in al cargar
  useEffect(() => {
    const animateElements = () => {
      const fadeElements = document.querySelectorAll('.fade-in');
      fadeElements.forEach((el, i) => {
        setTimeout(() => {
          if (el instanceof HTMLElement) {
            el.classList.add('opacity-100', 'translate-y-0');
          }
        }, 200 + i * 200);
      });
    };

    // Solo ejecutar en el cliente
    if (typeof window !== "undefined") {
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(animateElements, 100);
    }
  }, []);

  // Verificar autenticación al cargar la página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []);

  // Estado para modal de servicio
  const [openService, setOpenService] = useState<null | number>(null);
  const handleOpenService = (i: number) => setOpenService(i);

  // Estado para modal de detalles de producto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false); // Estado para el modal de contacto
  const [contactProduct, setContactProduct] = useState<Product | null>(null); // Producto para el modal de contacto
  
  // Estado para autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenService(null);
        setSelectedProduct(null);
      }
    };
    if (openService !== null || selectedProduct !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openService, selectedProduct]);

  interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    imagen?: string;
    descripcionLarga?: string;
  }

  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imagen: string;
    icon: string;
    descripcionLarga: string;
    imagenes?: string[]; // Múltiples imágenes para el producto
  }

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(async r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Agregar imágenes y descripciones detalladas a los servicios
          const servicesWithImages = data.map((service: Service) => {
            let imagen = '/servicio-apps.png'; // imagen por defecto
            
            // Asignar imágenes específicas basadas en el nombre del servicio
            const serviceName = service.name?.toLowerCase() || '';
            
            if (serviceName.includes('desarrollo') || serviceName.includes('software') || serviceName.includes('app')) {
              imagen = '/servicio-apps.png';
            } else if (serviceName.includes('ciberseguridad') || serviceName.includes('seguridad')) {
              imagen = '/servicio-software.png';
            } else if (serviceName.includes('soporte') || serviceName.includes('técnico')) {
              imagen = '/servicio-pc.png';
            } else if (serviceName.includes('infraestructura') || serviceName.includes('redes')) {
              imagen = '/servicio-redes.png';
            } else if (serviceName.includes('consultoría') || serviceName.includes('consultoria')) {
              imagen = '/servicio-software.png';
            }
            
            return {
              ...service,
              imagen,
              descripcionLarga: service.description + ' Servicio profesional con garantía de calidad y soporte técnico especializado. Incluye análisis de necesidades, implementación personalizada y seguimiento post-venta.'
            };
          });
          setServices(servicesWithImages);
        } else {
          setServices([]);
          console.error('La API de servicios no devolvió un array:', data);
        }
      })
      .catch(error => {
        setServices([]);
        console.error('Error cargando servicios:', error);
      });
  }, []);

  // Estado para productos dinámicos
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }
        
          const data = await response.json();
        
        // Agregar imágenes específicas para cada producto basadas en su nombre
        const productsWithImages = data.map((product: Product) => {
          let imagen = '/servicio-productos.png'; // imagen por defecto
          let icon = '💻'; // icono por defecto
          
          // Asignar imágenes e iconos específicos basados en el nombre del producto
          const productName = product.name?.toLowerCase() || '';
          
          if (productName.includes('laptop') || productName.includes('notebook') || productName.includes('computadora')) {
            imagen = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';
            icon = '💻';
          } else if (productName.includes('mouse') || productName.includes('ratón')) {
            imagen = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop';
            icon = '🖱️';
          } else if (productName.includes('teclado') || productName.includes('keyboard')) {
            imagen = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop';
            icon = '⌨️';
          } else if (productName.includes('monitor') || productName.includes('pantalla')) {
            imagen = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop';
            icon = '🖥️';
          } else if (productName.includes('auricular') || productName.includes('headphone') || productName.includes('audífono')) {
            imagen = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop';
            icon = '🎧';
          } else if (productName.includes('webcam') || productName.includes('cámara')) {
            imagen = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
            icon = '📹';
          } else if (productName.includes('router') || productName.includes('wifi') || productName.includes('red')) {
            imagen = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
            icon = '📡';
          } else if (productName.includes('impresora') || productName.includes('printer')) {
            imagen = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
            icon = '🖨️';
          } else if (productName.includes('tablet') || productName.includes('ipad')) {
            imagen = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop';
            icon = '📱';
          } else if (productName.includes('servidor') || productName.includes('server')) {
            imagen = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
            icon = '🖥️';
          }
          
          return {
            ...product,
            imagen,
            icon,
            descripcionLarga: product.description,
            imagenes: generateProductImages(product.name, imagen)
          };
        });
          setProducts(productsWithImages);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProducts([]); // Asegurar que se muestren los productos de ejemplo
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Función para manejar la selección de productos
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  // Función para abrir el modal de contacto con un producto específico
  const handleContactVendor = (product: Product) => {
    setContactProduct(product);
    setContactModalOpen(true);
  };

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
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
      );
    } else if (productNameLower.includes('teclado') || productNameLower.includes('keyboard')) {
      images.push(
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop'
      );
    } else if (productNameLower.includes('monitor') || productNameLower.includes('pantalla')) {
      images.push(
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'
      );
    } else if (productNameLower.includes('auricular') || productNameLower.includes('headphone') || productName.includes('audífono')) {
      images.push(
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
      );
    } else {
      // Imágenes genéricas para otros productos
      images.push(
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      );
    }
    
    return images;
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [success, setSuccess] = useState(false);
  
  // Estados para el carrito y notificaciones
  const [toast, setToast] = useState<string | null>(null);

  // Función para agregar productos al carrito
  const addToCart = async (product: Product) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Usuario logueado: usar API del backend
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setToast('✅ Producto agregado al carrito exitosamente');
          // Recargar la página para actualizar el badge del carrito
          setTimeout(() => {
            window.location.reload();
          }, 1000);
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
        }
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        setToast('Error de conexión al agregar al carrito');
      }
    } else {
      // Usuario no logueado: usar localStorage
      try {
        const stored = localStorage.getItem('carrito');
        const cart = stored ? JSON.parse(stored) : [];
        
        // Verificar si el producto ya está en el carrito
        const existingIndex = cart.findIndex((cartItem: { productId: string; type?: string }) => 
          cartItem.productId === product.id && cartItem.type !== 'cotizacion'
        );
        
        if (existingIndex >= 0) {
          // Incrementar cantidad
          cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
          // Agregar nuevo producto
          cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            type: 'product'
          });
        }
        
        localStorage.setItem('carrito', JSON.stringify(cart));
        setToast("✅ Agregado al carrito (modo local)");
        setTimeout(() => setToast(""), 2000);
      } catch (error) {
        console.error('Error al guardar en carrito local:', error);
        setToast('Error al guardar en carrito local');
      }
    }
  };

  // Enviar presupuesto
  const handlePresupuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const form = formRef.current;
    if (!form) return;
    
    // Simula envío
    await new Promise(r => setTimeout(r, 1200));
    setSuccess(true);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 via-purple-800 to-slate-700 font-sans pb-16 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl top-1/4 left-1/4 animate-float"></div>
        <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl bottom-1/4 right-1/4 animate-float animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float animation-delay-4000"></div>
      </div>

      {/* Header principal - Sin fondo y uniforme */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <ModernLogo size="lg" />
          </div>
          
          {/* Desktop - Iconos completos */}
          <div className="hidden md:flex gap-6 items-center">
            <span className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-cyan-300 transition-colors text-sm font-medium">
              <span role="img" aria-label="Usuario" className="text-base">👤</span> 
              <span>Mi cuenta</span>
            </span>
            <CartIconWithBadge />
          </div>

          {/* Mobile - Solo iconos sin texto */}
          <div className="md:hidden flex gap-4 items-center">
            <button className="text-white/80 hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-white/10">
              <span role="img" aria-label="Usuario" className="text-xl">👤</span>
            </button>
            <CartIconWithBadge />
          </div>
        </div>
      </header>

      {/* Barra de navegación - Completamente uniforme */}
      <nav className="bg-gradient-to-r from-slate-700/90 to-slate-600/90 backdrop-blur-xl border-b border-white/20 mt-20">
        <div className="container mx-auto px-6">
          {/* Desktop Menu - Uniforme */}
          <div className="hidden md:flex items-center justify-center gap-8 py-4">
            <a href="#inicio" className="font-bold text-cyan-300 hover:text-cyan-200 transition-colors text-base px-3 py-2 rounded-lg hover:bg-white/10">Inicio</a>
            <a href="#servicios" className="text-white/80 hover:text-cyan-300 transition-colors font-medium text-base px-3 py-2 rounded-lg hover:bg-white/10">Servicios</a>
            <a href="#productos" className="text-white/80 hover:text-cyan-300 transition-colors text-base px-3 py-2 rounded-lg hover:bg-white/10">Productos</a>
            <a href="#nosotros" className="text-white/80 hover:text-cyan-300 transition-colors text-base px-3 py-2 rounded-lg hover:bg-white/10">Nosotros</a>
            <a href="#testimonios" className="text-white/80 hover:text-cyan-300 transition-colors text-base px-3 py-2 rounded-lg hover:bg-white/10">Testimonios</a>
            <a href="#contacto" className="text-white/80 hover:text-cyan-300 transition-colors text-base px-3 py-2 rounded-lg hover:bg-white/10">Contacto</a>
          </div>

          {/* Mobile Menu - Menú hamburguesa completo */}
          <div className="md:hidden flex items-center justify-between py-4">
            {/* Logo o título en móvil */}
            <div className="flex items-center">
              <span className="text-white font-bold text-lg">IT360</span>
            </div>
            
            {/* Botón hamburguesa */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/80 hover:text-cyan-300 transition-colors p-3 rounded-lg hover:bg-white/10 w-12 h-12 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown - Menú completo desplegable */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-slate-700/95 backdrop-blur-xl border-t border-white/20 py-4">
              <div className="flex flex-col gap-3 px-6">
                <a 
                  href="#inicio" 
                  className="text-white/80 hover:text-cyan-300 transition-colors text-base py-3 px-4 rounded-lg hover:bg-white/10 border-b border-white/10 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-cyan-400">🏠</span>
                  Inicio
                </a>
                <a 
                  href="#servicios" 
                  className="text-white/80 hover:text-cyan-300 transition-colors text-base py-3 px-4 rounded-lg hover:bg-white/10 border-b border-white/10 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-cyan-400">🔧</span>
                  Servicios
                </a>
                <a 
                  href="#productos" 
                  className="text-white/80 hover:text-cyan-300 transition-colors text-base py-3 px-4 rounded-lg hover:bg-white/10 border-b border-white/10 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-cyan-400">📦</span>
                  Productos
                </a>
                <a 
                  href="#nosotros" 
                  className="text-white/80 hover:text-cyan-300 transition-colors text-base py-3 px-4 rounded-lg hover:bg-white/10 border-b border-white/10 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-cyan-400">👥</span>
                  Nosotros
                </a>
                <a 
                  href="#testimonios" 
                  className="text-white/80 hover:text-cyan-300 transition-colors text-base py-3 px-4 rounded-lg hover:bg-white/10 border-b border-white/10 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-cyan-400">⭐</span>
                  Testimonios
                </a>
                <a 
                  href="#contacto" 
                  className="text-white/80 hover:text-cyan-300 transition-colors text-base py-3 px-4 rounded-lg hover:bg-white/10 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-cyan-400">📞</span>
                  Contacto
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Futurista con letra más grande y uniforme */}
      <section id="inicio" className="relative flex flex-col items-center justify-center flex-1 min-h-[60vh] py-20 px-6 text-center fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-white/90 font-medium">Tecnología del Futuro</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold mb-8 px-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Bienvenido a IT360 Soluciones
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-4xl font-medium px-6 text-white/90 leading-relaxed">
            Soluciones tecnológicas integrales para tu empresa. 
            <span className="text-cyan-300 font-semibold"> Innovación, soporte y desarrollo</span> a tu alcance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="#contacto" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-lg transform hover:scale-105">
              Contáctanos
            </a>
            <a href="#servicios" className="px-8 py-4 bg-white/15 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30 hover:bg-white/25 transition-all duration-300 text-lg">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Pasarela de tecnologías - Completamente uniforme */}
      <section className="py-20 bg-white/10 backdrop-blur-sm fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-10 overflow-x-auto">
            {/* Next.js - Uniforme */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300 min-w-[120px] justify-center">
              <svg width="28" height="28" viewBox="0 0 120 40" fill="none" className="text-white">
                <text x="0" y="32" fontSize="32" fontWeight="bold" fill="currentColor">NEXT</text>
                <text x="72" y="36" fontSize="12" fill="currentColor">.Js</text>
              </svg>
            </div>
            
            {/* React - Uniforme */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300 min-w-[120px] justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" className="text-cyan-400">
                <g>
                  <ellipse cx="16" cy="16" rx="14" ry="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <ellipse cx="16" cy="16" rx="6" ry="14" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
                </g>
              </svg>
              <span className="text-white font-medium text-base">React</span>
            </div>
            
            {/* Node.js - Uniforme */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300 min-w-[120px] justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" className="text-green-400">
                <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="currentColor"/>
                <text x="8" y="22" fontSize="10" fill="white">Node</text>
              </svg>
              <span className="text-white font-medium text-base">Node.js</span>
            </div>
            
            {/* PostgreSQL - Uniforme */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300 min-w-[120px] justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" className="text-blue-400">
                <ellipse cx="16" cy="16" rx="14" ry="14" fill="currentColor"/>
                <text x="7" y="22" fontSize="10" fill="white">PGSQL</text>
              </svg>
              <span className="text-white font-medium text-base">PostgreSQL</span>
            </div>
            
            {/* TypeScript - Uniforme */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300 min-w-[120px] justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" className="text-blue-500">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <text x="4" y="22" fontSize="14" fill="white">TS</text>
              </svg>
              <span className="text-white font-medium text-base">TypeScript</span>
            </div>
            
            {/* Docker - Uniforme */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300 min-w-[120px] justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" className="text-blue-400">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <text x="4" y="22" fontSize="16" fill="white">🐳</text>
              </svg>
              <span className="text-white font-medium text-base">Docker</span>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios con modal expandible - Completamente uniforme */}
      <section id="servicios" className="max-w-7xl mx-auto py-20 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center justify-center gap-4">
            <span>Nuestros</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Servicios</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed px-6">
            Soluciones tecnológicas integrales para impulsar tu negocio hacia el futuro digital
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.isArray(services) && services.map((serv, i) => (
            <div key={serv.id || i} className="group relative">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-10 border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col shadow-lg hover:shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto shadow-lg">
                  <span className="text-3xl text-white">💻</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors text-center">
                  {serv.name || 'Servicio'}
                </h3>
                
                <p className="text-white/80 mb-6 leading-relaxed text-base flex-grow text-center">
                  {serv.description || 'Descripción del servicio'}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                  <span className="text-2xl font-bold text-cyan-300">
                    ${serv.price || '0'}
                  </span>
                  <button 
                    onClick={() => handleOpenService(i)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium text-base w-full sm:w-auto shadow-lg"
                  >
                    Saber más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos - Completamente uniforme y destacado */}
      <section id="productos" className="max-w-7xl mx-auto py-20 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center justify-center gap-4">
            <span>Nuestros</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Productos</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed px-6">
            Tecnología de vanguardia para optimizar tu infraestructura empresarial
          </p>
        </div>
        
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-10 border border-white/20 animate-pulse h-full shadow-lg">
                <div className="w-full h-48 bg-white/20 rounded-xl mb-8"></div>
                <div className="h-10 bg-white/20 rounded mb-6"></div>
                <div className="h-8 bg-white/20 rounded mb-8"></div>
                <div className="h-14 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, i) => (
              <div key={product.id || i} className="group relative">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col shadow-lg hover:shadow-xl">
                  {/* Imagen del producto con overlay */}
                  <div className="relative h-48 bg-gradient-to-br from-cyan-500/30 to-blue-500/30">
                    <img 
                      src={product.imagen || '/servicio-productos.png'} 
                      alt={product.name || 'Producto'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Icono del producto en la esquina superior derecha */}
                    <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-lg">{product.icon}</span>
                    </div>
                    
                    {/* Badge de precio en la esquina superior izquierda */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      ${product.price || '0'}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Icono grande centrado arriba del título */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{product.icon}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors text-center">
                      {product.name || 'Producto'}
                    </h3>
                    
                    <p className="text-white/80 mb-6 leading-relaxed text-base flex-grow text-center">
                      {product.description || 'Descripción del producto'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                      <span className="text-2xl font-bold text-cyan-300">
                        ${product.price || '0'}
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleProductSelect(product)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium text-sm shadow-lg flex items-center justify-center gap-1"
                        >
                          <span>Ver</span>
                          <span className="text-xs">→</span>
                        </button>
                        <button 
                          onClick={() => handleContactVendor(product)}
                          className="px-4 py-2 bg-white border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all duration-300 font-medium text-sm shadow-lg flex items-center justify-center gap-1"
                        >
                          <span>Contactar</span>
                          <span className="text-xs">📞</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Productos de ejemplo si no hay productos en la API
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                id: '1',
                name: 'Laptop HP Pavilion Gaming',
                description: 'Laptop de alto rendimiento para trabajo y gaming con gráficos dedicados',
                descripcionLarga: 'Laptop HP Pavilion Gaming con procesador Intel Core i7 de 11ª generación, 16GB RAM, SSD de 512GB y gráficos NVIDIA GTX 1650. Perfecta para trabajo profesional y gaming casual. Incluye teclado retroiluminado, webcam HD y conectividad WiFi 6.',
                price: 899,
                imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
                icon: '💻',
                imagenes: [
                  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'
                ]
              },
              {
                id: '2',
                name: 'Mouse Gaming RGB',
                description: 'Mouse inalámbrico con iluminación RGB personalizable y 6 botones programables',
                descripcionLarga: 'Mouse gaming inalámbrico con sensor óptico de alta precisión, 6 botones programables y iluminación RGB personalizable. Batería recargable con hasta 50 horas de uso continuo. Compatible con software de configuración avanzada.',
                price: 89,
                imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
                icon: '🖱️',
                imagenes: [
                  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
                ]
              },
              {
                id: '3',
                name: 'Teclado Mecánico Pro',
                description: 'Teclado mecánico con switches Cherry MX Blue y retroiluminación RGB',
                descripcionLarga: 'Teclado mecánico profesional con switches Cherry MX Blue que ofrecen retroalimentación táctil y sonora. Retroiluminación RGB personalizable con 16.8 millones de colores. Construcción en aluminio con teclas PBT resistentes al desgaste.',
                price: 149,
                imagen: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
                icon: '⌨️',
                imagenes: [
                  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop'
                ]
              },
              {
                id: '4',
                name: 'Monitor 4K Ultra HD',
                description: 'Monitor de 27 pulgadas con resolución 4K y tecnología HDR',
                descripcionLarga: 'Monitor de 27 pulgadas con resolución 4K Ultra HD (3840x2160) y tecnología HDR para colores más vibrantes y realistas. Tiempo de respuesta de 1ms y frecuencia de actualización de 144Hz. Perfecto para gaming y edición de video profesional.',
                price: 399,
                imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
                icon: '🖥️',
                imagenes: [
                  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'
                ]
              },
              {
                id: '5',
                name: 'Auricular Gaming Pro',
                description: 'Auricular con cancelación de ruido y micrófono integrado para gaming',
                descripcionLarga: 'Auricular gaming con cancelación de ruido activa y micrófono desmontable con cancelación de eco. Sonido envolvente 7.1 virtual para una experiencia inmersiva. Almohadillas de memoria viscoelástica para máximo confort durante largas sesiones.',
                price: 129,
                imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
                icon: '🎧',
                imagenes: [
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
                ]
              },
              {
                id: '6',
                name: 'Webcam HD Streaming',
                description: 'Cámara web de alta definición con micrófono integrado para streaming',
                descripcionLarga: 'Cámara web de 1080p con micrófono integrado y cancelación de ruido. Autofocus automático y corrección de luz automática. Compatible con todas las plataformas de streaming. Incluye soporte ajustable y tapa de privacidad.',
                price: 79,
                imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                icon: '📹',
                imagenes: [
                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
                ]
              }
            ].map((product) => (
              <div key={product.id} className="group relative">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col shadow-lg hover:shadow-xl">
                  {/* Imagen del producto con overlay */}
                  <div className="relative h-48 bg-gradient-to-br from-cyan-500/30 to-blue-500/30">
                    <img 
                      src={product.imagen} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Icono del producto en la esquina superior derecha */}
                    <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-lg">{product.icon}</span>
                    </div>
                    
                    {/* Badge de precio en la esquina superior izquierda */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      ${product.price}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Icono grande centrado arriba del título */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{product.icon}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors text-center">
                      {product.name}
                    </h3>
                    
                    <p className="text-white/80 mb-6 leading-relaxed text-base flex-grow text-center">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                      <span className="text-2xl font-bold text-cyan-300">
                        ${product.price}
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleProductSelect(product)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium text-sm shadow-lg flex items-center justify-center gap-1"
                        >
                          <span>Ver</span>
                          <span className="text-xs">→</span>
                        </button>
                        <button 
                          onClick={() => handleContactVendor(product)}
                          className="px-4 py-2 bg-white border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all duration-300 font-medium text-sm shadow-lg flex items-center justify-center gap-1"
                        >
                          <span>Contactar</span>
                          <span className="text-xs">📞</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Nosotros - Responsive con letra más grande */}
      <section id="nosotros" className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-20 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-10 flex items-center justify-center gap-3">
            <span>Sobre</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nosotros</span>
            <span className="text-2xl sm:text-3xl">🚀</span>
          </h2>
          <div className="relative mb-10">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-60 animate-pulse"></span>
            <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2" alt="Equipo IT360" className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-xl" />
          </div>
          <div className="max-w-4xl mx-auto text-center text-lg sm:text-xl text-gray-700 bg-white bg-opacity-80 rounded-xl p-8 sm:p-10 shadow-lg">
            <p className="mb-6 font-semibold text-blue-700 text-2xl flex items-center justify-center gap-3"><span>💡</span> Innovación, experiencia y compromiso</p>
            <p className="leading-relaxed text-lg">En IT360 Soluciones somos un equipo apasionado por la tecnología y la innovación. Nos dedicamos a brindar soluciones integrales que impulsan el crecimiento de nuestros clientes, combinando experiencia, creatividad y compromiso.</p>
          </div>
        </div>
      </section>

      {/* Testimonios - Responsive con letra más grande */}
      <section id="testimonios" className="bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 py-20 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-12 flex items-center justify-center gap-3">
            <span>Testimonios</span>
            <span className="text-2xl sm:text-3xl">⭐</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div className="relative bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center flex flex-col items-center overflow-hidden h-full">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-6">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="María G." className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-6 text-gray-700 relative z-10 text-lg sm:text-xl leading-relaxed flex-grow">&ldquo;El equipo de IT360 transformó nuestra infraestructura digital. ¡100% recomendados!&rdquo;</p>
              <div className="font-semibold text-blue-700 relative z-10 text-lg sm:text-xl">María G., CEO de EmpresaX</div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center flex flex-col items-center overflow-hidden h-full">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-6">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Juan P." className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-6 text-gray-700 relative z-10 text-lg sm:text-xl leading-relaxed flex-grow">&ldquo;Soporte técnico rápido y eficiente. Nos sentimos seguros con su ciberseguridad.&rdquo;</p>
              <div className="font-semibold text-blue-700 relative z-10 text-lg sm:text-xl">Juan P., CTO de TechCorp</div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center flex flex-col items-center overflow-hidden h-full">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-6">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Laura S." className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-6 text-gray-700 relative z-10 text-lg sm:text-xl leading-relaxed flex-grow">&ldquo;Desarrollaron una app a medida que superó nuestras expectativas.&rdquo;</p>
              <div className="font-semibold text-blue-700 relative z-10 text-lg sm:text-xl">Laura S., Gerente de Proyectos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto - Responsive con letra más grande */}
      <section id="contacto" className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-10 text-blue-800 text-center drop-shadow flex items-center justify-center gap-3">
          <span>Contacto</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">y Presupuesto</span>
        </h2>
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold mb-8 text-blue-700 text-center">Solicitar Presupuesto</h3>
          <form ref={formRef} onSubmit={handlePresupuesto} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <input name="nombre" type="text" placeholder="Nombre" className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" required />
            <input name="email" type="email" placeholder="Email" className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" required />
            <input name="telefono" type="tel" placeholder="Teléfono" className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" required />
            <input name="empresa" type="text" placeholder="Empresa (opcional)" className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" />
            <select name="servicio" className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" required>
              <option value="">Selecciona una opción</option>
              <option value="Desarrollo de Software">Desarrollo de Software</option>
              <option value="Ciberseguridad">Ciberseguridad</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Infraestructura">Infraestructura</option>
              <option value="Consultoría">Consultoría</option>
            </select>
            <input name="presupuesto" type="number" min="0" step="1000" placeholder="Presupuesto estimado (opcional)" className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" />
            <textarea name="mensaje" className="col-span-2 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" rows={4} required placeholder="Describe brevemente tu necesidad o proyecto..." />
            <button type="submit" className="col-span-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-lg hover:from-blue-800 hover:to-blue-600 transition mt-4">Solicitar presupuesto</button>
            {success && <div className="col-span-2 text-green-600 bg-green-50 border border-green-200 rounded px-6 py-4 font-semibold text-center mt-4 text-lg">¡Presupuesto enviado correctamente!</div>}
          </form>
          <div className="text-center text-base text-gray-500 mt-8">O escríbenos a <a href="mailto:info@it360.com" className="underline">info@it360.com</a></div>
        </div>
      </section>

      {/* Modal de Detalles de Producto - Compacto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-3">
              {/* Header del modal */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-base">{selectedProduct.icon}</span>
                  {selectedProduct.name}
                </h2>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700 text-lg p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Galería de imágenes */}
              <div className="mb-3">
                <div className="relative h-32 bg-gray-100 rounded-md overflow-hidden mb-2">
                  <img 
                    src={selectedProduct.imagenes?.[currentImageIndex] || selectedProduct.imagen} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Navegación de imágenes */}
                  {selectedProduct.imagenes && selectedProduct.imagenes.length > 1 && (
                    <>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.imagenes!.length - 1)}
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow transition-colors text-xs"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev < selectedProduct.imagenes!.length - 1 ? prev + 1 : 0)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow transition-colors text-xs"
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
                        className={`w-6 h-6 rounded-sm overflow-hidden border transition-all ${
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
                  <h3 className="text-xs font-semibold text-gray-800 mb-1">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed text-xs">
                    {selectedProduct.descripcionLarga || selectedProduct.description}
                  </p>
                  <div className="space-y-1 mt-2">
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

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 rounded-md">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-600 mb-2">
                      ${selectedProduct.price}
                    </div>
                    <div className="space-y-2 mb-3">
                      <button 
                        onClick={() => addToCart(selectedProduct)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-1.5 px-3 rounded-md font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-xs flex items-center justify-center gap-2"
                      >
                        <span>🛒</span>
                        Agregar al Carrito
                        {!isLoggedIn && <span className="text-xs opacity-75">(Local)</span>}
                      </button>
                      <button 
                        onClick={() => handleContactVendor(selectedProduct)}
                        className="w-full bg-white border border-cyan-500 text-cyan-600 py-1.5 px-3 rounded-md font-semibold hover:bg-cyan-50 transition-all duration-300 text-xs"
                      >
                        Contactar Vendedor
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 space-y-0.5">
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

      {/* Modal de Detalles de Servicio - Compacto */}
      {openService !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-3">
              {/* Header del modal */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-base">🔧</span>
                  {services[openService]?.name || 'Servicio'}
                </h2>
                <button 
                  onClick={() => setOpenService(null)}
                  className="text-gray-500 hover:text-gray-700 text-lg p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Imagen del servicio */}
              <div className="mb-3">
                <div className="relative h-32 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-md overflow-hidden mb-2">
                  <img 
                    src={services[openService]?.imagen || '/servicio-apps.png'} 
                    alt={services[openService]?.name || 'Servicio'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>

              {/* Información del servicio */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-gray-800 mb-1">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed text-xs">
                    {services[openService]?.descripcionLarga || services[openService]?.description || 'Descripción detallada del servicio.'}
                  </p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500">Categoría:</span>
                      <span className="text-gray-800 font-medium">Servicios IT</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500">Disponibilidad:</span>
                      <span className="text-green-600 font-medium">Disponible</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500">Tiempo estimado:</span>
                      <span className="text-gray-800 font-medium">2-4 semanas</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 rounded-md">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-600 mb-2">
                      ${services[openService]?.price || '0'}
                    </div>
                    <div className="space-y-2 mb-3">
                      <button 
                        onClick={() => {
                          setOpenService(null);
                          window.location.href = '/contacto';
                        }}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-1.5 px-3 rounded-md font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-xs"
                      >
                        Solicitar Presupuesto
                      </button>
                      <button 
                        onClick={() => {
                          setOpenService(null);
                          window.location.href = '/contacto';
                        }}
                        className="w-full bg-white border border-cyan-500 text-cyan-600 py-1.5 px-3 rounded-md font-semibold hover:bg-cyan-50 transition-all duration-300 text-xs"
                      >
                        Contactar Consultor
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <p>• Consulta inicial gratuita</p>
                      <p>• Propuesta personalizada</p>
                      <p>• Soporte post-implementación</p>
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
        onClose={() => {
          setContactModalOpen(false);
          setContactProduct(null);
        }}
        product={contactProduct ? {
          name: contactProduct.name,
          price: contactProduct.price,
          description: contactProduct.description
        } : undefined}
      />

      {/* Toast de notificación */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                toast.includes('✅') || toast.includes('exitosamente') 
                  ? 'bg-green-500' 
                  : toast.includes('Error') || toast.includes('expirado')
                  ? 'bg-red-500'
                  : 'bg-blue-500'
              }`}>
                <span className="text-white text-xs">
                  {toast.includes('✅') || toast.includes('exitosamente') ? '✓' : 
                   toast.includes('Error') || toast.includes('expirado') ? '✕' : 'ℹ'}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{toast}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <FooterNav />
    </div>
  );
}
