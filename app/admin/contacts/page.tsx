"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export default function ContactsAdminPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // Protección para técnicos
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'TECNICO') {
          localStorage.setItem('toastMsg', 'Acceso denegado: solo puedes ver presupuestos.');
          router.push('/admin/presupuestos');
        }
      } catch {}
    }
  }, [router]);

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
    <AdminLayout>
      <div className="p-6">
        {/* Header con título y botones */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Contactos</h1>
            <p className="text-gray-600">Administrá los mensajes de contacto del sistema</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ← Ir al dashboard
            </Link>
          </div>
        </div>

        {/* Formulario de presupuesto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Solicitar Presupuesto</h2>
          <form ref={formRef} onSubmit={handlePresupuesto} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input name="nombre" type="text" placeholder="Nombre" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              <input name="email" type="email" placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              <input name="telefono" type="tel" placeholder="Teléfono" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              <input name="empresa" type="text" placeholder="Empresa (opcional)" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select name="servicio" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                <option value="">Tipo de servicio</option>
                <option value="Desarrollo de Software">Desarrollo de Software</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="Soporte Técnico">Soporte Técnico</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Consultoría">Consultoría</option>
              </select>
              <input name="presupuesto" type="number" min="0" step="1000" placeholder="Presupuesto estimado (opcional)" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <textarea name="mensaje" placeholder="Describe brevemente tu necesidad o proyecto..." className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" rows={3} required />
            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={sending}>
              {sending ? "Enviando..." : "Solicitar presupuesto"}
            </button>
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">¡Presupuesto enviado correctamente!</p>
              </div>
            )}
          </form>
        </div>

        {/* Tabla de mensajes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Mensajes de Contacto</h2>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600 font-semibold">Cargando...</div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No hay mensajes.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mensaje</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contacts.map((c) => (
                      <tr key={c.id} className={c.read ? "bg-gray-50" : "hover:bg-blue-50 transition-colors"}>
                        <td className="px-4 py-3 text-gray-900 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-gray-700">{c.email}</td>
                        <td className="px-4 py-3 max-w-xs truncate text-gray-700" title={c.message}>{c.message}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button 
                            onClick={() => handleMarkRead(c.id)} 
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors"
                          >
                            Marcar leído
                          </button>
                          <button 
                            onClick={() => handleDelete(c.id)} 
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 