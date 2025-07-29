"use client";
import { useEffect, useState } from 'react';
import CartIconWithBadge from "@/components/CartIconWithBadge";
import FooterNav from "@/components/FooterNav";
import ModernLogo from "@/components/ModernLogo";

export default function ServiciosPage() {
  // Estado para el menú móvil

  
  // Estado para autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  // Estado para servicios dinámicos
  const [servicios, setServicios] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Cargar servicios desde la API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services?active=true');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }
        
        const data = await response.json();
        
        // Agregar información adicional a los servicios
        const servicesWithDetails = data.map((service: any) => {
          let icon = '💻'; // icono por defecto
          let image = '/servicio-apps.png'; // imagen por defecto
          let features: string[] = [];
          let duration = '2-4 semanas';
          
          // Asignar iconos, imágenes y características basadas en el nombre del servicio
          const serviceName = service.name?.toLowerCase() || '';
          
          if (serviceName.includes('soporte') || serviceName.includes('técnico') || serviceName.includes('reparación') || serviceName.includes('pc')) {
            icon = '🖥️';
            image = '/servicio-pc.png';
            duration = '1-3 días';
            features = [
              "Reparación y mantenimiento de computadoras y notebooks",
              "Optimización del sistema operativo (Windows, Linux, etc.)",
              "Eliminación de virus, backup y recuperación de datos",
              "Instalación de programas y drivers",
              "Diagnóstico y solución de problemas de hardware y software",
              "Mantenimiento preventivo y limpieza de equipos"
            ];
          } else if (serviceName.includes('redes') || serviceName.includes('internet') || serviceName.includes('wifi')) {
            icon = '🌐';
            image = '/servicio-redes.png';
            duration = '1-2 días';
            features = [
              "Configuración de redes WiFi y cableadas",
              "Instalación y optimización de routers, repetidores y puntos de acceso",
              "Solución de problemas de conectividad y velocidad",
              "Cableado estructurado para hogares y oficinas",
              "Configuración de redes empresariales",
              "Optimización de ancho de banda y seguridad de red"
            ];
          } else if (serviceName.includes('desarrollo') || serviceName.includes('software') || serviceName.includes('web')) {
            icon = '💻';
            image = '/servicio-apps.png';
            duration = '2-8 semanas';
            features = [
              "Sistemas web personalizados para empresas, comercios o profesionales",
              "Paneles de gestión, administración de turnos, stock, facturación",
              "Formularios inteligentes, reportes automáticos",
              "Conexión con bases de datos y APIs",
              "Sistemas de gestión empresarial (ERP)",
              "Aplicaciones web responsivas y escalables"
            ];
          } else if (serviceName.includes('móvil') || serviceName.includes('app') || serviceName.includes('android') || serviceName.includes('ios')) {
            icon = '⚡';
            image = '/servicio-apps.png';
            duration = '4-12 semanas';
            features = [
              "Desarrollo de apps para Android e iOS",
              "Interfaz amigable, personalizada para tu negocio",
              "Funciones como geolocalización, notificaciones",
              "Acceso por usuario y autenticación segura",
              "Integración con sistemas existentes",
              "Mantenimiento y actualizaciones continuas"
            ];
          } else if (serviceName.includes('venta') || serviceName.includes('producto') || serviceName.includes('accesorio')) {
            icon = '🛍️';
            image = '/servicio-productos.png';
            duration = 'Inmediato';
            features = [
              "Accesorios, periféricos, routers, memorias, discos externos",
              "Productos seleccionados de marcas reconocidas",
              "Asesoramiento para elegir lo mejor para tu necesidad",
              "Posibilidad de combos o productos con instalación incluida",
              "Garantía oficial y soporte técnico",
              "Envío a domicilio y servicio post-venta"
            ];
          } else if (serviceName.includes('ciberseguridad') || serviceName.includes('seguridad')) {
            icon = '🔒';
            image = '/servicio-software.png';
            duration = '1-2 semanas';
            features = [
              "Auditorías de seguridad informática",
              "Implementación de políticas de seguridad",
              "Protección contra malware y ransomware",
              "Configuración de firewalls y antivirus",
              "Capacitación en seguridad para empleados",
              "Monitoreo continuo de amenazas"
            ];
          } else if (serviceName.includes('consultoría') || serviceName.includes('consultoria')) {
            icon = '📊';
            image = '/servicio-software.png';
            duration = '1-4 semanas';
            features = [
              "Análisis de necesidades tecnológicas",
              "Planificación estratégica de IT",
              "Evaluación de infraestructura existente",
              "Recomendaciones de mejora",
              "Roadmap de implementación",
              "Seguimiento y optimización continua"
            ];
          } else {
            // Características genéricas para otros servicios
            features = [
              "Análisis personalizado de necesidades",
              "Implementación profesional",
              "Soporte técnico especializado",
              "Documentación completa",
              "Capacitación del personal",
              "Mantenimiento post-implementación"
            ];
          }
          
          return {
            ...service,
            icon,
            image,
            features,
            duration,
            shortDescription: service.description?.substring(0, 100) + '...' || 'Servicio profesional con garantía de calidad'
          };
        });
        
        setServicios(servicesWithDetails);
      } catch (error) {
        console.error('Error cargando servicios:', error);
        setServicios([]); // Mostrar array vacío si hay error
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Función para manejar el contacto
  const handleContact = (serviceName: string) => {
    // Redirigir al formulario de contacto con el servicio pre-seleccionado
    window.location.href = `/#contacto?servicio=${encodeURIComponent(serviceName)}`;
  }; // Animación simple de fade-in al cargar
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



  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 via-purple-800 to-slate-700 font-sans pb-16 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl top-1/4 left-1/4 animate-float"></div>
        <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl bottom-1/4 right-1/4 animate-float animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float animation-delay-4000"></div>
      </div>

      {/* Botón flotante fijo para Admin/Técnicos */}
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

      {/* Header principal */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/">
              <ModernLogo size="lg" />
            </a>
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
            <a href="/mi-cuenta" className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-cyan-300 transition-colors text-sm font-medium">
              <span role="img" aria-label="Usuario" className="text-base">👤</span> 
              <span>Mi cuenta</span>
            </a>
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
            <a href="/mi-cuenta" className="text-white/80 hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-white/10">
              <span role="img" aria-label="Usuario" className="text-xl">👤</span>
            </a>
            <CartIconWithBadge />
          </div>
        </div>
      </header>



      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 min-h-[40vh] py-20 px-6 text-center fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-white/90 font-medium">Servicios Profesionales</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-extrabold mb-6 px-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              IT360 Soluciones
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg mb-8 max-w-4xl font-medium px-6 text-white/90 leading-relaxed">
            Tu socio tecnológico para el crecimiento y la innovación digital
          </p>
        </div>
      </section>

      {/* Servicios Grid - Diseño Compacto Mejorado */}
      <section className="max-w-7xl mx-auto py-12 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
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
        
        {loadingServices ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-pulse h-full shadow-lg">
                <div className="w-12 h-12 bg-white/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-white/20 rounded mb-3"></div>
                <div className="h-4 bg-white/20 rounded mb-4"></div>
                <div className="h-3 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : servicios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicios.map((servicio, index) => (
              <div key={servicio.id} className="group relative">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col shadow-lg hover:shadow-xl">
                  {/* Icono del servicio */}
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-xl text-white">
                      {servicio.icon}
                    </span>
                  </div>
                  
                  {/* Título del servicio */}
                  <h3 className="text-base font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {servicio.name}
                  </h3>
                  
                  {/* Descripción compacta */}
                  <p className="text-white/70 mb-4 leading-relaxed text-xs flex-grow line-clamp-3">
                    {servicio.description}
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
                      onClick={() => handleContact(servicio.name)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium text-sm shadow-lg group-hover:shadow-xl"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔧</div>
            <h3 className="text-2xl font-bold text-white mb-4">No hay servicios disponibles</h3>
            <p className="text-white/80 mb-8">Por favor, contacta con nosotros para más información sobre nuestros servicios.</p>
            <a 
              href="/#contacto"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-lg transform hover:scale-105"
            >
              Contactar
            </a>
          </div>
        )}
      </section>

      {/* Sección de beneficios */}
      <section className="bg-white/10 backdrop-blur-sm py-20 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center justify-center gap-4">
              <span>¿Por qué elegir</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">IT360 Soluciones?</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed px-6">
              Nuestro compromiso con la excelencia y la innovación nos distingue
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🚀",
                title: "Innovación Constante",
                description: "Utilizamos las últimas tecnologías y metodologías para ofrecer soluciones de vanguardia"
              },
              {
                icon: "👥",
                title: "Equipo Experto",
                description: "Profesionales certificados con años de experiencia en el sector tecnológico"
              },
              {
                icon: "⚡",
                title: "Respuesta Rápida",
                description: "Tiempos de respuesta optimizados para resolver tus necesidades de manera eficiente"
              },
              {
                icon: "🛡️",
                title: "Garantía de Calidad",
                description: "Todos nuestros servicios incluyen garantía y soporte técnico continuo"
              }
            ].map((beneficio, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl text-white">{beneficio.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {beneficio.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {beneficio.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Contáctanos hoy mismo y descubre cómo podemos ayudarte a alcanzar tus objetivos tecnológicos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/#contacto"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-lg transform hover:scale-105"
              >
                Solicitar Presupuesto
              </a>
              <a 
                href="https://wa.me/5493425089906"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 text-lg transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>📱</span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterNav />
    </div>
  );
} 