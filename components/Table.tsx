import React from 'react';

interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
}

export default function Table<T extends { id: string | number }>({ columns, data, actions }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/20">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-4 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider border-b border-white/10">
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider border-b border-white/10">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((row, index) => (
            <tr 
              key={row.id} 
              className="bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                  {String(row[col.key])}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Mensaje cuando no hay datos */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white/60 text-lg">No hay productos disponibles</div>
          <div className="text-white/40 text-sm mt-2">Crea tu primer producto para comenzar</div>
        </div>
      )}
    </div>
  );
} 