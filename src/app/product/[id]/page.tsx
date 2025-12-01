"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/interfaces/interfaces";
import { productService } from "@/services/products";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Notificaction } from "@/helpers/utils";
import Link from "next/link";
import Button from "@/components/button/button";
import { getProductName, getProductDescription } from "@/helpers/productI18n";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const products = await productService.getAll();
                const found = products.find((p) => p._id === params.id);
                if (found) {
                    setProduct(found);
                } else {
                    Notificaction(t("product.notFound"), "error");
                    router.push("/collections");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                Notificaction(t("common.error"), "error");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id, router, t]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>{t("common.loading")}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>{t("product.notFound")}</p>
                <Link href="/collections" className="ml-4 text-blue-400 hover:underline">
                    {t("nav.collection")}
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem(product);
        Notificaction(t("cart.added"), "success");
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-gray-400 hover:text-white transition-colors"
                >
                    ← {t("nav.collection")}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden">
                            <img
                                src={product.image}
                                alt={getProductName(product, language)}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">{getProductName(product, language)}</h1>
                            <p className="text-3xl font-bold text-green-400 mb-6">
                                ${product.precio.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">{t("product.description")}</h2>
                            <p className="text-gray-300 leading-relaxed">{getProductDescription(product, language)}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">{t("product.specs")}</h2>
                            <div className="space-y-2 text-gray-300">
                                <p>
                                    <span className="font-semibold">{t("product.category")}:</span> {product.categoria}
                                </p>
                                {product.stock !== undefined && (
                                    <p>
                                        <span className="font-semibold">Stock:</span> {product.stock}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <Button
                                onClick={handleAddToCart}
                                variant="primary"
                                fullWidth
                                className="text-lg py-4"
                            >
                                {t("product.addToCart")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

