"use client";

import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { Notificaction } from "@/helpers/utils";
import axios from "axios";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useSession();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      Notificaction("Debes iniciar sesión para comprar", "error");
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      Notificaction("Tu carrito está vacío", "error");
      return;
    }

    // TODO: Implementar checkout real con pasarela de pago
    Notificaction("Proceso de pago próximamente", "info");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20">
            <p className="text-gray-400 text-lg mb-6">Tu carrito está vacío</p>
            <button
              onClick={() => router.push("/collections")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Ir a Colecciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex gap-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-green-400 font-bold text-lg mb-4">
                    ${item.precio.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                        className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                        className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item._id);
                        Notificaction("Producto eliminado del carrito", "success");
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 sticky top-24">
              <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white font-semibold">
                    ${total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Envío</span>
                  <span className="text-white font-semibold">Calculado</span>
                </div>
                <hr className="border-gray-700" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-400">${total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 mb-4"
              >
                Proceder al Pago
              </button>
              <button
                onClick={() => {
                  clearCart();
                  Notificaction("Carrito vaciado", "success");
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

