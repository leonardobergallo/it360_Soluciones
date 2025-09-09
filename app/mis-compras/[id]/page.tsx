"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  notes?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('Error al cargar la orden');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RETURNED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PROCESSING':
        return 'En Proceso';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'RETURNED':
        return 'Devuelto';
      default:
        return status;
    }
  };

  const getShippingMethodText = (method?: string) => {
    switch (method) {
      case 'pickup':
        return 'Retiro en sucursal';
      case 'delivery':
        return 'Envío a domicilio';
      default:
        return 'Retiro en sucursal';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error || 'Orden no encontrada'}</p>
          <Link
            href="/mis-compras"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a mis compras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  IT360
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/mis-compras" className="ml-4 text-gray-500 hover:text-gray-700">
                    Mis compras
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-gray-900 font-medium">{order.orderNumber}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de la orden */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Orden {order.orderNumber}</h1>
                <p className="text-gray-600">
                  Creada el {format(new Date(order.createdAt), 'dd/MM/yyyy \'a las\' HH:mm', { locale: es })}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Información de la orden */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la orden</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Número de orden</dt>
                    <dd className="text-sm text-gray-900">{order.orderNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
                    <dd className="text-sm text-gray-900">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
                    <dd className="text-sm text-gray-900">
                      {format(new Date(order.updatedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ${order.total.toLocaleString('es-AR')}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de envío y pago</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Método de envío</dt>
                    <dd className="text-sm text-gray-900">{getShippingMethodText(order.shippingMethod)}</dd>
                  </div>
                  {order.shippingAddress && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dirección de envío</dt>
                      <dd className="text-sm text-gray-900">{order.shippingAddress}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Método de pago</dt>
                    <dd className="text-sm text-gray-900 capitalize">{order.paymentMethod || 'No especificado'}</dd>
                  </div>
                  {order.notes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Notas</dt>
                      <dd className="text-sm text-gray-900">{order.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Productos de la orden */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Productos ({order.items.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image || '/icono.png'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${item.price.toLocaleString('es-AR')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      Subtotal: ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de totales */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total de la orden</span>
              <span className="text-2xl font-bold text-gray-900">
                ${order.total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            href="/mis-compras"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ← Volver a mis compras
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
