import React from 'react';

interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
}

export default function Table<T extends { id: string | number }>({ columns, data, actions }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr 
              key={row.id} 
              className="hover:bg-gray-50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
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
          <div className="text-gray-500 text-lg">No hay datos disponibles</div>
          <div className="text-gray-400 text-sm mt-2">Crea tu primer elemento para comenzar</div>
        </div>
      )}
    </div>
  );
} 
