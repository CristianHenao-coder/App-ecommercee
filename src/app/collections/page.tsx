"use client";

import { useEffect, useState, useMemo } from "react";
import { Product } from "@/interfaces/interfaces";
import { productService } from "@/services/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import Button from "@/components/button/button";
import { getProductName, getProductDescription } from "@/helpers/productI18n";

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceOrder, setPriceOrder] = useState("none");
  const { t, language } = useLanguage();
  const { addItem } = useCart();

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim() !== "") {
      list = list.filter((p) => {
        const name = getProductName(p, language);
        return name.toLowerCase().includes(search.toLowerCase());
      });
    }

    if (category !== "all") {
      // Case-insensitive comparison for categories
      list = list.filter((p) => (p.categoria || "").toLowerCase() === category.toLowerCase());
    }

    if (priceOrder === "asc") {
      list.sort((a, b) => a.precio - b.precio);
    }
    if (priceOrder === "desc") {
      list.sort((a, b) => b.precio - a.precio);
    }

    return list;
  }, [products, search, category, priceOrder, language]);

  // Translate categories based on code from database
  const categoryLabel = (code: string) => {
    switch (code) {
      case "camisetas":
        return t("collection.categories.tshirts");
      case "hoddies":
        return t("collection.categories.hoodies");
      case "accesorios":
        return t("collection.categories.accessories");
      default:
        return code;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        {t("collection.title")}
      </h1>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center items-center">
        <input
          type="text"
          placeholder={t("collection.searchPlaceholder")}
          className="px-4 py-2 rounded-lg bg-white text-black w-full md:w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg bg-white text-black w-full md:w-48"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">{t("collection.allCategories")}</option>
          <option value="camisetas">
            {t("collection.categories.tshirts")}
          </option>
          <option value="hoddies">
            {t("collection.categories.hoodies")}
          </option>
          <option value="accesorios">
            {t("collection.categories.accessories")}
          </option>
        </select>

        <select
          className="px-4 py-2 rounded-lg bg-white text-black w-full md:w-48"
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
        >
          <option value="none">{t("collection.orderByPrice")}</option>
          <option value="asc">{t("collection.priceAsc")}</option>
          <option value="desc">{t("collection.priceDesc")}</option>
        </select>


      </div>

      {/* PRODUCT LIST */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          {t("collection.noProducts")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-white text-black rounded-xl shadow-lg p-4 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={p.image}
                alt={getProductName(p, language)}
                className="rounded-lg mb-4 w-full h-80 object-cover"
              />

              <h3 className="text-xl font-semibold mb-2">{getProductName(p, language)}</h3>
              <p className="text-gray-700 mb-2">{getProductDescription(p, language)}</p>

              <p className="text-green-600 font-bold text-lg">
                ${p.precio.toLocaleString()}
              </p>

              <p className="text-xs text-gray-500 uppercase mt-1">
                {categoryLabel(p.categoria)}
              </p>
              <Button
                onClick={() => addItem(p)}
                variant="secondary"
                fullWidth
                className="mt-4"
              >
                {t("cart.add")}
              </Button>
            </div>
          ))}
        </div>
      )}


    </main>
  );
}
