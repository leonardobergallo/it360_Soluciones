"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MisDatosPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Formulario de datos
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: ""
  });

  useEffect(() => {
    // Cargar datos del usuario
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setFormData({
            nombre: data.user.name || "",
            email: data.user.email || "",
            telefono: data.user.phone || "",
            empresa: data.user.company || "",
            direccion: data.user.address || "",
            ciudad: data.user.city || "",
            provincia: data.user.province || "",
            codigoPostal: data.user.postalCode || ""
          });
        }
      })
      .catch(err => {
        console.error('Error cargando datos:', err);
        setError("Error al cargar los datos del usuario");
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("No estás logueado");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("No estás logueado");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Error al actualizar datos");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.includes("No estás logueado")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Acceso denegado</h1>
          <p className="text-xl mb-8">Necesitas iniciar sesión para ver tus datos</p>
          <Link href="/login" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-cuenta" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Volver a Mi cuenta
          </Link>
          <h1 className="text-3xl font-bold">Mis datos personales</h1>
        </div>

        {/* Mensajes */}
        {success && (
          <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-300">✅ Datos actualizados correctamente</p>
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-300">❌ {error}</p>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Información básica</h3>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Dirección</h3>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Calle y número"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Ciudad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Provincia
                  </label>
                  <input
                    type="text"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Provincia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Código postal"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
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
  );
} 