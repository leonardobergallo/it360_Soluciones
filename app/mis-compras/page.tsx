"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    category: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingMethod?: string;
  paymentMethod?: string;
}

export default function MisComprasPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Intentar obtener ventas del usuario logueado
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Primero obtener información del usuario para obtener su email
          const userResponse = await fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          let userEmail = null;
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userEmail = userData.user?.email;
          }

          const response = await fetch('/api/sales', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const sales = await response.json();
            console.log('🔍 Todas las ventas:', sales.length);
            console.log('🔍 Email del usuario logueado:', userEmail);
            
            // Convertir ventas a formato de órdenes para mostrar
            // Incluir ventas del usuario logueado O ventas sin usuario pero con el mismo email
            const userSales = sales.filter((sale: any) => {
              const hasUser = sale.user?.id;
              const hasMatchingEmail = userEmail && sale.email === userEmail;
              const shouldInclude = hasUser || hasMatchingEmail;
              
              console.log('🔍 Venta:', {
                id: sale.id,
                userId: sale.userId,
                userEmail: sale.user?.email,
                saleEmail: sale.email,
                hasUser,
                hasMatchingEmail,
                shouldInclude
              });
              
              return shouldInclude;
            });
            
            console.log('🔍 Ventas filtradas:', userSales.length);
            setOrders(userSales.map((sale: any) => ({
              id: sale.id,
              orderNumber: `COMPRA-${sale.id.slice(-8).toUpperCase()}`,
              total: sale.amount,
              status: sale.status === 'completed' ? 'COMPLETED' : 
                      sale.status === 'approved' ? 'APPROVED' :
                      sale.status === 'cancelled' ? 'CANCELLED' : 'PENDING',
              createdAt: sale.createdAt,
              updatedAt: sale.updatedAt || sale.createdAt,
              items: [{
                id: sale.id,
                quantity: 1,
                price: sale.amount,
                product: {
                  id: sale.product?.id || sale.service?.id || '',
                  name: sale.product?.name || sale.service?.name || 'Producto',
                  image: '',
                  category: 'Producto'
                }
              }],
              shippingMethod: 'pickup',
              paymentMethod: sale.metodoPago || 'reembolso'
            })));
            return;
          }
        } catch (error) {
          console.log('Error obteniendo ventas del usuario:', error);
        }
      }
      
      // Si no hay token o falla, mostrar mensaje de no hay compras
      setOrders([]);
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
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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
        return 'Pendiente de Aprobación';
      case 'APPROVED':
        return 'Aprobado';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <Link href="/profile" className="ml-4 text-gray-500 hover:text-gray-700">
                    Mi cuenta
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-gray-900 font-medium">Mis compras</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y descripción */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis compras</h1>
          <p className="text-gray-600">
            Gestiona todas tus compras online y telefónicas. Las compras requieren aprobación del administrador antes de ser procesadas.
          </p>
        </div>

        {/* Lista de órdenes */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes compras aún</h3>
            <p className="text-gray-600 mb-6">Cuando hagas tu primera compra, aparecerá aquí.</p>
            <Link
              href="/catalogo"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header de la orden */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">Fecha: {format(new Date(order.createdAt), 'dd-MM-yyyy', { locale: es })}</p>
                        <p className="text-sm text-gray-500">Compra: {order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          Total pagado: ${order.total.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <Link
                        href={`/mis-compras/${order.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        VER DETALLE
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Estado de la orden */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                    {order.status === 'PENDING' && (
                      <div className="text-sm text-gray-600">
                        ⏳ Esperando aprobación del administrador
                      </div>
                    )}
                    {order.status === 'APPROVED' && (
                      <div className="text-sm text-blue-600">
                        ✅ Compra aprobada - Procesando
                      </div>
                    )}
                    {order.status === 'COMPLETED' && (
                      <div className="text-sm text-green-600">
                        🎉 Compra completada
                      </div>
                    )}
                    {order.status === 'CANCELLED' && (
                      <div className="text-sm text-red-600">
                        ❌ Compra cancelada
                      </div>
                    )}
                  </div>
                </div>

                {/* Items de la orden */}
                <div className="px-6 py-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image || '/icono.png'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.price.toLocaleString('es-AR')} x {item.quantity} unidad{item.quantity > 1 ? 'es' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Información adicional */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Método de envío:</p>
                      <p className="font-medium">{getShippingMethodText(order.shippingMethod)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Método de pago:</p>
                      <p className="font-medium capitalize">{order.paymentMethod || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
