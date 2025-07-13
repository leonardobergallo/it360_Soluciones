"use client";
import AdminLayout from '@/components/AdminLayout';
import Table from '@/components/Table';
import UserForm, { UserFormValues } from '@/components/UserForm';
import Alert from '@/components/Alert';
import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [alert, setAlert] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12l6-6M3 12l6 6" />
          </svg>
          Ir al inicio
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
              onClick={() => handleDeleteUser(row.id)}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            >
              Eliminar
            </button>
          </div>
        )}
      />
    </AdminLayout>
  );
} 