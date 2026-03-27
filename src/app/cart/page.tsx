"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductName } from "@/helpers/productI18n";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    applyCupon,
    removeCupon,
    cupon,
    subtotal,
    discount,
    shipping,
    total,
    count,
  } = useCart();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cuponInput, setCuponInput] = useState("");
  const [isApplyingCupon, setIsApplyingCupon] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCupon = async () => {
    if (!cuponInput.trim()) return;
    
    setIsApplyingCupon(true);
    await applyCupon(cuponInput.trim());
    setIsApplyingCupon(false);
    setCuponInput("");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4">{t("cart.title") || "Carrito"}</h1>
        <p className="text-gray-400 mb-8 text-center">
          Tu carrito está vacío. ¡Explora nuestra colección!
        </p>
        <Link
          href="/collections"
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          Ver Colección
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">
          {t("cart.title") || "Tu Carrito"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.cartKey || item._id}
                className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 border border-white/10 flex gap-6"
              >
                <img
                  src={item.image}
                  alt={getProductName(item, language)}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">
                    {getProductName(item, language)}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    {item.size && (
                      <span className="bg-white/10 px-2 py-1 rounded">
                        Talla: {item.size}
                      </span>
                    )}
                    <span>{formatPrice(item.precio)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartKey || item._id!, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cartKey || item._id!, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartKey || item._id!)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">
                    {formatPrice(item.precio * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => clearCart()}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

              {/* Cupón */}
              <div className="mb-6">
                {cupon ? (
                  <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 font-bold">{cupon.codigo}</p>
                        <p className="text-sm text-gray-400">
                          {cupon.descuento}% de descuento
                        </p>
                      </div>
                      <button
                        onClick={removeCupon}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cuponInput}
                      onChange={(e) => setCuponInput(e.target.value.toUpperCase())}
                      placeholder="Código de cupón"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                    />
                    <button
                      onClick={handleApplyCupon}
                      disabled={isApplyingCupon || !cuponInput.trim()}
                      className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      {isApplyingCupon ? "..." : "Aplicar"}
                    </button>
                  </div>
                )}
              </div>

              {/* Totales */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({count} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuento</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Envío (Medellín y municipios)</span>
                  <span>{formatPrice(shipping)}</span>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-400">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all"
              >
                Proceder al Pago
              </button>

              <Link
                href="/collections"
                className="block text-center mt-4 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
