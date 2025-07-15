"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Server,
  Cloud,
  Lock,
  Code,
  Database,
  Wifi,
  Monitor,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

export default function IT360Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                IT360
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-white/80 hover:text-cyan-400 transition-colors">
                Inicio
              </a>
              <a href="#servicios" className="text-white/80 hover:text-cyan-400 transition-colors">
                Servicios
              </a>
              <a href="#nosotros" className="text-white/80 hover:text-cyan-400 transition-colors">
                Nosotros
              </a>
              <a href="#contacto" className="text-white/80 hover:text-cyan-400 transition-colors">
                Contacto
              </a>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                Cotizar
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#inicio" className="text-white/80 hover:text-cyan-400 transition-colors">
                  Inicio
                </a>
                <a href="#servicios" className="text-white/80 hover:text-cyan-400 transition-colors">
                  Servicios
                </a>
                <a href="#nosotros" className="text-white/80 hover:text-cyan-400 transition-colors">
                  Nosotros
                </a>
                <a href="#contacto" className="text-white/80 hover:text-cyan-400 transition-colors">
                  Contacto
                </a>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 w-full">
                  Cotizar
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - PERSONALIZABLE */}
      <section id="inicio" className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">
            {/* CAMBIAR: Tu badge actual */}🚀 Soluciones Tecnológicas
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            {/* CAMBIAR: Tu título principal */}
            IT360
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Argentina</span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            {/* CAMBIAR: Tu descripción actual */}
            Empresa líder en soluciones informáticas integrales. Brindamos servicios de IT, desarrollo, soporte técnico
            y consultoría tecnológica para empresas en toda Argentina.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-3"
            >
              {/* CAMBIAR: Tu CTA principal */}
              Solicitar Cotización
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
            >
              {/* CAMBIAR: Tu CTA secundario */}
              Nuestros Servicios
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section - PERSONALIZABLE */}
      <section id="servicios" className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              {/* CAMBIAR: Título de servicios */}
              Nuestros Servicios
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {/* CAMBIAR: Descripción de servicios */}
              Ofrecemos soluciones tecnológicas completas adaptadas a las necesidades de tu empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PERSONALIZAR: Reemplaza estos servicios con los tuyos */}
            {[
              {
                icon: Monitor,
                title: "Soporte Técnico",
                description: "Mantenimiento y soporte de equipos informáticos",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Server,
                title: "Redes y Servidores",
                description: "Instalación y configuración de infraestructura IT",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Shield,
                title: "Seguridad Informática",
                description: "Protección de datos y sistemas empresariales",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: Code,
                title: "Desarrollo Web",
                description: "Sitios web y aplicaciones personalizadas",
                color: "from-red-500 to-orange-500",
              },
              {
                icon: Cloud,
                title: "Cloud Computing",
                description: "Migración y gestión de servicios en la nube",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Database,
                title: "Consultoría IT",
                description: "Asesoramiento tecnológico estratégico",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/60">{service.description}</CardDescription>
                  <div className="mt-4 flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">Más información</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - PERSONALIZABLE */}
      <section id="nosotros" className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                {/* CAMBIAR: Badge sobre la empresa */}
                Sobre IT360
              </Badge>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {/* CAMBIAR: Título sobre la empresa */}
                Experiencia y Confianza en Tecnología
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                {/* CAMBIAR: Descripción de la empresa */}
                Somos una empresa argentina especializada en brindar soluciones informáticas integrales. Con años de
                experiencia en el mercado, nos destacamos por nuestro compromiso con la excelencia y la satisfacción del
                cliente.
              </p>

              {/* PERSONALIZAR: Estadísticas de tu empresa */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">10+</div>
                  <div className="text-white/60">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">200+</div>
                  <div className="text-white/60">Clientes Satisfechos</div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0">
                {/* CAMBIAR: CTA sobre la empresa */}
                Conocer Más
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8">
                  {[Monitor, Wifi, Lock, Zap, Globe, Database].map((Icon, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                      <Icon className="w-8 h-8 text-cyan-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - PERSONALIZABLE */}
      <section id="contacto" className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Contacto
            </h2>
            <p className="text-white/60 text-lg">
              {/* CAMBIAR: Mensaje de contacto */}
              Estamos aquí para ayudarte con tus necesidades tecnológicas
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* PERSONALIZAR: Tu información de contacto real */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {/* CAMBIAR: Tu email real */}
                <p className="text-cyan-400">contacto@it360.com.ar</p>
                <p className="text-cyan-400">info@it360.com.ar</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Teléfono</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {/* CAMBIAR: Tu teléfono real */}
                <p className="text-purple-400">+54 11 XXXX-XXXX</p>
                <p className="text-white/60">Lun - Vie: 9:00 - 18:00</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Ubicación</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {/* CAMBIAR: Tu ubicación real */}
                <p className="text-green-400">Buenos Aires, Argentina</p>
                <p className="text-white/60">Tu dirección aquí</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-12 py-4"
            >
              {/* CAMBIAR: Tu CTA de contacto */}
              Solicitar Presupuesto
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - PERSONALIZABLE */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-md bg-white/5 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  IT360
                </span>
              </div>
              <p className="text-white/60 text-sm">
                {/* CAMBIAR: Descripción corta de tu empresa */}
                Soluciones informáticas integrales para empresas argentinas.
              </p>
            </div>

            {/* PERSONALIZAR: Enlaces del footer */}
            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Soporte Técnico
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Redes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Desarrollo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Consultoría
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Clientes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Trabajos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                {/* CAMBIAR: Tu información real */}
                <li>Buenos Aires, Argentina</li>
                <li>+54 11 XXXX-XXXX</li>
                <li>contacto@it360.com.ar</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2024 IT360. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
