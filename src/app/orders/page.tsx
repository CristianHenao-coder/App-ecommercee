"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { IOrder } from "@/interfaces/interfaces";
import Link from "next/link";

export default function OrdersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-400 bg-yellow-400/10",
      paid: "text-blue-400 bg-blue-400/10",
      shipped: "text-purple-400 bg-purple-400/10",
      delivered: "text-green-400 bg-green-400/10",
      cancelled: "text-red-400 bg-red-400/10",
    };
    return colors[status] || "text-gray-400 bg-gray-400/10";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Pendiente",
      paid: "Pagado",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return texts[status] || status;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mis Pedidos</h1>
          <Link
            href="/collections"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
          >
            Seguir Comprando
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">No tienes pedidos aún</h2>
            <p className="text-gray-400 mb-8">
              Explora nuestra colección y realiza tu primera compra
            </p>
            <Link
              href="/collections"
              className="inline-block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Ver Colección
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Pedido</p>
                    <p className="font-mono text-lg font-bold">
                      #{order._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {order.createdAt && formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 font-oswald text-xs">PRODUCTO</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {typeof item.product === "object"
                              ? item.product.name
                              : "Producto"}
                          </p>
                          <p className="text-sm text-gray-400">
                            Cantidad: {item.quantity}
                            {item.size && ` | Talla: ${item.size}`}
                          </p>
                        </div>
                        <p className="font-bold text-green-400">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Descuento</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Envío</span>
                      <span>{formatPrice(order.shipping || 15000)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2">
                      <span>Total</span>
                      <span className="text-green-400">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Dirección de envío</p>
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p className="text-gray-400">
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                      </p>
                      <p className="text-gray-400">{order.shippingAddress.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
