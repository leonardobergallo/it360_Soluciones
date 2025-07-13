"use client";
import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import UserForm, { UserFormValues } from '@/components/UserForm';
import Alert from '@/components/Alert';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <a href="/admin" className="px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-blue-800 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12l6-6M3 12l6 6" />
          </svg>
          Ir al dashboard
        </a>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button
          onClick={() => { setShowForm(true); setEditUser(null); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Nuevo Usuario
        </button>
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
      <Table
        columns={[
          { key: 'email', label: 'Email' },
          { key: 'name', label: 'Nombre' },
          { key: 'role', label: 'Rol' },
        ]}
        data={users}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditUser(row); setShowForm(true); }}
              className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
            >
              Editar
            </button>
            <button
              onClick={() => openResetPasswordModal(row.id, row.name)}
              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
            >
              Resetear contraseña
            </button>
            <button
              onClick={() => handleDeleteUser(row.id)}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            >
              Eliminar
            </button>
          </div>
        )}
      />

      {/* Modal para resetear contraseña */}
      {resetPasswordModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Resetear contraseña para {resetPasswordModal.userName}
            </h3>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeResetPasswordModal}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 