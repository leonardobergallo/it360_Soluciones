"use client";
import { useEffect, useState, useRef } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch contacts
  useEffect(() => {
    fetch("/api/contact")
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      });
  }, []);

  // Eliminar mensaje
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
    setContacts(contacts.filter(c => c.id !== id));
  };

  // Marcar como leído (solo visual, ya que el modelo no tiene campo 'read')
  const handleMarkRead = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, read: true } : c));
  };

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Gestión de Contactos</h1>
        <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12l6-6M3 12l6 6" />
          </svg>
          Ir al inicio
        </a>
      </div>
      <h1 className="text-3xl font-extrabold mb-8 text-blue-800">Mensajes de Contacto</h1>
      {/* Formulario de presupuesto de servicios (versión mejorada y más compacta) */}
      <div className="bg-white rounded-xl shadow p-8 mb-10 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Solicitar Presupuesto</h2>
        <form ref={formRef} onSubmit={handlePresupuesto} className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="nombre" type="text" placeholder="Nombre" className="border rounded px-4 py-2" required />
            <input name="email" type="email" placeholder="Email" className="border rounded px-4 py-2" required />
            <input name="telefono" type="tel" placeholder="Teléfono" className="border rounded px-4 py-2" required />
            <input name="empresa" type="text" placeholder="Empresa (opcional)" className="border rounded px-4 py-2" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select name="servicio" className="border rounded px-4 py-2" required>
              <option value="">Tipo de servicio</option>
              <option value="Desarrollo de Software">Desarrollo de Software</option>
              <option value="Ciberseguridad">Ciberseguridad</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Infraestructura">Infraestructura</option>
              <option value="Consultoría">Consultoría</option>
            </select>
            <input name="presupuesto" type="number" min="0" step="1000" placeholder="Presupuesto estimado (opcional)" className="border rounded px-4 py-2" />
          </div>
          <textarea name="mensaje" placeholder="Describe brevemente tu necesidad o proyecto..." className="border rounded px-4 py-2" rows={3} required />
          <button type="submit" className="bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition disabled:opacity-60" disabled={sending}>{sending ? "Enviando..." : "Solicitar presupuesto"}</button>
          {success && <div className="text-green-600 font-semibold">¡Presupuesto enviado correctamente!</div>}
        </form>
      </div>
      {/* Tabla de mensajes */}
      {loading ? (
        <div className="text-blue-700 font-semibold">Cargando...</div>
      ) : contacts.length === 0 ? (
        <div className="text-gray-500">No hay mensajes.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="px-4 py-2 font-semibold">Nombre</th>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Mensaje</th>
                <th className="px-4 py-2 font-semibold">Fecha</th>
                <th className="px-4 py-2 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className={c.read ? "bg-gray-100" : "hover:bg-blue-50 transition"}>
                  <td className="border px-4 py-2 text-blue-900 font-medium">{c.name}</td>
                  <td className="border px-4 py-2 text-blue-700">{c.email}</td>
                  <td className="border px-4 py-2 max-w-xs truncate text-gray-700" title={c.message}>{c.message}</td>
                  <td className="border px-4 py-2 text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button onClick={() => handleMarkRead(c.id)} className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Marcar leído</button>
                    <button onClick={() => handleDelete(c.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 