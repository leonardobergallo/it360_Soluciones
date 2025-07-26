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
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 max-w-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2 mb-2">
          <span>{isEdit ? '✏️' : '➕'}</span>
          {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h3>
        <p className="text-slate-600">
          {isEdit ? 'Modifica los datos del usuario seleccionado' : 'Crea un nuevo usuario en el sistema'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-500/30 text-red-700 px-4 py-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <span>❌</span>
              {error}
            </div>
          </div>
        )}

      <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            <span className="flex items-center gap-2">
              <span>📧</span>
              Email
            </span>
          </label>
          <div className="relative">
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="usuario@ejemplo.com"
          required
        />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-slate-400">📧</span>
            </div>
          </div>
      </div>

      <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            <span className="flex items-center gap-2">
              <span>👤</span>
              Nombre Completo
            </span>
          </label>
          <div className="relative">
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="Nombre y Apellido"
          required
        />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-slate-400">👤</span>
            </div>
          </div>
      </div>

      {!isEdit && (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <span className="flex items-center gap-2">
                <span>🔑</span>
                Contraseña
              </span>
            </label>
            <div className="relative">
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                placeholder="Mínimo 6 caracteres"
            required
          />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-slate-400">🔒</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              La contraseña debe tener al menos 6 caracteres
            </p>
        </div>
      )}

      <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            <span className="flex items-center gap-2">
              <span>🎭</span>
              Rol de Usuario
            </span>
          </label>
          <div className="relative">
        <select
          name="role"
          value={values.role}
          onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none"
            >
              <option value="USER">👤 Usuario (Cliente)</option>
              <option value="TECNICO">🔧 Técnico</option>
              <option value="ADMIN">👑 Administrador</option>
        </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="text-slate-400">▼</span>
            </div>
          </div>
      </div>

        <div className="flex gap-4 pt-4">
      <button
        type="submit"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
            <span>{isEdit ? '💾' : '➕'}</span>
            <span>{isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
      </button>
        </div>
    </form>
    </div>
  );
} 
