"use client";
import { useState } from "react";
import Link from "next/link";

export default function CentroAyudaPage() {
  const [formData, setFormData] = useState({
    asunto: "",
    tipo: "consulta",
    mensaje: "",
    urgencia: "normal"
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess(false);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Necesitas iniciar sesión para enviar consultas");
      setSending(false);
      return;
    }

    try {
      const response = await fetch('/api/contacto-hogar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          servicio: 'Centro de Ayuda',
          empresa: 'Consulta de usuario'
        })
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          asunto: "",
          tipo: "consulta",
          mensaje: "",
          urgencia: "normal"
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await response.json();
        setError(data.error || "Error al enviar la consulta");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-cuenta" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Volver a Mi cuenta
          </Link>
          <h1 className="text-3xl font-bold">Centro de ayuda</h1>
        </div>

        {/* Mensajes */}
        {success && (
          <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-300">✅ Consulta enviada correctamente. Te responderemos pronto.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-300">❌ {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Información de contacto</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-400">📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="text-white">it360tecnologia@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400">📱</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">WhatsApp</p>
                    <p className="text-white">+54 9 342 508 9906</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400">🕒</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Horarios</p>
                    <p className="text-white">Lun-Vie: 9:00-18:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">¿Necesitas ayuda urgente?</h4>
                <p className="text-sm text-white/80 mb-3">
                  Para consultas urgentes, contactanos directamente por WhatsApp o email.
                </p>
                <a 
                  href="https://wa.me/5493425089906" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <span>💬</span> Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Formulario de consulta */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-6">Enviar consulta</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Tipo de consulta *
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="consulta">Consulta general</option>
                      <option value="soporte">Soporte técnico</option>
                      <option value="facturacion">Facturación</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Nivel de urgencia
                    </label>
                    <select
                      name="urgencia"
                      value={formData.urgencia}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="baja">Baja</option>
                      <option value="normal">Normal</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Resumen de tu consulta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                    placeholder="Describe tu consulta en detalle..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? "Enviando..." : "Enviar consulta"}
                  </button>
                  
                  <Link
                    href="/mi-cuenta"
                    className="flex-1 bg-white/10 border border-white/20 text-white py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-300 text-center"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
