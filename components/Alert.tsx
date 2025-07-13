import React from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export default function Alert({ message, type = 'info', onClose }: AlertProps) {
  const color =
    type === 'success' ? 'bg-green-100 text-green-800 border-green-300' :
    type === 'error' ? 'bg-red-100 text-red-800 border-red-300' :
    'bg-blue-100 text-blue-800 border-blue-300';

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${color} flex items-center justify-between`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-sm font-bold">✕</button>
      )}
    </div>
  );
} 