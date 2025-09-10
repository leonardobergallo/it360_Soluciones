"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ContactVendorModal from "../../components/ContactVendorModal";
import ProductInquiryModal from "../../components/ProductInquiryModal";

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
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false); // Estado para el modal de consulta
  
  // Normaliza rutas de imagen para servir desde /public
  const normalizeImagePath = (image?: string) => {
    if (!image) return image as any;
    const replaced = image.replace(/\\/g, '/');
    const publicIdx = replaced.indexOf('/public/');
    if (publicIdx >= 0) {
      return replaced.slice(publicIdx + '/public'.length);
    }
    if (replaced.startsWith('http://') || replaced.startsWith('https://')) return replaced;
    if (replaced.startsWith('/images/')) return replaced;
    if (replaced.startsWith('/')) return replaced;
    return `/images/${replaced}`;
  };

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
  const [sortBy, setSortBy] = useState("nombre"); // nombre, precio, popularidad
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;
  
  // Categorías disponibles (actualizadas según la base de datos)
  const categories = [
    { id: "todas", name: "Todas las categorías", icon: "🏷️" },
    { id: "Accesorios", name: "Accesorios", icon: "🏷️" },
    { id: "Accesorios y Gadgets Geeks", name: "Accesorios y Gadgets Geeks", icon: "🏷️" },
    { id: "Adaptadores", name: "Adaptadores", icon: "🏷️" },
    { id: "Auriculares Intrauditivos Bluetooth/Inalambricos", name: "Auriculares Intrauditivos Bluetooth/Inalambricos", icon: "🏷️" },
    { id: "Auriculares Intrauditivos c/cable", name: "Auriculares Intrauditivos c/cable", icon: "🏷️" },
    { id: "Auriculares Vincha Bluetooth/Inalambricos", name: "Auriculares Vincha Bluetooth/Inalambricos", icon: "🏷️" },
    { id: "Auriculares Vincha c/cable", name: "Auriculares Vincha c/cable", icon: "🏷️" },
    { id: "Bazar y Hogar", name: "Bazar y Hogar", icon: "🏷️" },
    { id: "Cables Audio", name: "Cables Audio", icon: "🏷️" },
    { id: "Cables Moviles (MiniUSB/MicroUSB/Lightning/Type-c)", name: "Cables Moviles (MiniUSB/MicroUSB/Lightning/Type-c)", icon: "🏷️" },
    { id: "Cables PC Power-Sata-Ps/2-Serie-Firewire-Paralelo", name: "Cables PC Power-Sata-Ps/2-Serie-Firewire-Paralelo", icon: "🏷️" },
    { id: "Cables USB", name: "Cables USB", icon: "🏷️" },
    { id: "Cables Video (Hdmi-Vga-Dvi-DisplayPort)", name: "Cables Video (Hdmi-Vga-Dvi-DisplayPort)", icon: "🏷️" },
    { id: "Camara De Fotos", name: "Camara De Fotos", icon: "🏷️" },
    { id: "Camara De Fotos Accesorios", name: "Camara De Fotos Accesorios", icon: "🏷️" },
    { id: "Camaras Web", name: "Camaras Web", icon: "🏷️" },
    { id: "Cargadores y Fuentes", name: "Cargadores y Fuentes", icon: "🏷️" },
    { id: "Carry Disk", name: "Carry Disk", icon: "🏷️" },
    { id: "Cartuchos Alternativos Epson", name: "Cartuchos Alternativos Epson", icon: "🏷️" },
    { id: "Cartuchos Alternativos Hp", name: "Cartuchos Alternativos Hp", icon: "🏷️" },
    { id: "Cartuchos Originales", name: "Cartuchos Originales", icon: "🏷️" },
    { id: "Cintas Alternativas", name: "Cintas Alternativas", icon: "🏷️" },
    { id: "Conectividad Accesorios", name: "Conectividad Accesorios", icon: "🏷️" },
    { id: "Conectividad Cables", name: "Conectividad Cables", icon: "🏷️" },
    { id: "Conectividad Herramientas", name: "Conectividad Herramientas", icon: "🏷️" },
    { id: "Conectividad Ir Y Bluetooth", name: "Conectividad Ir Y Bluetooth", icon: "🏷️" },
    { id: "Conectividad Placas De Red", name: "Conectividad Placas De Red", icon: "🏷️" },
    { id: "Conectividad Print Server-Kvm-Data Switch-Splitter", name: "Conectividad Print Server-Kvm-Data Switch-Splitter", icon: "🏷️" },
    { id: "Conectividad Routers", name: "Conectividad Routers", icon: "🏷️" },
    { id: "Conectividad Switchs", name: "Conectividad Switchs", icon: "🏷️" },
    { id: "Consolas De Juego", name: "Consolas De Juego", icon: "🏷️" },
    { id: "Disco Rigido Sata 2 / Sata 3", name: "Disco Rigido Sata 2 / Sata 3", icon: "🏷️" },
    { id: "Disco SSD M.2 / PCIe NVMe", name: "Disco SSD M.2 / PCIe NVMe", icon: "🏷️" },
    { id: "Disco SSD Sata 3.0", name: "Disco SSD Sata 3.0", icon: "🏷️" },
    { id: "Drone", name: "Drone", icon: "🏷️" },
    { id: "Editoras / Sintonizadoras y adaptadores p/TV", name: "Editoras / Sintonizadoras y adaptadores p/TV", icon: "🏷️" },
    { id: "Electrodomesticos", name: "Electrodomesticos", icon: "🏷️" },
    { id: "Fuentes De Alimentacion", name: "Fuentes De Alimentacion", icon: "🏷️" },
    { id: "Gabinetes", name: "Gabinetes", icon: "🏷️" },
    { id: "Herramientas", name: "Herramientas", icon: "🏷️" },
    { id: "Iluminacion", name: "Iluminacion", icon: "🏷️" },
    { id: "Impresora De Fotos", name: "Impresora De Fotos", icon: "🏷️" },
    { id: "Impresora Laser", name: "Impresora Laser", icon: "🏷️" },
    { id: "Impresora Multifuncion Inyec Tinta", name: "Impresora Multifuncion Inyec Tinta", icon: "🏷️" },
    { id: "Impresora Multifuncion Laser", name: "Impresora Multifuncion Laser", icon: "🏷️" },
    { id: "Joystick", name: "Joystick", icon: "🏷️" },
    { id: "Jugueteria", name: "Jugueteria", icon: "🏷️" },
    { id: "Limpieza y Mantenimiento", name: "Limpieza y Mantenimiento", icon: "🏷️" },
    { id: "Manejo De Dinero", name: "Manejo De Dinero", icon: "🏷️" },
    { id: "Memorias DDR", name: "Memorias DDR", icon: "🏷️" },
    { id: "Memorias Flash", name: "Memorias Flash", icon: "🏷️" },
    { id: "Memorias Para Notebook", name: "Memorias Para Notebook", icon: "🏷️" },
    { id: "Micro Socket 1200", name: "Micro Socket 1200", icon: "🏷️" },
    { id: "Micro Socket 1700", name: "Micro Socket 1700", icon: "🏷️" },
    { id: "Micro Socket AM4", name: "Micro Socket AM4", icon: "🏷️" },
    { id: "Micro Socket AM5", name: "Micro Socket AM5", icon: "🏷️" },
    { id: "Microfonos Bluetooth/Inalambricos", name: "Microfonos Bluetooth/Inalambricos", icon: "🏷️" },
    { id: "Microfonos C/Cable", name: "Microfonos C/Cable", icon: "🏷️" },
    { id: "Monitor Lcd / Led", name: "Monitor Lcd / Led", icon: "🏷️" },
    { id: "Mother Socket 1200", name: "Mother Socket 1200", icon: "🏷️" },
    { id: "Mother Socket 1700", name: "Mother Socket 1700", icon: "🏷️" },
    { id: "Mother Socket AM4", name: "Mother Socket AM4", icon: "🏷️" },
    { id: "Mother Socket AM5", name: "Mother Socket AM5", icon: "🏷️" },
    { id: "Mouses Bluetooth/Inalambricos", name: "Mouses Bluetooth/Inalambricos", icon: "🏷️" },
    { id: "Mouses C/Cable", name: "Mouses C/Cable", icon: "🏷️" },
    { id: "Muebles Cocina", name: "Muebles Cocina", icon: "🏷️" },
    { id: "Muebles Sillas", name: "Muebles Sillas", icon: "🏷️" },
    { id: "Notebooks - Cargadores y Baterias", name: "Notebooks - Cargadores y Baterias", icon: "🏷️" },
    { id: "Notebooks y Netbooks", name: "Notebooks y Netbooks", icon: "🏷️" },
    { id: "Notebooks/Tablets - Accesorios", name: "Notebooks/Tablets - Accesorios", icon: "🏷️" },
    { id: "Notebooks/Tablets - Maletines / Mochilas / Fundas", name: "Notebooks/Tablets - Maletines / Mochilas / Fundas", icon: "🏷️" },
    { id: "Pad Para Mouse", name: "Pad Para Mouse", icon: "🏷️" },
    { id: "Papeleria", name: "Papeleria", icon: "🏷️" },
    { id: "Parlantes PC y Sistemas de Audio", name: "Parlantes PC y Sistemas de Audio", icon: "🏷️" },
    { id: "Parlantes Portables Moviles/Columnas/Monovolumen", name: "Parlantes Portables Moviles/Columnas/Monovolumen", icon: "🏷️" },
    { id: "PCs Armadas / AIOs", name: "PCs Armadas / AIOs", icon: "🏷️" },
    { id: "Pen Drive", name: "Pen Drive", icon: "🏷️" },
    { id: "Pilas y Cargadores de Pilas", name: "Pilas y Cargadores de Pilas", icon: "🏷️" },
    { id: "Placa De Sonido", name: "Placa De Sonido", icon: "🏷️" },
    { id: "Placa De Video Y Aceleradora", name: "Placa De Video Y Aceleradora", icon: "🏷️" },
    { id: "Placas / Puertos / Controladoras / Hub usb", name: "Placas / Puertos / Controladoras / Hub usb", icon: "🏷️" },
    { id: "Proyectores", name: "Proyectores", icon: "🏷️" },
    { id: "Reproductor De Mp3 Mp4 Mp5", name: "Reproductor De Mp3 Mp4 Mp5", icon: "🏷️" },
    { id: "Seguridad Alarmas", name: "Seguridad Alarmas", icon: "🏷️" },
    { id: "Seguridad Controles de Acceso", name: "Seguridad Controles de Acceso", icon: "🏷️" },
    { id: "Seguridad Porteros/Intercom", name: "Seguridad Porteros/Intercom", icon: "🏷️" },
    { id: "Seguridad Video Accesorios", name: "Seguridad Video Accesorios", icon: "🏷️" },
    { id: "Seguridad Video IP Camaras y Nvr", name: "Seguridad Video IP Camaras y Nvr", icon: "🏷️" },
    { id: "Smartwatch y Smartband", name: "Smartwatch y Smartband", icon: "🏷️" },
    { id: "Soportes Smartphone/Tablet/Gps", name: "Soportes Smartphone/Tablet/Gps", icon: "🏷️" },
    { id: "Soportes TV/LCD/LED/Proyector", name: "Soportes TV/LCD/LED/Proyector", icon: "🏷️" },
    { id: "Tableta Digitalizadora", name: "Tableta Digitalizadora", icon: "🏷️" },
    { id: "Tablets / e-Readers", name: "Tablets / e-Readers", icon: "🏷️" },
    { id: "Teclado y Mouse Kit Bluetooth/Inalambricos", name: "Teclado y Mouse Kit Bluetooth/Inalambricos", icon: "🏷️" },
    { id: "Teclado y Mouse Kit C/Cable", name: "Teclado y Mouse Kit C/Cable", icon: "🏷️" },
    { id: "Teclados Bluetooth/Inalambricos", name: "Teclados Bluetooth/Inalambricos", icon: "🏷️" },
    { id: "Teclados C/Cable", name: "Teclados C/Cable", icon: "🏷️" },
    { id: "Teclados P/ SmartTV/Multidispositivo", name: "Teclados P/ SmartTV/Multidispositivo", icon: "🏷️" },
    { id: "Tinta Alternativa Para Recarga", name: "Tinta Alternativa Para Recarga", icon: "🏷️" },
    { id: "Tintas Originales Para Recarga", name: "Tintas Originales Para Recarga", icon: "🏷️" },
    { id: "Toner Alternativo", name: "Toner Alternativo", icon: "🏷️" },
    { id: "Ups Y Estabilizadores", name: "Ups Y Estabilizadores", icon: "🏷️" },
    { id: "Ventiladores", name: "Ventiladores", icon: "🏷️" }
  ];

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
    fetch("/api/products/catalog")
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map((p: { id: string; name: string; description: string; price: number; image?: string; category?: string }, i: number) => {
            // Manejar diferentes tipos de imagen
            let mainImage, productIcon;
            
            if (p.image && p.image.startsWith('ICON:')) {
              // Producto con icono por categoría
              mainImage = 'USE_ICON';
              productIcon = p.image.replace('ICON:', '');
            } else if (p.image === 'USE_NAME') {
              // Producto que usa nombre (legacy)
              mainImage = 'USE_NAME';
              productIcon = getProductIcon(p.name);
            } else {
              // Producto con imagen real
              const normalized = normalizeImagePath(p.image);
              mainImage = normalized || productImages[i % productImages.length];
              productIcon = getProductIcon(p.name);
            }
            
            return { 
              ...p, 
              type: "product", 
              image: mainImage,
              imagenes: mainImage === 'USE_ICON' || mainImage === 'USE_NAME' ? [mainImage] : generateProductImages(p.name, mainImage),
              icon: productIcon
            };
          }));
          console.log(`✅ Cargados ${data.length} productos del catálogo`);
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

  // Función para filtrar y ordenar productos
  const getFilteredProducts = () => {
    const filtered = products.filter(product => {
      // Filtro por búsqueda
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por categoría
      const matchesCategory = selectedCategory === "todas" || 
                             (product as { category?: string }).category === selectedCategory;
      
      // Filtro por precio
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    
    // Ordenamiento
    switch (sortBy) {
      case "precio":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "nombre":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  // Resetear a página 1 cuando cambian los filtros o el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange.min, priceRange.max, sortBy, products.length]);

  const paginatedProducts = () => {
    const all = getFilteredProducts();
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return all.slice(start, end);
  };

  const totalPages = () => {
    const total = getFilteredProducts().length;
    return Math.max(1, Math.ceil(total / pageSize));
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
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <h2 className="relative text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
                🛍️ Catálogo Digital
              </h2>
            </div>
            <p className="text-white/80 max-w-3xl mx-auto text-xl leading-relaxed mb-8">
              Explora nuestra <span className="text-cyan-400 font-semibold">colección premium</span> de productos tecnológicos
            </p>
            
            {/* Estadísticas del catálogo */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full px-6 py-3 backdrop-blur-md">
                <span className="text-cyan-300 font-bold text-lg">{products.length}</span>
                <span className="text-white/70 ml-2">Productos</span>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full px-6 py-3 backdrop-blur-md">
                <span className="text-purple-300 font-bold text-lg">{categories.length - 1}</span>
                <span className="text-white/70 ml-2">Categorías</span>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-full px-6 py-3 backdrop-blur-md">
                <span className="text-green-300 font-bold text-lg">100%</span>
                <span className="text-white/70 ml-2">Garantía</span>
              </div>
            </div>
          </div>

          {/* Consulta rápida */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">¿No encuentras lo que buscas?</h3>
                <p className="text-white/80 mb-4">Nuestro equipo está listo para ayudarte a encontrar la solución perfecta</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setContactModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">💬</span>
                    Consulta Personalizada
                  </button>
                  <a 
                    href="https://wa.me/5493425089906"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">📱</span>
                    WhatsApp Directo
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Buscador */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar en el catálogo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filtro por categoría */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por precio */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-1/2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-3 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-1/2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-3 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>

              {/* Ordenamiento */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="nombre" className="bg-gray-800 text-white">Ordenar por nombre</option>
                  <option value="precio" className="bg-gray-800 text-white">Precio: menor a mayor</option>
                  <option value="precio-desc" className="bg-gray-800 text-white">Precio: mayor a menor</option>
                </select>
              </div>
            </div>

            {/* Resultados de búsqueda mejorados */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full px-6 py-3 backdrop-blur-md">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <p className="text-cyan-300 font-medium">
                  Mostrando <span className="text-white font-bold">{getFilteredProducts().length}</span> de <span className="text-white font-bold">{products.length}</span> productos
                </p>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedProducts().map((p, index) => (
              <div 
                key={p.id} 
                className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden cursor-pointer relative backdrop-blur-md"
                onClick={() => handleProductSelect(p)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/15 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Imagen del producto o nombre */}
                <div className="relative h-40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center p-6 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5"></div>
                  {p.image === 'USE_ICON' || p.image === 'USE_NAME' ? (
                    // Mostrar icono por categoría + nombre del producto
                    <div className="relative text-center z-10">
                      <div className="text-4xl mb-2">{p.icon}</div>
                      <div className="text-white/90 font-semibold text-sm leading-tight px-2">
                        {p.name.length > 50 ? p.name.substring(0, 50) + '...' : p.name}
                      </div>
                    </div>
                  ) : (
                    // Mostrar imagen normal
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="relative w-20 h-20 object-contain group-hover:scale-125 transition-transform duration-700 z-10" 
                    />
                  )}
                  {/* Efecto de partículas */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Contenido del producto */}
                <div className="relative p-6">
                  {/* Categoría */}
                  <div className="mb-3">
                    <span className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-xs px-2 py-1 rounded-full font-medium">
                      {(p as any).category || 'Producto'}
                    </span>
                  </div>
                  
                  {/* Nombre del producto */}
                  <h3 className="font-bold text-base mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2 leading-tight">
                    {p.name}
                  </h3>
                  
                  {/* Descripción */}
                  <p className="text-white/60 mb-4 text-sm leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                  
                  {/* Precio y stock */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ${p.price.toLocaleString()}
                      </span>
                      <span className="text-white/50 text-xs">Precio final</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                        En Stock
                      </span>
                      <span className="text-white/50 text-xs mt-1">Disponible</span>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="space-y-2">
                    <button 
                      onClick={e => { e.stopPropagation(); addToCart(p); }} 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-4 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn"
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full group-hover/btn:animate-pulse"></div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      Agregar al Carrito
                    </button>
                    
                    <button 
                      onClick={e => { 
                        e.stopPropagation(); 
                        setSelectedProduct(p);
                        setContactModalOpen(true);
                      }} 
                      className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl text-white py-2 px-4 rounded-xl font-semibold border border-purple-400/50 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover/btn:animate-pulse"></div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Consultar
                    </button>
                  </div>
                </div>
                
                {/* Efecto de borde brillante */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 border backdrop-blur-md ${
                currentPage === 1
                  ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30'
              }`}
            >
              ← Anterior
            </button>
            <span className="text-white/80">
              Página <span className="font-bold text-white">{currentPage}</span> de <span className="font-bold text-white">{totalPages()}</span>
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages(), p + 1))}
              disabled={currentPage >= totalPages()}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 border backdrop-blur-md ${
                currentPage >= totalPages()
                  ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30'
              }`}
            >
              Siguiente →
            </button>
          </div>

          {/* Botón de consulta de productos */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl p-8 backdrop-blur-md">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Si no ves el producto que necesitas en nuestro catálogo, ¡no te preocupes! 
                Podemos conseguirlo para ti. Déjanos saber qué estás buscando y te contactaremos 
                con la mejor opción disponible.
              </p>
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Consultar Producto
              </button>
            </div>
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
                      Presupuesto
                    </span>
                    <span className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Servicio
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => window.location.href = '/contacto'} 
                      className="w-full backdrop-blur-md bg-gradient-to-r from-purple-500 to-pink-600 text-white py-1.5 px-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1.5 group/btn text-xs"
                    >
                      <div className="w-1 h-1 bg-white rounded-full group-hover/btn:animate-pulse"></div>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" />
                      </svg>
                      Cotizar
                    </button>
                    
                    <button 
                      onClick={() => {
                        setSelectedProduct({
                          ...s,
                          type: 'service' as const
                        });
                        setContactModalOpen(true);
                      }} 
                      className="w-full backdrop-blur-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 py-1.5 px-3 rounded-lg font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1.5 group/btn text-xs"
                    >
                      <div className="w-1 h-1 bg-cyan-400 rounded-full group-hover/btn:animate-pulse"></div>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Consultar
                    </button>
                  </div>
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

              {/* Galería de imágenes o nombre */}
              <div className="mb-3">
                <div className="relative h-32 sm:h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {selectedProduct.image === 'USE_ICON' || selectedProduct.image === 'USE_NAME' ? (
                    // Mostrar icono por categoría + nombre del producto
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
                      <div className="text-6xl mb-3">{selectedProduct.icon}</div>
                      <div className="text-gray-800 font-bold text-center px-4">
                        {selectedProduct.name}
                      </div>
                    </div>
                  ) : (
                    // Mostrar imagen normal
                    <img 
                      src={selectedProduct.imagenes?.[currentImageIndex] || selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Navegación de imágenes - solo si no es USE_ICON o USE_NAME */}
                  {selectedProduct.image !== 'USE_ICON' && selectedProduct.image !== 'USE_NAME' && selectedProduct.imagenes && selectedProduct.imagenes.length > 1 && (
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
                {/* Miniaturas - solo si no es USE_ICON o USE_NAME */}
                {selectedProduct.image !== 'USE_ICON' && selectedProduct.image !== 'USE_NAME' && selectedProduct.imagenes && selectedProduct.imagenes.length > 1 && (
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
                      <button 
                        onClick={() => {
                          setContactModalOpen(true);
                          setSelectedProduct(null);
                        }}
                        className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl text-purple-600 py-2 px-3 rounded-lg font-semibold border border-purple-400/50 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 text-xs sm:text-sm"
                      >
                        Consulta Rápida
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

      {/* Modal de consulta de productos */}
      <ProductInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        searchTerm={searchTerm}
      />
    </div>
  );
} 
