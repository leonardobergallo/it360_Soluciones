// Navegación móvil
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")

      // Animar hamburger
      const bars = navToggle.querySelectorAll(".bar")
      bars.forEach((bar, index) => {
        if (navMenu.classList.contains("active")) {
          if (index === 0) bar.style.transform = "rotate(45deg) translate(5px, 5px)"
          if (index === 1) bar.style.opacity = "0"
          if (index === 2) bar.style.transform = "rotate(-45deg) translate(7px, -6px)"
        } else {
          bar.style.transform = "none"
          bar.style.opacity = "1"
        }
      })
    })
  }

  // Cerrar menú al hacer click en un enlace
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      const bars = navToggle.querySelectorAll(".bar")
      bars.forEach((bar) => {
        bar.style.transform = "none"
        bar.style.opacity = "1"
      })
    })
  })

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Header scroll effect
  const header = document.querySelector(".header")
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.style.background = "rgba(15, 23, 42, 0.95)"
    } else {
      header.style.background = "rgba(255, 255, 255, 0.05)"
    }

    // Hide/show header on scroll
    // Ajusta el valor de 60px (altura del header) si es diferente
    if (window.scrollY > lastScrollY && window.scrollY > 60) {
      header.style.transform = "translateY(-100%)"
    } else {
      header.style.transform = "translateY(0)"
    }
    lastScrollY = window.scrollY
  })

  // Intersection Observer para animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observar elementos para animación
  const animatedElements = document.querySelectorAll(".service-card, .product-card, .contact-card")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Efecto parallax sutil en hero
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero")
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })
})

// Función para manejar formularios (mantén tu lógica actual)
function handleContactForm(event) {
  event.preventDefault()
  // Aquí va tu lógica actual de formularios
  console.log("Formulario enviado")
}

// Función para cotizaciones (mantén tu lógica actual)
function requestQuote() {
  // Aquí va tu lógica actual de cotizaciones
  console.log("Solicitud de cotización")
}

// Mantén todas tus funciones existentes aquí...
