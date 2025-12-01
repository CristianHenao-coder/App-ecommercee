"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { Product } from "@/interfaces/interfaces";
import { useAuth } from "./AuthContext";
import { cartService } from "@/services/cart";
import { Notificaction } from "@/helpers/utils";
import { useLanguage } from "./LanguageContext";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    count: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "cartItems";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user } = useAuth();
    const { t } = useLanguage();

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // Sync to localStorage whenever items change
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items]);

    // Fetch cart from DB when user logs in
    useEffect(() => {
        if (user?.email) {
            const fetchCart = async () => {
                try {
                    const dbCart = await cartService.getCart(user.email);
                    if (dbCart && dbCart.length > 0) {
                        // If DB has cart items, we need to fetch full product data
                        // For now, we'll merge: if DB has items, use DB; otherwise keep local
                        // In a full implementation, we'd fetch products by IDs and merge properly
                        // For simplicity, we'll keep local cart and sync it to DB
                    }
                } catch (error) {
                    console.error("Error fetching cart from DB:", error);
                }
            };
            fetchCart();
        }
    }, [user?.email]);

    // Sync to DB when user is logged in and items change (debounced)
    useEffect(() => {
        if (user?.email && items.length >= 0) {
            const syncCart = async () => {
                try {
                    await cartService.syncCart(
                        user.email,
                        items.map(i => ({ productId: i._id || "", quantity: i.quantity }))
                    );
                } catch (error) {
                    console.error("Error syncing cart:", error);
                }
            };
            // Debounce to avoid too many API calls
            const timeout = setTimeout(syncCart, 1000);
            return () => clearTimeout(timeout);
        }
    }, [items, user?.email]);

    const addItem = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) {
                return prev.map((i) =>
                    i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        Notificaction(t("cart.added"), "success");
    };

    const removeItem = (productId: string) => {
        setItems((prev) => prev.filter((i) => i._id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((i) => (i._id === productId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}
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
