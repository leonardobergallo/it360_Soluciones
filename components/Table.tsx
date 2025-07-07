import React from 'react';

interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
}

export default function Table<T extends { id: string | number }>({ columns, data, actions }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3">Acciones</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {String(row[col.key])}
                </td>
              ))}
              {actions && <td className="px-6 py-4 whitespace-nowrap">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 