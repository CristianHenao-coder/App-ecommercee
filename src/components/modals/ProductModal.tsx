"use client";

import { useState, useEffect } from "react";
import { Product } from "@/interfaces/interfaces";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Notificaction } from "@/helpers/utils";
import { getProductName, getProductDescription } from "@/helpers/productI18n";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  relatedProducts?: Product[];
}

const TALLAS = ["S", "M", "L", "XL"];

export default function ProductModal({
  product,
  open,
  onClose,
  relatedProducts = [],
}: ProductModalProps) {
  const [selectedTalla, setSelectedTalla] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setSelectedTalla("");
      setQuantity(1);
    }
  }, [open, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedTalla) {
      Notificaction("Por favor selecciona una talla", "error");
      return;
    }

    if (!isAuthenticated) {
      Notificaction(t("cart.loginRequired"), "error");
      router.push("/login");
      return;
    }

    // Agregar al carrito con talla
    addItem({
      ...product,
      selectedTalla,
      quantity,
    });

    Notificaction(t("cart.added"), "success");
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-modal-title"
      aria-describedby="product-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "900px" },
          maxHeight: "90vh",
          bgcolor: "#0a0a0a",
          borderRadius: "16px",
          overflow: "hidden",
          outline: "none",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <CloseIcon className="text-white" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[90vh] overflow-y-auto">
          {/* Imagen */}
          <div className="relative h-64 md:h-full min-h-[400px]">
            <img
              src={product.image}
              alt={getProductName(product, language)}
              className="w-full h-full object-cover"
            />
            {product.categoria && (
              <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-sm uppercase tracking-wider text-white">
                {product.categoria}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="mb-4">
              <h2
                id="product-modal-title"
                className="text-3xl font-bold text-white mb-2"
              >
                {getProductName(product, language)}
              </h2>
              <p
                id="product-modal-description"
                className="text-gray-400 text-base"
              >
                {getProductDescription(product, language)}
              </p>
            </div>

            <div className="mt-6 space-y-6 flex-1">
              {/* Precio */}
              <div>
                <p className="text-4xl font-bold text-green-400">
                  {formatPrice(product.precio)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Envío: $15,000 COP (Medellín y municipios)
                </p>
              </div>

              {/* Tallas */}
              <div>
                <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
                  Selecciona tu talla
                </p>
                <div className="flex gap-3">
                  {TALLAS.map((talla) => (
                    <button
                      key={talla}
                      onClick={() => setSelectedTalla(talla)}
                      className={`w-14 h-14 rounded-lg font-bold text-lg transition-all ${
                        selectedTalla === talla
                          ? "bg-white text-black"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cantidad */}
              <div>
                <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
                  Cantidad
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock */}
              {product.stock !== undefined && (
                <p className="text-sm text-gray-500">
                  {product.stock > 0
                    ? `${product.stock} disponibles`
                    : "Agotado"}
                </p>
              )}
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-6 w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>
        </div>

        {/* Productos recomendados */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4">Te puede interesar</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {relatedProducts.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="flex-shrink-0 w-32 cursor-pointer group"
                >
                  <img
                    src={p.image}
                    alt={getProductName(p, language)}
                    className="w-full h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                  />
                  <p className="mt-2 text-sm font-medium truncate text-white">
                    {getProductName(p, language)}
                  </p>
                  <p className="text-sm text-green-400">
                    {formatPrice(p.precio)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
}
