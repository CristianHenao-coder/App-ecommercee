"use client";

import { useEffect, useState } from "react";
import { Product } from "@/interfaces/interfaces";
import { productService } from "@/services/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductName, getProductDescription } from "@/helpers/productI18n";
import ProductModal from "@/components/modals/ProductModal";

const CATEGORIAS = [
  { id: "camisetas", nombre: "Camisetas Oversize" },
  { id: "buzos", nombre: "Buzos Oversize" },
  { id: "camisas", nombre: "Camisas Cortas" },
];

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const { language } = useLanguage();

  useEffect(() => {
    productService.getAll().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.categoria?.toLowerCase() === selectedCategory ||
               p.categoria?.toLowerCase().includes(selectedCategory.slice(0, 4))
      );
    }

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.precio - a.precio);
        break;
      case "name":
        filtered.sort((a, b) => 
          getProductName(a, language).localeCompare(getProductName(b, language))
        );
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, language]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getRelatedProducts = (product: Product) => {
    return products.filter(
      (p) => p._id !== product._id && p.categoria === product.categoria
    ).slice(0, 4);
  };

  return (
    <div className="bg-black text-white pt-24 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Colección</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explora nuestra selección de ropa oversize con propósito. 
            Cada prenda cuenta una historia de fe y esperanza.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Categorías */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-white text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Todos
            </button>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Ordenar */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/30"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        {/* Contador */}
        <p className="text-gray-400 mb-6">
          {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
        </p>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">No hay productos</h2>
            <p className="text-gray-400">Pronto tendremos nuevos diseños</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="group relative bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={product.image}
                    alt={getProductName(product, language)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  {product.categoria && (
                    <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                      {product.categoria}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-green-400 transition-colors line-clamp-1">
                    {getProductName(product, language)}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {getProductDescription(product, language)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-400">
                      {formatPrice(product.precio)}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">
                      Click para ver
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de producto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          relatedProducts={getRelatedProducts(selectedProduct)}
        />
      )}
    </div>
  );
}
