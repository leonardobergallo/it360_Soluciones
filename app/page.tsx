"use client";
import { useEffect, useState } from 'react';
import CartIconWithBadge from "@/components/CartIconWithBadge";

import ModernLogo from "@/components/ModernLogo";


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

  // Estado para autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenService(null);
      }
    };
    if (openService !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openService]);

  interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    imagen?: string;
    descripcionLarga?: string;
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





  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 via-purple-800 to-slate-700 font-sans pb-16 relative overflow-x-hidden">
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
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



      


      {/* Servicios Mejorados - Compactos y Atractivos */}
      <section id="servicios" className="max-w-7xl mx-auto py-16 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
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
                

                
                {/* Botón de acción */}
                <div className="flex flex-col gap-3 mt-auto">
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

      {/* Sobre Nosotros - Completamente Rediseñado */}
      <section id="nosotros" className="py-20 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          

          {/* Contenido principal */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen y estadísticas */}
            <div className="relative">
              {/* Imagen principal */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                  alt="Equipo IT360" 
                  className="relative w-full h-80 object-cover rounded-3xl shadow-2xl border border-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
              </div>

              {/* Estadísticas destacadas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">500+</div>
                  <div className="text-white/80 text-sm">Proyectos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">50+</div>
                  <div className="text-white/80 text-sm">Clientes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">5+</div>
                  <div className="text-white/80 text-sm">Años</div>
                </div>
              </div>
            </div>

            {/* Texto y características */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">💡</span>
                  Nuestra Misión
                </h3>
                <p className="text-white/90 leading-relaxed text-lg mb-6">
                  En IT360 Soluciones somos un equipo apasionado por la tecnología y la innovación. 
                  Nos dedicamos a brindar soluciones integrales que impulsan el crecimiento de nuestros clientes, 
                  combinando experiencia, creatividad y compromiso con la excelencia.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Transformamos desafíos tecnológicos en oportunidades de crecimiento, 
                  utilizando las últimas tecnologías y metodologías para garantizar resultados excepcionales.
                </p>
              </div>

              {/* Características del equipo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🚀</span>
                    <h4 className="font-bold text-white">Innovación</h4>
                  </div>
                  <p className="text-white/80 text-sm">Tecnologías de vanguardia y soluciones creativas</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⚡</span>
                    <h4 className="font-bold text-white">Velocidad</h4>
                  </div>
                  <p className="text-white/80 text-sm">Respuesta rápida y entrega eficiente</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🛡️</span>
                    <h4 className="font-bold text-white">Confiabilidad</h4>
                  </div>
                  <p className="text-white/80 text-sm">Soluciones robustas y soporte 24/7</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎯</span>
                    <h4 className="font-bold text-white">Resultados</h4>
                  </div>
                  <p className="text-white/80 text-sm">Enfoque en ROI y satisfacción del cliente</p>
                </div>
              </div>
            </div>
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

      {/* Contacto Unificado - Redirige al sistema de tickets */}
      <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Header de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                ¿Listo para
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                transformar tu negocio?
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Nuestro sistema unificado de contacto te conecta directamente con nuestro equipo de expertos
            </p>
          </div>

          {/* Contenido principal */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Información de contacto */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  Contacto Directo
                </h3>
                
                <div className="space-y-6">
                  {/* WhatsApp */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">WhatsApp</h4>
                      <a 
                        href="https://wa.me/5493425089906" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        +54 9 342 508-9906
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Email</h4>
                      <a 
                        href="mailto:it360tecnologia@gmail.com" 
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        it360tecnologia@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Ubicación</h4>
                      <p className="text-white/80">Santa Fe, Argentina</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficios del sistema */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  ¿Por qué nuestro sistema?
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✅</span>
                    <span className="text-white/90">Respuesta en menos de 24 horas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✅</span>
                    <span className="text-white/90">Seguimiento completo de tu consulta</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✅</span>
                    <span className="text-white/90">Atención personalizada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✅</span>
                    <span className="text-white/90">Presupuestos detallados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA principal */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 rounded-3xl p-12">
                <div className="mb-8">
                  <span className="text-6xl mb-4 block">🎫</span>
                  <h3 className="text-3xl font-bold text-white mb-4">Sistema de Tickets</h3>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Nuestro sistema unificado te permite crear tickets de consulta 
                    que son atendidos por nuestro equipo de expertos con prioridad.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-cyan-400">🔢</span>
                    <span>Número de ticket único</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-purple-400">📊</span>
                    <span>Seguimiento en tiempo real</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-green-400">⚡</span>
                    <span>Respuesta garantizada</span>
                  </div>
                </div>

                <a 
                  href="/contacto" 
                  className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110 border border-cyan-400/30"
                >
                  <span className="text-2xl">💬</span>
                  Crear Consulta Ahora
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>



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



    </div>
  );
}
