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
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans pb-16"> {/* pb-16 para espacio del footer */}
      {/* Header principal */}
      <header className="bg-white py-3 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <Image src="/icono.png" alt="Logo IT360" width={50} height={50} className="rounded-lg" />
          {/* Eliminado el input de búsqueda y el botón de lupa */}
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1 cursor-pointer">
              <span role="img" aria-label="Usuario">👤</span> Mi cuenta
            </span>
            <CartIconWithBadge />
          </div>
        </div>
      </header>

      {/* Barra de navegación - Responsive */}
      <nav className="bg-white border-b">
        <div className="container mx-auto flex items-center gap-6 py-2">
          <button className="text-lg">☰</button>
          <a href="#inicio" className="font-bold text-blue-700">Inicio</a>
          <a href="#servicios" className="text-blue-700 font-semibold">Servicios</a>
          <a href="#productos">Productos</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#contacto">Contacto</a>
          <Link href="/catalogo" className="ml-auto text-blue-700 hover:text-blue-800 font-medium transition-colors">Catálogo</Link>
          <Link href="/login" className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium shadow">
            <span role="img" aria-label="Login">🔑</span> Login
          </Link>
        </div>
      </nav>

      {/* Hero Section - Responsive */}
      <section id="inicio" className="relative flex flex-col items-center justify-center flex-1 min-h-[50vh] sm:min-h-[55vh] py-8 sm:py-16 bg-gradient-to-br from-blue-900 via-blue-600 to-blue-200 text-center fade-in opacity-0 translate-y-8 transition-all duration-700 overflow-hidden">
        {/* Imagen de fondo opcional, solo superpone con opacidad */}
        <img src="/circuloazulbannerfondo.png" alt="Banner IT360" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none" style={{ opacity: 0.32 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 px-4" style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif', letterSpacing: '-1px', color: '#fff', textShadow: '0 2px 16px #1a237e99' }}>
            Bienvenido a IT360 Soluciones
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl font-medium px-4" style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif', color: '#e3e8f7', textShadow: '0 1px 8px #1a237e88' }}>
            Soluciones tecnológicas integrales para tu empresa. Innovación, soporte y desarrollo a tu alcance.
          </p>
          <a href="#contacto" className="px-6 sm:px-8 py-3 bg-blue-700 text-white rounded-full font-semibold shadow hover:bg-blue-800 transition-colors text-sm sm:text-base">Contáctanos</a>
        </div>
      </section>

      {/* Pasarela de tecnologías - Responsive */}
      <section className="py-6 sm:py-8 bg-white fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-10 overflow-x-auto">
            {/* Next.js */}
            <svg width="80" height="30" viewBox="0 0 120 40" fill="none" className="sm:w-[120px] sm:h-[40px]"><text x="0" y="32" fontSize="40" fontWeight="bold" fill="#000">NEXT</text><text x="90" y="36" fontSize="16" fill="#000">.Js</text></svg>
            {/* React */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><g><ellipse cx="16" cy="16" rx="14" ry="6" stroke="#61DAFB" strokeWidth="2" fill="none"/><ellipse cx="16" cy="16" rx="6" ry="14" stroke="#61DAFB" strokeWidth="2" fill="none"/><circle cx="16" cy="16" r="2.5" fill="#61DAFB"/></g></svg>
            {/* React Native */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><g><ellipse cx="16" cy="16" rx="14" ry="6" stroke="#00D8FF" strokeWidth="2" fill="none"/><ellipse cx="16" cy="16" rx="6" ry="14" stroke="#00D8FF" strokeWidth="2" fill="none"/><circle cx="16" cy="16" r="2.5" fill="#00D8FF"/></g></svg>
            {/* Node.js */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="#8CC84B"/><text x="8" y="22" fontSize="12" fill="#fff">Node</text></svg>
            {/* PostgreSQL */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><ellipse cx="16" cy="16" rx="14" ry="14" fill="#336791"/><text x="7" y="22" fontSize="12" fill="#fff">PGSQL</text></svg>
            {/* Tailwind */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><path d="M8 20c0-6 8-6 8 0s8 6 8 0" stroke="#38BDF8" strokeWidth="2" fill="none"/><path d="M8 12c0-6 8-6 8 0s8 6 8 0" stroke="#38BDF8" strokeWidth="2" fill="none"/></svg>
            {/* Prisma */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><polygon points="16,2 30,30 2,30" fill="#0C344B"/><text x="8" y="24" fontSize="12" fill="#fff">Prisma</text></svg>
            {/* TypeScript */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><rect width="32" height="32" rx="6" fill="#3178C6"/><text x="4" y="22" fontSize="16" fill="#fff">TS</text></svg>
            {/* Docker */}
            <svg width="36" height="36" viewBox="0 0 32 32" className="sm:w-12 sm:h-12"><rect width="32" height="32" rx="6" fill="#2496ED"/><text x="4" y="22" fontSize="16" fill="#fff">🐳</text></svg>
            {/* Extra: file.svg */}
            <img src="/file.svg" alt="File" className="h-8 sm:h-12 w-auto" />
            {/* Extra: globe.svg */}
            <img src="/globe.svg" alt="Globe" className="h-8 sm:h-12 w-auto" />
            {/* Extra: window.svg */}
            <img src="/window.svg" alt="Window" className="h-8 sm:h-12 w-auto" />
            {/* Extra: vercel.svg */}
            <img src="/vercel.svg" alt="Vercel" className="h-8 sm:h-12 w-auto" />
          </div>
        </div>
      </section>

      {/* Servicios con modal expandible - Responsive */}
      <section id="servicios" className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-8 sm:mb-10">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.isArray(services) && services.map((serv, i) => (
            <a
              key={serv.id}
              href="/contacto"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center hover:scale-105 transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img src={serv.image || '/servicio-software.png'} alt={serv.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">{serv.name}</h3>
                <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{serv.description}</p>
              </div>
            </a>
          ))}
        </div>
        {/* Modal de servicio expandido */}
        {openService !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setOpenService(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn" onClick={e => e.stopPropagation()}>
              <button onClick={() => setOpenService(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl">×</button>
              <img src={servicios[openService].imagen} alt={servicios[openService].nombre} className="w-60 h-60 object-contain mx-auto mb-6 rounded-xl shadow" />
              <h3 className="text-2xl font-bold text-blue-800 mb-4">{servicios[openService].nombre}</h3>
              <p className="text-gray-700 text-lg mb-2">{servicios[openService].descripcionLarga}</p>
              <button
                onClick={e => { e.stopPropagation(); window.location.href = '/contacto'; }}
                className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium mt-4"
              >
                Solicitar cotización
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Productos con modal expandible - Responsive */}
      <section id="productos" className="bg-blue-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 fade-in opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-8 sm:mb-10">Nuestros Productos</h2>
          {loadingProducts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay productos disponibles en este momento.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((prod: any, i: number) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center hover:scale-105 transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => setOpenProduct(i)}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img src={prod.imagen} alt={prod.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">{prod.name}</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{prod.description}</p>
                    <div className="text-xl sm:text-2xl font-bold text-blue-700 mb-3 sm:mb-4">${prod.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-3 sm:mb-4">Stock: {prod.stock}</div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const stored = localStorage.getItem("carrito");
                        let cart: any[] = stored ? JSON.parse(stored) : [];
                        const existingItem = cart.find((item: any) => item.id === prod.id);
                        if (existingItem) {
                          existingItem.qty += 1;
                        } else {
                          cart.push({ ...prod, qty: 1, type: "product" });
                        }
                        localStorage.setItem("carrito", JSON.stringify(cart));
                        setToast("¡Producto agregado al carrito!");
                        setTimeout(() => setToast(""), 2000);
                      }}
                      className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                ))}
              </div>
              {/* Modal de producto expandido */}
              {openProduct !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn">
                    <button onClick={() => setOpenProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl">×</button>
                    <img src={products[openProduct].imagen} alt={products[openProduct].name} className="w-60 h-60 object-contain mx-auto mb-6 rounded-xl shadow" />
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">{products[openProduct].name}</h3>
                    <p className="text-gray-700 text-lg mb-4">{products[openProduct].descripcionLarga}</p>
                    <div className="text-3xl font-bold text-blue-700 mb-2">${products[openProduct].price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-4">Stock disponible: {products[openProduct].stock}</div>
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const stored = localStorage.getItem("carrito");
                          let cart: any[] = stored ? JSON.parse(stored) : [];
                          const existingItem = cart.find((item: any) => item.id === products[openProduct].id);
                          if (existingItem) {
                            existingItem.qty += 1;
                          } else {
                            cart.push({ ...products[openProduct], qty: 1, type: "product" });
                          }
                          localStorage.setItem("carrito", JSON.stringify(cart));
                          setToast("¡Producto agregado al carrito!");
                          setTimeout(() => setToast(""), 2000);
                        }}
                        className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                      >
                        Agregar al carrito
                      </button>
                      <Link 
                        href="/catalogo" 
                        className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
                      >
                        Ver catálogo
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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
    </div>
  );
}
