"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { paymentService } from "@/services/payments";
import { useRouter } from "next/navigation";
import { Notificaction } from "@/helpers/utils";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [paypalClientId, setPaypalClientId] = useState<string>("");

    useEffect(() => {
        // Fetch PayPal client ID from backend or use env var
        // For now, we'll use a placeholder. In production, fetch from API or use NEXT_PUBLIC_PAYPAL_CLIENT_ID
        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
        setPaypalClientId(clientId);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            Notificaction(t("cart.loginRequired"), "error");
            router.push("/login");
        }
    }, [isAuthenticated, router, t]);

    if (!isAuthenticated) {
        return null;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>{t("cart.empty")}</p>
            </div>
        );
    }

    const createOrder = async () => {
        try {
            const order = await paymentService.createOrder(items);
            return order.id;
        } catch (error) {
            console.error("Error creating order:", error);
            Notificaction(t("checkout.error"), "error");
            throw error;
        }
    };

    const onApprove = async (data: { orderID: string }) => {
        try {
            if (!user?.email) {
                Notificaction(t("checkout.error"), "error");
                return;
            }

            Notificaction(t("checkout.processing"), "info");
            
            // Prepare items for order
            const orderItems = items.map(item => ({
                productId: item._id || "",
                quantity: item.quantity,
                price: item.precio,
            }));

            const result = await paymentService.captureOrder(data.orderID, user.email, orderItems);

            if (result.status === "COMPLETED") {
                clearCart();
                Notificaction(t("checkout.success"), "success");
                router.push("/");
            } else {
                Notificaction(t("checkout.error"), "error");
            }
        } catch (error) {
            console.error("Error capturing order:", error);
            Notificaction(t("checkout.error"), "error");
        }
    };

    if (!paypalClientId) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>{t("checkout.error")}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-12 text-center">{t("checkout.title")}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">{t("checkout.summary")}</h2>
                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item._id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-400">x{item.quantity}</p>
                                        </div>
                                    </div>
                                    <p>${(item.precio * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                            <span>{t("cart.total")}</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-6 rounded-2xl text-black">
                        <h2 className="text-2xl font-bold mb-6">{t("checkout.paymentMethod")}</h2>
                        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                            <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={() => Notificaction(t("checkout.error"), "error")}
                            />
                        </PayPalScriptProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
