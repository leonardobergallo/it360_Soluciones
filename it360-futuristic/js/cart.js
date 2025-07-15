// Carrito de compras - mantén toda tu lógica actual
let cart = JSON.parse(localStorage.getItem("cart")) || []

// Función para agregar al carrito
function addToCart(productId) {
  const product = getProductById(productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
  }

  updateCart()
  showCartNotification(`${product.name} agregado al carrito`)
}

// Función para remover del carrito
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCart()
}

// Función para actualizar cantidad
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
  } else {
    updateCart()
  }
}

// Función para vaciar carrito
function clearCart() {
  cart = []
  updateCart()
}

// Función para actualizar UI del carrito
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  renderCartItems()
  updateCartTotal()
}

// Actualizar contador del carrito
function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
  cartCount.style.display = totalItems > 0 ? "flex" : "none"
}

// Renderizar items del carrito
function renderCartItems() {
  const cartItems = document.getElementById("cart-items")
  const cartEmpty = document.getElementById("cart-empty")
  const cartFooter = document.getElementById("cart-footer")

  if (cart.length === 0) {
    cartEmpty.style.display = "block"
    cartItems.style.display = "none"
    cartFooter.style.display = "none"
    return
  }

  cartEmpty.style.display = "none"
  cartItems.style.display = "block"
  cartFooter.style.display = "block"

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 0.5rem; color: #ef4444;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Actualizar total del carrito
function updateCartTotal() {
  const cartTotal = document.getElementById("cart-total")
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = total.toLocaleString()
}

// Mostrar/ocultar modal del carrito
function toggleCartModal() {
  const cartModal = document.getElementById("cart-modal")
  cartModal.classList.toggle("active")
}

// Notificación del carrito
function showCartNotification(message) {
  // Crear notificación temporal
  const notification = document.createElement("div")
  notification.className = "cart-notification"
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-gradient);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Botón del carrito
  const cartBtn = document.getElementById("cart-btn")
  cartBtn.addEventListener("click", toggleCartModal)

  // Cerrar modal
  const cartClose = document.getElementById("cart-close")
  const cartOverlay = document.getElementById("cart-overlay")

  cartClose.addEventListener("click", toggleCartModal)
  cartOverlay.addEventListener("click", toggleCartModal)

  // Vaciar carrito
  const clearCartBtn = document.getElementById("clear-cart")
  clearCartBtn.addEventListener("click", clearCart)

  // Checkout
  const checkoutBtn = document.getElementById("checkout")
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("El carrito está vacío")
      return
    }

    // Aquí puedes integrar tu lógica de checkout actual
    alert("Redirigiendo al checkout...")
    // window.location.href = '/checkout';
  })

  // Inicializar carrito
  updateCart()
})

// Animación para notificación
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)

// Función para obtener un producto por ID
function getProductById(productId) {
  // Aquí debes implementar la lógica para obtener el producto por ID
  // Por ejemplo, podrías tener una lista de productos y buscar por ID
  const products = [
    { id: 1, name: "Producto 1", price: 10 },
    { id: 2, name: "Producto 2", price: 20 },
    // Otros productos
  ]
  return products.find((product) => product.id === productId)
}
