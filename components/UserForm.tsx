import React, { useState } from 'react';

export interface UserFormValues {
  email: string;
  name: string;
  password?: string;
  role: 'ADMIN' | 'TECNICO' | 'USER';
}

interface UserFormProps {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  isEdit?: boolean;
}

export default function UserForm({ initialValues, onSubmit, isEdit }: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>(
    initialValues || { email: '', name: '', password: '', role: 'USER' }
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.email || !values.name || (!isEdit && !values.password)) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setError(null);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          name="role"
          value={values.role}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="ADMIN">Admin</option>
          <option value="TECNICO">Técnico</option>
          <option value="USER">Usuario</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
      >
        {isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
      </button>
    </form>
  );
} 