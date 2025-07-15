"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CartIconWithBadge from "@/components/CartIconWithBadge";
import FooterNav from "@/components/FooterNav";

export default function Home() {
  // Animación simple de fade-in al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.querySelectorAll('.fade-in').forEach((el, i) => {
        setTimeout(() => el.classList.add('opacity-100', 'translate-y-0'), 200 + i * 200);
      });
    }
  }, []);

  // Estado para modal de servicio
  const [openService, setOpenService] = useState<null | number>(null);
  const handleOpenService = (i: number) => setOpenService(i);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenService(null);
    };
    if (openService !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openService]);

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
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
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [openProduct, setOpenProduct] = useState<null | number>(null);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Agregar imágenes por defecto a los productos
          const productsWithImages = data.map((product: any, index: number) => ({
            ...product,
            imagen: `/servicio-productos.png`,
            descripcionLarga: product.description
          }));
          setProducts(productsWithImages);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  // Enviar presupuesto
  const handlePresupuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    const form = formRef.current;
    if (!form) return;
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      telefono: form.telefono.value,
      empresa: form.empresa.value,
      servicio: form.servicio.value,
      presupuesto: form.presupuesto.value,
      mensaje: form.mensaje.value,
    };
    // Aquí puedes enviar a una API o email
    await new Promise(r => setTimeout(r, 1200)); // Simula envío
    setSending(false);
    setSuccess(true);
    form.reset();
  };

  const [toast, setToast] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans pb-16 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/4 left-1/4 animate-float"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-float animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float animation-delay-4000"></div>
      </div>

      {/* Header principal - Futurista */}
      <header className="fixed top-0 left-0 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/icono.png" alt="Logo IT360" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              IT360 Soluciones
            </span>
          </div>
          
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1 cursor-pointer text-white/70 hover:text-cyan-400 transition-colors">
              <span role="img" aria-label="Usuario">👤</span> Mi cuenta
            </span>
            <CartIconWithBadge />
          </div>
        </div>
      </header>

      {/* Barra de navegación - Futurista */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 mt-16">
        <div className="container mx-auto flex items-center gap-6 py-3 px-4">
          <button className="text-lg text-white/70 hover:text-cyan-400 transition-colors">☰</button>
          <a href="#inicio" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Inicio</a>
          <a href="#servicios" className="text-white/70 hover:text-cyan-400 transition-colors font-medium">Servicios</a>
          <a href="#productos" className="text-white/70 hover:text-cyan-400 transition-colors">Productos</a>
          <a href="#nosotros" className="text-white/70 hover:text-cyan-400 transition-colors">Nosotros</a>
          <a href="#testimonios" className="text-white/70 hover:text-cyan-400 transition-colors">Testimonios</a>
          <a href="#contacto" className="text-white/70 hover:text-cyan-400 transition-colors">Contacto</a>
          <Link href="/catalogo" className="ml-auto text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Catálogo</Link>
          <Link href="/login" className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
            <span role="img" aria-label="Login">🔑</span> Login
          </Link>
        </div>
      </nav>

      {/* Hero Section - Futurista */}
      <section id="inicio" className="relative flex flex-col items-center justify-center flex-1 min-h-[60vh] py-16 px-4 text-center fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-white/80">Tecnología del Futuro</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 px-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Bienvenido a IT360 Soluciones
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl font-medium px-4 text-white/80 leading-relaxed">
            Soluciones tecnológicas integrales para tu empresa. 
            <span className="text-cyan-400 font-semibold"> Innovación, soporte y desarrollo</span> a tu alcance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contacto" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-lg transform hover:scale-105">
              Contáctanos
            </a>
            <a href="#servicios" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 text-lg">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Pasarela de tecnologías - Futurista */}
      <section className="py-12 bg-white/5 backdrop-blur-sm fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 overflow-x-auto">
            {/* Next.js */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 120 40" fill="none" className="text-white">
                <text x="0" y="32" fontSize="32" fontWeight="bold" fill="currentColor">NEXT</text>
                <text x="72" y="36" fontSize="12" fill="currentColor">.Js</text>
              </svg>
            </div>
            
            {/* React */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-cyan-400">
                <g>
                  <ellipse cx="16" cy="16" rx="14" ry="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <ellipse cx="16" cy="16" rx="6" ry="14" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
                </g>
              </svg>
              <span className="text-white font-medium">React</span>
            </div>
            
            {/* Node.js */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-green-400">
                <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="currentColor"/>
                <text x="8" y="22" fontSize="10" fill="white">Node</text>
              </svg>
              <span className="text-white font-medium">Node.js</span>
            </div>
            
            {/* PostgreSQL */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-400">
                <ellipse cx="16" cy="16" rx="14" ry="14" fill="currentColor"/>
                <text x="7" y="22" fontSize="10" fill="white">PGSQL</text>
              </svg>
              <span className="text-white font-medium">PostgreSQL</span>
            </div>
            
            {/* TypeScript */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-500">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <text x="4" y="22" fontSize="14" fill="white">TS</text>
              </svg>
              <span className="text-white font-medium">TypeScript</span>
            </div>
            
            {/* Docker */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-400">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <text x="4" y="22" fontSize="16" fill="white">🐳</text>
              </svg>
              <span className="text-white font-medium">Docker</span>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios con modal expandible - Futurista */}
      <section id="servicios" className="max-w-7xl mx-auto py-16 px-4 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nuestros <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Servicios</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Soluciones tecnológicas integrales para impulsar tu negocio hacia el futuro digital
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(services) && services.map((serv, i) => (
            <div key={serv.id || i} className="group relative">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">💻</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {serv.name || 'Servicio'}
                </h3>
                
                <p className="text-white/70 mb-4 leading-relaxed">
                  {serv.description || 'Descripción del servicio'}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-cyan-400">
                    ${serv.price || '0'}
                  </span>
                  <button 
                    onClick={() => handleOpenService(i)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
                  >
                    Saber más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos - Futurista */}
      <section id="productos" className="max-w-7xl mx-auto py-16 px-4 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nuestros <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Productos</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Tecnología de vanguardia para optimizar tu infraestructura empresarial
          </p>
        </div>
        
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-pulse">
                <div className="w-full h-48 bg-white/10 rounded-lg mb-4"></div>
                <div className="h-6 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded mb-4"></div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <div key={product.id || i} className="group relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <Image 
                      src={product.imagen || '/servicio-productos.png'} 
                      alt={product.name || 'Producto'} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {product.name || 'Producto'}
                    </h3>
                    
                    <p className="text-white/70 mb-4 leading-relaxed">
                      {product.description || 'Descripción del producto'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-400">
                        ${product.price || '0'}
                      </span>
                      <button 
                        onClick={() => setOpenProduct(i)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Nosotros - Responsive */}
      <section id="nosotros" className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-800 mb-6 sm:mb-8 flex items-center gap-2">
            <span>Sobre Nosotros</span>
            <span className="text-xl sm:text-2xl">🚀</span>
          </h2>
          <div className="relative mb-6 sm:mb-8">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-60 animate-pulse"></span>
            <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2" alt="Equipo IT360" className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl" />
          </div>
          <div className="max-w-3xl mx-auto text-center text-base sm:text-lg text-gray-700 bg-white bg-opacity-80 rounded-xl p-6 sm:p-8 shadow-lg">
            <p className="mb-2 font-semibold text-blue-700 text-xl flex items-center justify-center gap-2"><span>💡</span> Innovación, experiencia y compromiso</p>
            <p>En IT360 Soluciones somos un equipo apasionado por la tecnología y la innovación. Nos dedicamos a brindar soluciones integrales que impulsan el crecimiento de nuestros clientes, combinando experiencia, creatividad y compromiso.</p>
          </div>
        </div>
      </section>

      {/* Testimonios - Responsive */}
      <section id="testimonios" className="bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-800 mb-8 sm:mb-10 flex items-center gap-2 justify-center">
            <span>Testimonios</span>
            <span className="text-xl sm:text-2xl">⭐</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center flex flex-col items-center overflow-hidden">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-4">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="María G." className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-4 text-gray-700 relative z-10 text-sm sm:text-base">"El equipo de IT360 transformó nuestra infraestructura digital. ¡100% recomendados!"</p>
              <div className="font-semibold text-blue-700 relative z-10 text-sm sm:text-base">María G., CEO de EmpresaX</div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col items-center overflow-hidden">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Juan P." className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-4 text-gray-700 relative z-10">"Soporte técnico rápido y eficiente. Nos sentimos seguros con su ciberseguridad."</p>
              <div className="font-semibold text-blue-700 relative z-10">Juan P., CTO de TechCorp</div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col items-center overflow-hidden">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-400 blur opacity-40 animate-pulse"></span>
              <div className="relative mb-4">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Laura S." className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-200" />
              </div>
              <p className="italic mb-4 text-gray-700 relative z-10">"Desarrollaron una app a medida que superó nuestras expectativas."</p>
              <div className="font-semibold text-blue-700 relative z-10">Laura S., Gerente de Proyectos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto - Responsive */}
      <section id="contacto" className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-blue-800 text-center drop-shadow">Contacto y Presupuesto</h2>
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-blue-100">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-blue-700 text-center">Solicitar Presupuesto</h3>
          <form ref={formRef} onSubmit={handlePresupuesto} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <input name="nombre" type="text" placeholder="Nombre" className="col-span-1 border-2 border-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base sm:text-lg" required />
            <input name="email" type="email" placeholder="Email" className="col-span-1 border-2 border-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base sm:text-lg" required />
            <input name="telefono" type="tel" placeholder="Teléfono" className="col-span-1 border-2 border-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base sm:text-lg" required />
            <input name="empresa" type="text" placeholder="Empresa (opcional)" className="col-span-1 border-2 border-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base sm:text-lg" />
            <select name="servicio" className="col-span-1 border-2 border-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base sm:text-lg" required>
              <option value="">Selecciona una opción</option>
              <option value="Desarrollo de Software">Desarrollo de Software</option>
              <option value="Ciberseguridad">Ciberseguridad</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Infraestructura">Infraestructura</option>
              <option value="Consultoría">Consultoría</option>
            </select>
            <input name="presupuesto" type="number" min="0" step="1000" placeholder="Presupuesto estimado (opcional)" className="col-span-1 border-2 border-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base sm:text-lg" />
            <textarea name="mensaje" className="col-span-2 border-2 border-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base sm:text-lg" rows={4} required placeholder="Describe brevemente tu necesidad o proyecto..." />
            <button type="submit" className="col-span-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:from-blue-800 hover:to-blue-600 transition mt-2">Solicitar presupuesto</button>
            {success && <div className="col-span-2 text-green-600 bg-green-50 border border-green-200 rounded px-4 py-2 font-semibold text-center mt-2">¡Presupuesto enviado correctamente!</div>}
          </form>
          <div className="text-center text-sm text-gray-500 mt-6">O escríbenos a <a href="mailto:info@it360.com" className="underline">info@it360.com</a></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm mt-auto">
        © {new Date().getFullYear()} IT360 Soluciones. Todos los derechos reservados.
      </footer>

      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {toast}
        </div>
      )}
      <FooterNav />

      {/* WhatsApp Float Button - Futurista */}
      <a 
        href="https://wa.me/+5491112345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
      >
        <span className="text-2xl">��</span>
      </a>
    </div>
  );
}
