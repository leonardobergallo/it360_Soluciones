"use client";
import { useEffect, useState, useRef } from 'react';
import CartIconWithBadge from "@/components/CartIconWithBadge";
import FooterNav from "@/components/FooterNav";
import ModernLogo from "@/components/ModernLogo";
import ContactVendorModal from "@/components/ContactVendorModal";

export default function Home() {
  // Estado para el menú móvil


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

  // Enviar presupuesto (ahora como ticket unificado)
  const handlePresupuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    const form = formRef.current;
    if (!form) return;
    
    const formData = new FormData(form);
    const ticketData = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      empresa: formData.get('empresa') as string,
      tipo: 'presupuesto',
      categoria: formData.get('servicio') as string,
      asunto: `Solicitud de presupuesto - ${formData.get('servicio')}`,
      descripcion: formData.get('mensaje') as string,
      urgencia: formData.get('urgencia') as string || 'normal',
      presupuesto: formData.get('presupuesto') ? Number(formData.get('presupuesto')) : undefined,
    };

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        form.reset();
        
        // Mostrar mensaje de éxito con número de ticket
        const ticketNumber = data.ticket?.ticketNumber;
        if (ticketNumber) {
          alert(`✅ Ticket creado exitosamente!\n\nNúmero de ticket: ${ticketNumber}\n\nNos pondremos en contacto contigo pronto.`);
        }
        
        // Mostrar mensaje de éxito por 5 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        console.error('Error al enviar ticket:', data.error);
        alert('Error al enviar el ticket. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error de conexión. Por favor, verifica tu conexión e intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 via-purple-800 to-slate-700 font-sans pb-16 relative overflow-x-hidden">
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl top-1/4 left-1/4 animate-float"></div>
        <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl bottom-1/4 right-1/4 animate-float animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float animation-delay-4000"></div>
      </div>

      {/* Botón flotante fijo para Admin/Técnicos - EXTRA GRANDE */}
      {isLoggedIn && (user?.role === 'ADMIN' || user?.role === 'TECNICO') && (
        <div className="fixed top-20 right-4 z-50">
          <a 
            href={user?.role === 'ADMIN' ? '/admin' : '/admin/presupuestos'}
            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-black text-lg shadow-2xl hover:shadow-purple-500/50 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 border-3 border-white/30 animate-pulse"
            title={`Panel de ${user?.role === 'ADMIN' ? 'Administración' : 'Técnico'}`}
          >
            <span className="text-2xl">{user?.role === 'ADMIN' ? '👑' : '🔧'}</span>
            <span className="hidden sm:inline font-bold">TABLERO</span>
          </a>
        </div>
      )}

      {/* Header principal - Sin fondo y uniforme */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
                            <ModernLogo size="lg" />
          </div>
          
          {/* Desktop - Iconos completos */}
          <div className="hidden md:flex gap-6 items-center">
            {/* Botón de acceso al tablero para admin/técnicos */}
            {isLoggedIn && (user?.role === 'ADMIN' || user?.role === 'TECNICO') && (
              <a 
                href={user?.role === 'ADMIN' ? '/admin' : '/admin/presupuestos'}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">{user?.role === 'ADMIN' ? '👑' : '🔧'}</span>
                <span className="font-medium">Tablero</span>
              </a>
            )}
            <span className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-cyan-300 transition-colors text-sm font-medium">
              <span role="img" aria-label="Usuario" className="text-base">👤</span> 
              <span>Mi cuenta</span>
            </span>
            <CartIconWithBadge />
          </div>

          {/* Mobile - Solo iconos sin texto */}
          <div className="md:hidden flex gap-4 items-center">
            {/* Botón de acceso al tablero para admin/técnicos en móvil */}
            {isLoggedIn && (user?.role === 'ADMIN' || user?.role === 'TECNICO') && (
              <a 
                href={user?.role === 'ADMIN' ? '/admin' : '/admin/presupuestos'}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                title={user?.role === 'ADMIN' ? 'Panel Admin' : 'Panel Técnico'}
              >
                <span className="text-lg">{user?.role === 'ADMIN' ? '👑' : '🔧'}</span>
              </a>
            )}
            <button className="text-white/80 hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-white/10">
              <span role="img" aria-label="Usuario" className="text-xl">👤</span>
            </button>
            <CartIconWithBadge />
          </div>
        </div>
      </header>



      {/* Hero Section - Estilo Catálogo */}
      <section id="inicio" className="relative flex flex-col items-center justify-center flex-1 min-h-[50vh] py-16 px-6 text-center fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-5xl mx-auto">
          {/* Título simple y elegante */}
          <div className="text-center mb-16">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-4">
              IT360 Soluciones
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto">
              Soluciones tecnológicas integrales para tu empresa
            </p>
          </div>
          
          {/* Tagline mejorado */}
          <div className="mb-16 max-w-6xl">
            <p className="text-2xl sm:text-3xl md:text-4xl font-medium px-6 text-white/90 leading-relaxed mb-6">
              Soluciones tecnológicas integrales para tu empresa.
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold px-6 leading-relaxed">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Innovación, soporte y desarrollo
              </span>
              <span className="text-white/80"> a tu alcance.</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="#contacto" className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold shadow-2xl hover:shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-700 transition-all duration-500 text-lg transform hover:scale-110 border border-cyan-400/30">
              <span className="flex items-center gap-3">
                <span>💬</span>
                Contáctanos
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
            <a href="/servicios" className="group px-10 py-5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl text-white rounded-full font-bold border border-purple-400/50 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-500 text-lg transform hover:scale-110 shadow-2xl hover:shadow-purple-500/25">
              <span className="flex items-center gap-3">
                <span>⚡</span>
                Ver Servicios
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
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

      {/* Productos Más Vendidos / Ofertas */}
      <section className="max-w-7xl mx-auto py-16 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <span>🔥</span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Más Vendidos</span>
            <span>🔥</span>
          </h2>
          <p className="text-sm text-white/80 max-w-3xl mx-auto leading-relaxed px-6">
            Los productos más populares y ofertas especiales que no te puedes perder
          </p>
        </div>
        
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-pulse h-full shadow-lg">
                <div className="w-full h-32 bg-white/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-white/20 rounded mb-3"></div>
                <div className="h-4 bg-white/20 rounded mb-4"></div>
                <div className="h-8 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {products.slice(0, 5).map((product, i) => (
              <div key={product.id || i} className="group relative">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col shadow-lg hover:shadow-xl">
                  {/* Imagen del producto */}
                  <div className="relative h-32 bg-gradient-to-br from-orange-500/30 to-red-500/30">
                    <img 
                      src={product.imagen || '/servicio-productos.png'} 
                      alt={product.name || 'Producto'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Badge de oferta */}
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      🔥 Oferta
                    </div>
                    
                    {/* Icono del producto */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-sm">{product.icon}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
                      {product.name || 'Producto'}
                    </h3>
                    
                    <p className="text-white/70 mb-4 leading-relaxed text-xs flex-grow line-clamp-2">
                      {product.description || 'Descripción del producto'}
                    </p>
                    
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-bold text-orange-300">
                        ${product.price || '0'}
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleProductSelect(product)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium text-xs shadow-lg"
                        >
                          Ver
                        </button>
                        <button 
                          onClick={() => addToCart(product)}
                          className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 font-medium text-xs border border-white/30"
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No hay productos disponibles</p>
          </div>
        )}
        
        {/* Botón para ir al catálogo completo */}
        <div className="text-center mt-8">
          <a 
            href="/catalogo" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold border border-orange-400/30 hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Ver Catálogo Completo</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Servicios Mejorados - Compactos y Atractivos */}
      <section id="servicios" className="max-w-7xl mx-auto py-12 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <span>🚀</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Servicios IT</span>
            <span>💡</span>
          </h2>
          <p className="text-sm text-white/80 max-w-3xl mx-auto leading-relaxed px-6">
            Transformamos tu negocio con tecnología de vanguardia. Invierte en el futuro digital.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.isArray(services) && services.map((serv, i) => (
            <div key={serv.id || i} className="group relative">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col shadow-lg hover:shadow-xl">
                {/* Icono del servicio */}
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl text-white">
                    {serv.name?.includes('Desarrollo') ? '💻' : 
                     serv.name?.includes('Redes') ? '🌐' : 
                     serv.name?.includes('Software') ? '🔧' : 
                     serv.name?.includes('Apps') ? '📱' : 
                     serv.name?.includes('PC') ? '🖥️' : '⚡'}
                  </span>
                </div>
                
                {/* Título del servicio */}
                <h3 className="text-base font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {serv.name || 'Servicio'}
                </h3>
                
                {/* Descripción compacta */}
                <p className="text-white/70 mb-4 leading-relaxed text-xs flex-grow line-clamp-3">
                  {serv.description || 'Descripción del servicio'}
                </p>
                
                {/* Beneficios de inversión */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs text-cyan-300 mb-1">
                    <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full"></span>
                    <span>Eficiencia Operativa</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cyan-300">
                    <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full"></span>
                    <span>Ventaja Competitiva</span>
                  </div>
                </div>
                
                {/* Precio y acción */}
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-cyan-300">
                      Presupuesto
                    </span>
                    <span className="text-xs text-white/60">Personalizado</span>
                  </div>
                  
                  <button 
                    onClick={() => handleOpenService(i)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium text-sm shadow-lg group-hover:shadow-xl"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action para servicios */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
            <h3 className="text-lg font-bold text-white mb-2">¿Por qué invertir en nuestros servicios?</h3>
            <p className="text-sm text-white/80 mb-4">
              Obtén un retorno de inversión del 300% en el primer año. Tecnología probada y soporte 24/7.
            </p>
            <a 
              href="/servicios" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold border border-cyan-400/30 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Ver Todos los Servicios</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
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

      {/* Testimonios - Homogéneo con el resto de la aplicación */}
      <section id="testimonios" className="bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-8 flex items-center justify-center gap-3">
            <span>Testimonios</span>
            <span className="text-lg sm:text-xl">⭐</span>
          </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center flex flex-col items-center overflow-hidden h-full">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-4">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="María G." className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-4 text-gray-700 relative z-10 text-sm sm:text-base leading-relaxed flex-grow">&ldquo;El equipo de IT360 transformó nuestra infraestructura digital. ¡100% recomendados!&rdquo;</p>
              <div className="font-semibold text-blue-700 relative z-10 text-sm sm:text-base">María G., CEO de EmpresaX</div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center flex flex-col items-center overflow-hidden h-full">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Juan P." className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-4 text-gray-700 relative z-10 text-sm sm:text-base leading-relaxed flex-grow">&ldquo;Soporte técnico rápido y eficiente. Nos sentimos seguros con su ciberseguridad.&rdquo;</p>
              <div className="font-semibold text-blue-700 relative z-10 text-sm sm:text-base">Juan P., CTO de TechCorp</div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center flex flex-col items-center overflow-hidden h-full">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-4">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Laura S." className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-4 text-gray-700 relative z-10 text-sm sm:text-base leading-relaxed flex-grow">&ldquo;Desarrollaron una app a medida que superó nuestras expectativas.&rdquo;</p>
              <div className="font-semibold text-blue-700 relative z-10 text-sm sm:text-base">Laura S., Gerente de Proyectos</div>
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
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold mb-8 text-blue-700 text-center">Consulta</h3>
          <p className="text-center text-gray-600 mb-8">Envía tu consulta y te responderemos a la brevedad</p>
          
          <form ref={formRef} onSubmit={handlePresupuesto} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Información personal */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <span>👤</span>
                Información Personal
              </h4>
            </div>
            
            <input 
              name="nombre" 
              type="text" 
              placeholder="Nombre completo *" 
              className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" 
              required 
            />
            
            <input 
              name="email" 
              type="email" 
              placeholder="Email *" 
              className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" 
              required 
            />
            
            <input 
              name="telefono" 
              type="tel" 
              placeholder="Teléfono *" 
              className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" 
              required 
            />
            
            <input 
              name="empresa" 
              type="text" 
              placeholder="Empresa (opcional)" 
              className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" 
            />
            
            {/* Tipo de servicio */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <span>🔧</span>
                Tipo de Servicio
              </h4>
            </div>
            
            <select 
              name="servicio" 
              className="col-span-2 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" 
              required
            >
              <option value="">Selecciona el tipo de servicio *</option>
              <option value="Desarrollo Web">🌐 Desarrollo Web</option>
              <option value="Desarrollo de Software">💻 Desarrollo de Software</option>
              <option value="Aplicaciones Móviles">📱 Aplicaciones Móviles</option>
              <option value="Ciberseguridad">🔒 Ciberseguridad</option>
              <option value="Soporte Técnico">🛠️ Soporte Técnico</option>
              <option value="Infraestructura y Redes">🌐 Infraestructura y Redes</option>
              <option value="Consultoría IT">📊 Consultoría IT</option>
              <option value="Mantenimiento de Sistemas">⚙️ Mantenimiento de Sistemas</option>
              <option value="Migración de Datos">📦 Migración de Datos</option>
              <option value="Capacitación">🎓 Capacitación</option>
              <option value="Otro">❓ Otro</option>
            </select>
            
            {/* Presupuesto estimado */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <span>💰</span>
                Presupuesto y Detalles
              </h4>
            </div>
            
            <input 
              name="presupuesto" 
              type="number" 
              min="0" 
              step="1000" 
              placeholder="Presupuesto estimado (opcional)" 
              className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" 
            />
            
            <select 
              name="urgencia" 
              className="col-span-1 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl"
            >
              <option value="">Nivel de urgencia</option>
              <option value="Baja">🟢 Baja (1-2 meses)</option>
              <option value="Media">🟡 Media (2-4 semanas)</option>
              <option value="Alta">🔴 Alta (1-2 semanas)</option>
              <option value="Crítica">⚫ Crítica (inmediata)</option>
            </select>
            
            {/* Mensaje detallado */}
            <textarea 
              name="mensaje" 
              className="col-span-2 border-2 border-blue-100 rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg sm:text-xl" 
              rows={6} 
              required 
              placeholder="Describe detalladamente tu proyecto, necesidades específicas, requisitos técnicos, plazos, y cualquier información adicional que consideres importante... *"
            />
            
            {/* Botón de envío */}
            <button 
              type="submit" 
              className="col-span-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🎫</span>
              Crear Ticket de Soporte
            </button>
            
            {success && (
              <div className="col-span-2 text-green-600 bg-green-50 border border-green-200 rounded-xl px-6 py-4 font-semibold text-center mt-4 text-lg flex items-center justify-center gap-2">
                <span>✅</span>
                ¡Ticket creado correctamente! Nos pondremos en contacto contigo pronto.
              </div>
            )}
          </form>
          
          <div className="text-center text-base text-gray-500 mt-8">
            <p>📧 O escríbenos directamente a <a href="mailto:it360tecnologia@gmail.com" className="underline text-blue-600 hover:text-blue-800">it360tecnologia@gmail.com</a></p>
            <p className="mt-2">📱 WhatsApp: <a href="https://wa.me/5493425089906" className="underline text-green-600 hover:text-green-800">+54 9 342 508-9906</a></p>
          </div>
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
                      Presupuesto
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
