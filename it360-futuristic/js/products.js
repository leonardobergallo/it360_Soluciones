// Datos de productos (mantén tu estructura actual)
const products = [
  {
    id: 1,
    name: "Sistema de Gestión ERP",
    description: "Sistema completo de gestión empresarial con módulos integrados",
    price: 2500,
    image: "fas fa-chart-line",
    category: "software",
  },
  {
    id: 2,
    name: "Aplicación Móvil Personalizada",
    description: "Desarrollo de app móvil nativa para iOS y Android",
    price: 3500,
    image: "fas fa-mobile-alt",
    category: "desarrollo",
  },
  {
    id: 3,
    name: "Infraestructura Cloud",
    description: "Migración completa a la nube con AWS/Azure",
    price: 4000,
    image: "fas fa-cloud",
    category: "cloud",
  },
  {
    id: 4,
    name: "Auditoría de Seguridad",
    description: "Análisis completo de vulnerabilidades y plan de mejoras",
    price: 1500,
    image: "fas fa-shield-alt",
    category: "seguridad",
  },
  {
    id: 5,
    name: "Sitio Web Corporativo",
    description: "Desarrollo de sitio web responsive con CMS",
    price: 1200,
    image: "fas fa-globe",
    category: "web",
  },
  {
    id: 6,
    name: "Consultoría IT Estratégica",
    description: "Asesoramiento tecnológico para transformación digital",
    price: 800,
    image: "fas fa-lightbulb",
    category: "consultoria",
  },
]

// Función para renderizar productos
function renderProducts() {
  const productsGrid = document.getElementById("products-grid")
  if (!productsGrid) return

  productsGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Función para obtener producto por ID
function getProductById(id) {
  return products.find((product) => product.id === id)
}

// Inicializar productos cuando se carga la página
document.addEventListener("DOMContentLoaded", renderProducts)
