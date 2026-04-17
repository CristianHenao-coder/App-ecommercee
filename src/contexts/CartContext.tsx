"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { Product, CartItem } from "@/interfaces/interfaces";
import { useAuth } from "./AuthContext";
import { cartService } from "@/services/cart";
import { Notificaction } from "@/helpers/utils";
import { useLanguage } from "./LanguageContext";

interface CuponAplicado {
    codigo: string;
    descuento: number; // porcentaje
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product & { selectedTalla?: string; quantity?: number }) => void;
    removeItem: (cartKey: string) => void;
    updateQuantity: (cartKey: string, quantity: number) => void;
    clearCart: () => void;
    applyCupon: (codigo: string) => Promise<boolean>;
    removeCupon: () => void;
    cupon: CuponAplicado | null;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    count: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "lookgod_cart";
const CUPON_KEY = "lookgod_cupon";
const SHIPPING_COST = 15000; // $15,000 COP para Medellín y municipios

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [cupon, setCupon] = useState<CuponAplicado | null>(null);
    const { user } = useAuth();
    const { t } = useLanguage();

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;
        
        // Load cart items
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        }
        
        // Load cupon
        const storedCupon = window.localStorage.getItem(CUPON_KEY);
        if (storedCupon) {
            try {
                setCupon(JSON.parse(storedCupon));
            } catch {
                window.localStorage.removeItem(CUPON_KEY);
            }
        }
    }, []);

    // Sync to localStorage whenever items or cupon change
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (cupon) {
                window.localStorage.setItem(CUPON_KEY, JSON.stringify(cupon));
            } else {
                window.localStorage.removeItem(CUPON_KEY);
            }
        }
    }, [cupon]);

    // Sync to DB when user is logged in and items change (debounced)
    useEffect(() => {
        if (user?.email && items.length > 0) {
            const syncCart = async () => {
                try {
                    await cartService.syncCart(
                        user.email,
                        items.map(i => ({ productId: i._id || "", quantity: i.quantity }))
                    );
                } catch (error) {
                    // Silenciar error de sincronización
                }
            };
            const timeout = setTimeout(syncCart, 2000);
            return () => clearTimeout(timeout);
        }
    }, [items.length, user?.email]);

    const addItem = (product: Product & { selectedTalla?: string; quantity?: number }) => {
        const talla = product.selectedTalla || "M";
        const qty = product.quantity || 1;
        const cartKey = `${product._id}-${talla}`;

        setItems((prev) => {
            const existing = prev.find((i) => i.cartKey === cartKey);
            if (existing) {
                return prev.map((i) =>
                    i.cartKey === cartKey ? { ...i, quantity: i.quantity + qty } : i
                );
            }
            return [...prev, { 
                ...product, 
                quantity: qty, 
                size: talla,
                cartKey 
            }];
        });
        Notificaction(t("cart.added"), "success");
    };

    const removeItem = (cartKey: string) => {
        setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    };

    const updateQuantity = (cartKey: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        setCupon(null);
    };

    const applyCupon = async (codigo: string): Promise<boolean> => {
        try {
            const response = await fetch("/api/cupones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigo }),
            });

            const data = await response.json();

            if (response.ok && data.valido) {
                setCupon({
                    codigo: data.cupon.codigo,
                    descuento: data.cupon.descuento,
                });
                Notificaction(`Cupón aplicado: ${data.cupon.descuento}% de descuento`, "success");
                return true;
            } else {
                Notificaction(data.error || "Cupón no válido", "error");
                return false;
            }
        } catch (error) {
            console.error("Error aplicando cupón:", error);
            Notificaction("Error al validar el cupón", "error");
            return false;
        }
    };

    const removeCupon = () => {
        setCupon(null);
        Notificaction("Cupón eliminado", "info");
    };

    // Calculations
    const subtotal = items.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const discount = cupon ? Math.round(subtotal * (cupon.descuento / 100)) : 0;
    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    const total = subtotal - discount + shipping;
    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
