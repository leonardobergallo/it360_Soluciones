"use client";
import AdminLayout from '@/components/AdminLayout';
import UserForm, { UserFormValues } from '@/components/UserForm';
import Alert from '@/components/Alert';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definir el tipo para un usuario
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TECNICO' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const [resetPasswordModal, setResetPasswordModal] = useState<{ show: boolean; userId: string; userName: string }>({
    show: false,
    userId: '',
    userName: ''
  });
  const [newPassword, setNewPassword] = useState('');

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

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const handleAddUser = async (data: UserFormValues) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear usuario');
      setAlert({ message: 'Usuario creado con éxito', type: 'success' });
      setShowForm(false);
      // Refrescar lista
      const usersRes = await fetch('/api/users');
      setUsers(await usersRes.json());
    } catch {
      setAlert({ message: 'Error al crear usuario', type: 'error' });
    }
  };

  const handleEditUser = async (data: UserFormValues) => {
    if (!editUser) return;
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editUser.id, ...data }),
      });
      if (!res.ok) throw new Error('Error al actualizar usuario');
      setAlert({ message: 'Usuario actualizado', type: 'success' });
      setEditUser(null);
      setShowForm(false);
      // Refrescar lista
      const usersRes = await fetch('/api/users');
      setUsers(await usersRes.json());
    } catch {
      setAlert({ message: 'Error al actualizar usuario', type: 'error' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        const res = await fetch('/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Error al eliminar usuario');
        setAlert({ message: 'Usuario eliminado', type: 'success' });
        // Refrescar lista
        const usersRes = await fetch('/api/users');
        setUsers(await usersRes.json());
      } catch {
        setAlert({ message: 'Error al eliminar usuario', type: 'error' });
      }
    }
  };

  // Función para abrir el modal de reset de contraseña
  const openResetPasswordModal = (userId: string, userName: string) => {
    setResetPasswordModal({ show: true, userId, userName });
    setNewPassword('');
  };

  // Función para cerrar el modal de reset de contraseña
  const closeResetPasswordModal = () => {
    setResetPasswordModal({ show: false, userId: '', userName: '' });
    setNewPassword('');
  };

  // Función para resetear la contraseña
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setAlert({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: resetPasswordModal.userId,
          newPassword: newPassword
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al resetear contraseña');
      }

      setAlert({ message: 'Contraseña actualizada exitosamente', type: 'success' });
      closeResetPasswordModal();
    } catch (error) {
      setAlert({ 
        message: error instanceof Error ? error.message : 'Error al resetear contraseña', 
        type: 'error' 
      });
    }
  };

  return (
    <AdminLayout>
      {/* Header mejorado */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-800 mb-2 flex items-center gap-3">
              <svg className="w-10 h-10 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Gestión de Usuarios
            </h1>
            <p className="text-slate-600 text-lg">Administra los usuarios del sistema IT360</p>
      </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Dashboard</span>
            </Link>
        <button
          onClick={() => { setShowForm(true); setEditUser(null); }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nuevo Usuario</span>
        </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-base font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-slate-800">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-base font-medium">Administradores</p>
                <p className="text-3xl font-bold text-slate-800">{users.filter(u => u.role === 'ADMIN').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-base font-medium">Técnicos</p>
                <p className="text-3xl font-bold text-slate-800">{users.filter(u => u.role === 'TECNICO').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-base font-medium">Clientes</p>
                <p className="text-3xl font-bold text-slate-800">{users.filter(u => u.role === 'USER').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {showForm && (
        <div className="mb-8">
          <UserForm
            onSubmit={editUser ? handleEditUser : handleAddUser}
            initialValues={editUser ? {
              email: editUser.email,
              name: editUser.name,
              role: editUser.role as 'ADMIN' | 'TECNICO' | 'USER',
            } : undefined}
            isEdit={!!editUser}
          />
        </div>
      )}
      {/* Tabla mejorada */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Lista de Usuarios
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold text-slate-700">EMAIL</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-slate-700">NOMBRE</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-slate-700">ROL</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-slate-700">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user, index) => (
                <tr key={user.id} className={`hover:bg-slate-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4 text-base text-slate-800 font-medium">{user.email}</td>
                  <td className="px-6 py-4 text-base text-slate-700">{user.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                      user.role === 'TECNICO' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                      'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    }`}>
                      {user.role === 'ADMIN' ? (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      ) : user.role === 'TECNICO' ? (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
            <button
                        onClick={() => { setEditUser(user); setShowForm(true); }}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
            >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Editar</span>
            </button>
            <button
                        onClick={() => openResetPasswordModal(user.id, user.name)}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
            >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span>Resetear</span>
            </button>
            <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
            >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Eliminar</span>
            </button>
          </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para resetear contraseña mejorado */}
      {resetPasswordModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Resetear Contraseña
            </h3>
              <p className="text-cyan-100 text-sm mt-1">
                Usuario: <span className="font-semibold">{resetPasswordModal.userName}</span>
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-3">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                Nueva contraseña
                  </span>
              </label>
                <div className="relative">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  La contraseña debe tener al menos 6 caracteres
                </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeResetPasswordModal}
                  className="flex items-center gap-2 px-6 py-3 text-slate-600 bg-slate-200 rounded-xl hover:bg-slate-300 transition-all duration-300 font-medium"
              >
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancelar</span>
              </button>
              <button
                onClick={handleResetPassword}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirmar</span>
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 
