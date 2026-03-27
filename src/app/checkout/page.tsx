"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductName } from "@/helpers/productI18n";

interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, subtotal, discount, shipping, total, cupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    phone: "",
    address: "",
    city: "Medellín",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
    
    // Pre-llenar con datos del usuario si existen
    if (user?.name) {
      setForm(prev => ({ ...prev, fullName: user.name }));
    }
  }, [isAuthenticated, router, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = () => {
    const newErrors: Partial<ShippingForm> = {};
    
    if (!form.fullName.trim()) newErrors.fullName = "Nombre requerido";
    if (!form.phone.trim()) newErrors.phone = "Teléfono requerido";
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Teléfono inválido (10 dígitos)";
    }
    if (!form.address.trim()) newErrors.address = "Dirección requerida";
    if (!form.city.trim()) newErrors.city = "Ciudad requerida";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email,
          items: items.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.precio,
            size: item.size,
          })),
          subtotal,
          discount,
          shipping,
          total,
          couponCode: cupon?.codigo,
          shippingAddress: form,
          paymentMethod: "pending",
        }),
      });

      if (response.ok) {
        const order = await response.json();
        setOrderId(order._id);
        clearCart();
      } else {
        const error = await response.json();
        alert(error.error || "Error al crear el pedido");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Carrito vacío</h1>
        <Link
          href="/collections"
          className="px-8 py-3 bg-white text-black font-bold rounded-lg"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  // Pantalla de confirmación
  if (orderId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
          <p className="text-gray-400 mb-4">
            Tu pedido ha sido creado exitosamente.
          </p>
          <p className="text-xl font-mono bg-white/10 px-4 py-2 rounded-lg mb-6">
            #{orderId.slice(-8).toUpperCase()}
          </p>
          <p className="text-gray-400 mb-8">
            Pronto nos pondremos en contacto contigo para coordinar el pago y envío.
          </p>
          <div className="space-y-4">
            <Link
              href="/orders"
              className="block w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Ver mis pedidos
            </Link>
            <Link
              href="/collections"
              className="block w-full py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario de envío */}
          <div>
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6">Datos de Envío</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={`w-full bg-white/5 border ${
                      errors.fullName ? "border-red-500" : "border-white/10"
                    } rounded-lg px-4 py-3 focus:outline-none focus:border-white/30`}
                    placeholder="Juan Pérez"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full bg-white/5 border ${
                      errors.phone ? "border-red-500" : "border-white/10"
                    } rounded-lg px-4 py-3 focus:outline-none focus:border-white/30`}
                    placeholder="300 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`w-full bg-white/5 border ${
                      errors.address ? "border-red-500" : "border-white/10"
                    } rounded-lg px-4 py-3 focus:outline-none focus:border-white/30`}
                    placeholder="Calle 10 # 20-30, Apto 101"
                  />
                  {errors.address && (
                    <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30"
                  >
                    <option value="Medellín">Medellín</option>
                    <option value="Envigado">Envigado</option>
                    <option value="Sabaneta">Sabaneta</option>
                    <option value="Itagüí">Itagüí</option>
                    <option value="La Estrella">La Estrella</option>
                    <option value="Bello">Bello</option>
                    <option value="Copacabana">Copacabana</option>
                    <option value="Girardota">Girardota</option>
                    <option value="Barbosa">Barbosa</option>
                    <option value="Rionegro">Rionegro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 h-24 resize-none"
                    placeholder="Instrucciones de entrega, portero, etc."
                  />
                </div>
              </form>
            </div>

            {/* Métodos de pago */}
            <div className="mt-6 bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Métodos de Pago</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div>
                    <p className="font-medium">PayU</p>
                    <p className="text-sm text-gray-400">
                      Tarjetas, PSE, Nequi, Daviplata
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                    MP
                  </div>
                  <div>
                    <p className="font-medium">Mercado Pago</p>
                    <p className="text-sm text-gray-400">
                      Tarjetas, QR, Efecty
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * El pago se coordinará por WhatsApp después de confirmar tu pedido
              </p>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div>
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

              {/* Productos */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.cartKey || item._id}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={item.image}
                      alt={getProductName(item, language)}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {getProductName(item, language)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.size && `Talla: ${item.size} | `}
                        Cant: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-green-400">
                      {formatPrice(item.precio * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cupón aplicado */}
              {cupon && (
                <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-400 font-bold text-sm">{cupon.codigo}</p>
                      <p className="text-xs text-gray-400">{cupon.descuento}% de descuento</p>
                    </div>
                    <span className="text-green-400 font-bold">-{formatPrice(discount)}</span>
                  </div>
                </div>
              )}

              {/* Totales */}
              <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuento</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-green-400">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
