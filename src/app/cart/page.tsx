"use client";

import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/button/button";
import { Notificaction } from "@/helpers/utils";
import { getProductName } from "@/helpers/productI18n";

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const { t, language } = useLanguage();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // Allow viewing cart without login, but require login for checkout
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">{t("cart.title")}</h1>
                <p className="text-gray-400 mb-8">{t("cart.empty")}</p>
                <Link
                    href="/collections"
                    className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                    {t("nav.collection")}
                </Link>
            </div>
        );
    }

    const handleRemoveItem = (productId: string) => {
        removeItem(productId);
        Notificaction(t("cart.removed"), "success");
    };

    const handleClearCart = () => {
        if (confirm(t("dashboard.confirmDelete"))) {
            clearCart();
            Notificaction(t("cart.removed"), "success");
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            Notificaction(t("cart.loginRequired"), "error");
            router.push("/login");
            return;
        }
        router.push("/checkout");
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-12 text-center">{t("cart.title")}</h1>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider font-semibold">
                        <div className="col-span-6 md:col-span-6">{t("cart.product")}</div>
                        <div className="col-span-2 md:col-span-2 text-center">{t("cart.price")}</div>
                        <div className="col-span-2 md:col-span-2 text-center">{t("cart.quantity")}</div>
                        <div className="col-span-2 md:col-span-2 text-center">{t("cart.total")}</div>
                    </div>

                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 items-center hover:bg-white/5 transition-colors"
                        >
                            <div className="col-span-6 md:col-span-6 flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={getProductName(item, language)}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{getProductName(item, language)}</h3>
                                    <button
                                        onClick={() => handleRemoveItem(item._id)}
                                        className="text-red-500 text-sm hover:text-red-400 mt-1"
                                    >
                                        {t("dashboard.delete")}
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-2 md:col-span-2 text-center font-mono">
                                ${item.precio.toLocaleString()}
                            </div>

                            <div className="col-span-2 md:col-span-2 flex justify-center items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-mono">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            <div className="col-span-2 md:col-span-2 text-center font-mono font-bold text-green-400">
                                ${(item.precio * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    <div className="p-8 flex flex-col md:flex-row justify-between items-center bg-white/5">
                        <button
                            onClick={handleClearCart}
                            className="text-gray-400 hover:text-white text-sm mb-4 md:mb-0"
                        >
                            {t("cart.clearCart")}
                        </button>
                        <div className="flex flex-col items-end gap-4">
                            <div className="text-right">
                                <p className="text-gray-400 text-sm mb-1">{t("cart.subtotal")}</p>
                                <p className="text-3xl font-bold text-green-400">${total.toLocaleString()}</p>
                            </div>
                            <Button
                                onClick={handleCheckout}
                                variant="primary"
                                className="w-full md:w-auto"
                            >
                                {t("cart.proceedToCheckout")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

