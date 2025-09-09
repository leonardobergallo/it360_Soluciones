'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  active: boolean;
}

interface ImageManagerProps {
  productId?: string;
  className?: string;
}

export default function ImageManager({ productId, className = "" }: ImageManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [imageFilter, setImageFilter] = useState('all'); // all, with_image, without_image, incorrect

  useEffect(() => {
    fetchProducts();
    fetchAvailableImages();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableImages = async () => {
    try {
      // En una implementación real, esto vendría de una API
      // Por ahora usamos las imágenes que sabemos que existen
      const images = [
        'xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg',
        'xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg',
        'xiaomi-redmi-pad-se-8-7-6-128-grey.jpg',
        'apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg',
        'apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg',
        'lenovo-auricular-bt-lp3-pro-black.jpg',
        'lenovo-auricular-bt-supraaural-ta330-black.jpg',
        'lenovo-auricular-bt-x3-pro-conduccion-osea-ip56-ne.jpg',
        'lenovo-auricular-gaming-xg02-cancelacion-de-ruido.jpg',
        'jbl-wave-flex-white.png',
        'jbl-wave-flex-black.png',
        'klip-xtreme-auriculares-edgebuds-pro-carga-inalamb.png',
        'klip-xtreme-auricular-zoundbuds-ipx4-azul.jpg',
        'klip-xtreme-auricular-touchbuds-ipx3-verde-agua.jpg',
        'auricular-bluetooth-pop-it-st91-varios-colores.png',
        'monster-auricular-xkt03-cancelacion-de-ruido-baja.png',
        'foxbox-auriculares-boost-link-pro-microfono-contro.jpg',
        'foxbox-auriculares-boost-pop-microfono-3-5mm-negro.jpg',
        'alo-auriculares-sharp-3-5mm-microfono-colores-vari.jpg',
        'p47-auricular-inalambrico-bluetooth-azul.jpg',
        'p47-auricular-inalambrico-bluetooth-blanco.jpg',
        'p47-auricular-inalambrico-bluetooth-rojo.jpg',
        'p47-auricular-inalambrico-bluetooth-verde.jpg',
        'apple-earpods-3-5-mm-a1472.jpg',
        'klip-xtreme-soporte-monitor-17-a-27-pulg-p-escrito.png',
        't-g-parlante-bluetooth-portatil-tg-104-negro.png',
        't-g-parlante-bluetooth-portatil-tg-149-rojo.png',
        'moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png',
        'moulinex-exprimidor-ultra-compact-negro.png',
        'moulinex-molinillo-de-cafe.png',
        'moulinex-vita-tostadora-720w-negra.png',
        'scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg',
        'scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg',
        'scykei-malla-de-silicona-y-cuero-22mm-apta-modelo.jpg',
        'imiki-by-imilab-st1-178-amoled-funcion-llamada-ip6.jpg',
        'imiki-by-imilab-st2-196-tft-funcion-llamada-ip68-a.jpg',
        'imiki-by-imilab-st2-196-tft-funcion-llamada-ip68-r.jpg',
        'imiki-by-imilab-tg1-143-amoled-funcion-llamada-ip6.jpg',
        'imiki-by-imilab-tg2-143-amoled-funcion-llamada-ip6.jpg',
        'foxbox-engage-soporte-imantado-para-celular-en-aut.jpg',
        'foxbox-ride-soporte-para-auto-con-carga-inalambric.jpg',
        'foxbox-soporte-para-auto-sopapa-bracket-rojo-azul.png',
        'foxbox-arrancador-para-vehiculos-3-en-1-powerbank.png',
        'foxbox-energy-charge-6-5k-3-en-1-cargador-power-ba.png',
        'nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg',
        'nexxt-camara-de-seguridad-interior-ptz-2k-2-4-5ghz.jpg',
        'nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg',
        'xtech-escritorio-un-nivel-natural-beige-am100xtk20.png',
        'xtech-silla-minnie-mouse-edition-licencia-disney-o.png',
        'xtech-silla-spider-man-miles-morales-edition-licen.png',
        'nisuta-kit-de-herramientas-60-piezas-ns-k8918.png',
        'sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg',
        'xienan-kit-premium-vino-saca-corcho-tapones-cortad.png',
        'xiaomi-compresor-inflador-portatil-2-black.png',
        'gadnic-hamaca-paraguaya-colgante.jpg',
        'gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1-1.jpg'
      ];
      setAvailableImages(images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const updateProductImage = async (productId: string, newImage: string) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          image: `/images/${newImage}`
        }),
      });

      if (response.ok) {
        // Actualizar el estado local
        setProducts(products.map(p => 
          p.id === productId ? { ...p, image: `/images/${newImage}` } : p
        ));
        
        if (selectedProduct?.id === productId) {
          setSelectedProduct({ ...selectedProduct, image: `/images/${newImage}` });
        }
      }
    } catch (error) {
      console.error('Error updating product image:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    let matchesImageFilter = true;
    if (imageFilter === 'with_image') {
      matchesImageFilter = !!product.image && !product.image.includes('/servicio-') && !product.image.includes('unsplash');
    } else if (imageFilter === 'without_image') {
      matchesImageFilter = !product.image || product.image.includes('/servicio-') || product.image.includes('unsplash');
    } else if (imageFilter === 'incorrect') {
      // Productos que probablemente tienen imagen incorrecta
      matchesImageFilter = product.image && (
        product.image.includes('apple-watch') && !product.name.toLowerCase().includes('watch') ||
        product.image.includes('auricular') && !product.name.toLowerCase().includes('auricular') ||
        product.image.includes('monitor') && !product.name.toLowerCase().includes('monitor')
      );
    }
    
    return matchesSearch && matchesCategory && matchesImageFilter;
  });

  const getImageStatus = (product: Product) => {
    if (!product.image) return { status: 'no-image', color: 'text-red-600', label: 'Sin imagen' };
    if (product.image.includes('/servicio-')) return { status: 'default', color: 'text-yellow-600', label: 'Imagen por defecto' };
    if (product.image.includes('unsplash')) return { status: 'unsplash', color: 'text-blue-600', label: 'Imagen de Unsplash' };
    return { status: 'custom', color: 'text-green-600', label: 'Imagen personalizada' };
  };

  const getSuggestedImages = (productName: string) => {
    const name = productName.toLowerCase();
    return availableImages.filter(image => {
      const imageName = image.toLowerCase();
      
      // Buscar coincidencias por palabras clave
      const keywords = name.split(/[\s\-_]+/).filter(word => word.length > 2);
      return keywords.some(keyword => imageName.includes(keyword));
    }).slice(0, 5); // Máximo 5 sugerencias
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🖼️ Gestión de Imágenes de Productos
        </h3>
        <p className="text-gray-600">
          Asigna y corrige las imágenes de los productos
        </p>
      </div>

      {/* Filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar producto
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del producto..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {Array.from(new Set(products.map(p => p.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado de imagen
            </label>
            <select
              value={imageFilter}
              onChange={(e) => setImageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="with_image">Con imagen personalizada</option>
              <option value="without_image">Sin imagen o por defecto</option>
              <option value="incorrect">Posiblemente incorrectas</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setImageFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="max-h-96 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No se encontraron productos con los filtros aplicados
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const imageStatus = getImageStatus(product);
              const suggestedImages = getSuggestedImages(product.name);
              
              return (
                <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Imagen actual */}
                    <div className="flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = '/icono.png';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                        <span className={`text-xs font-medium ${imageStatus.color}`}>
                          {imageStatus.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Sugerencias de imágenes */}
                    <div className="flex-shrink-0">
                      <div className="flex gap-2">
                        {suggestedImages.slice(0, 3).map((image) => (
                          <button
                            key={image}
                            onClick={() => updateProductImage(product.id, image)}
                            className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors"
                            title={`Asignar: ${image}`}
                          >
                            <img
                              src={`/images/${image}`}
                              alt={image}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/icono.png';
                              }}
                            />
                          </button>
                        ))}
                        {suggestedImages.length === 0 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            Sin sugerencias
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Mostrando {filteredProducts.length} de {products.length} productos
          </div>
          <div className="flex gap-4">
            <span className="text-green-600">
              ✅ {products.filter(p => getImageStatus(p).status === 'custom').length} con imagen personalizada
            </span>
            <span className="text-yellow-600">
              ⚠️ {products.filter(p => getImageStatus(p).status === 'default').length} con imagen por defecto
            </span>
            <span className="text-red-600">
              ❌ {products.filter(p => getImageStatus(p).status === 'no-image').length} sin imagen
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
