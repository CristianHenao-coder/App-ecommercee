"use client";

import { useEffect, useState, useMemo } from "react";
import { Product } from "@/interfaces/interfaces";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/contexts/SessionContext";
import { Notificaction } from "@/helpers/utils";
import Link from "next/link";
import axios from "axios";

export default function CollectionPage() {
  const { addToCart } = useCart();
  const { user } = useSession();
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [favoriteProducts, setFavoriteProducts] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceOrder, setPriceOrder] = useState("none");

  // 🔥 1. Cargar productos solo una vez
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/products");
      const data: Product[] = await res.json();
      setProducts(data);
    }
    load();
  }, []);

  // Cargar likes y favoritos del usuario
  useEffect(() => {
    if (user?._id) {
      axios.get(`/api/likes?userId=${user._id}`).then((res) => {
        if (res.data.success) {
          const liked = new Set(res.data.likes.map((l: any) => l.productId.toString()));
          setLikedProducts(liked);
        }
      });

      axios.get(`/api/favorites?userId=${user._id}`).then((res) => {
        if (res.data.success) {
          const favs = new Set(res.data.favorites.map((f: any) => f.productId.toString()));
          setFavoriteProducts(favs);
        }
      });
    }
  }, [user]);

  const handleLike = async (productId: string) => {
    if (!user) {
      Notificaction("Debes iniciar sesión para dar like", "error");
      return;
    }

    const isLiked = likedProducts.has(productId);
    try {
      if (isLiked) {
        await axios.delete(`/api/likes?userId=${user._id}&productId=${productId}`);
        setLikedProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await axios.post("/api/likes", { userId: user._id, productId });
        setLikedProducts((prev) => new Set(prev).add(productId));
      }
    } catch (error) {
      Notificaction("Error al actualizar like", "error");
    }
  };

  const handleFavorite = async (productId: string) => {
    if (!user) {
      Notificaction("Debes iniciar sesión para guardar favoritos", "error");
      return;
    }

    const isFav = favoriteProducts.has(productId);
    try {
      if (isFav) {
        await axios.delete(`/api/favorites?userId=${user._id}&productId=${productId}`);
        setFavoriteProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        Notificaction("Eliminado de favoritos", "success");
      } else {
        await axios.post("/api/favorites", { userId: user._id, productId });
        setFavoriteProducts((prev) => new Set(prev).add(productId));
        Notificaction("Agregado a favoritos", "success");
      }
    } catch (error) {
      Notificaction("Error al actualizar favoritos", "error");
    }
  };

  // 🔥 2. Usamos useMemo para FILTRAR sin efectos, la forma correcta
  const filtered = useMemo(() => {
    let list = [...products];

    // Buscar
    if (search.trim() !== "") {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Categoría
    if (category !== "all") {
      list = list.filter((p) => p.categoria === category);
    }

    // Ordenar por precio
    if (priceOrder === "asc") {
      list.sort((a, b) => a.precio - b.precio);
    }
    if (priceOrder === "desc") {
      list.sort((a, b) => b.precio - a.precio);
    }

    return list;
  }, [products, search, category, priceOrder]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        Colección de Productos
      </h1>

      {/* 🔥 FILTROS */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="px-4 py-2 rounded-lg bg-white text-black w-full md:w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg bg-white text-black w-full md:w-48"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="camisetas">Camisetas</option>
          <option value="hoddies">Hoddies</option>
          <option value="accesorios">Accesorios</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg bg-white text-black w-full md:w-48"
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
        >
          <option value="none">Ordenar por precio</option>
          <option value="asc">Menor precio</option>
          <option value="desc">Mayor precio</option>
        </select>
      </div>

      {/* 🔥 PRODUCTOS */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No se encontraron productos.
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
                alt={p.name}
                className="rounded-lg mb-4 w-full h-80 object-cover"
              />

              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-gray-700 mb-2">{p.descripcion}</p>

              <p className="text-green-600 font-bold text-lg">
                ${p.precio.toLocaleString()}
              </p>

              <p className="text-xs text-gray-500 uppercase mt-1">
                {p.categoria}
              </p>
              <div className="mt-4 flex gap-2 items-center">
                <button
                  onClick={() => handleLike(p._id || "")}
                  className={`p-2 rounded-lg transition-colors ${
                    likedProducts.has(p._id || "")
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  title="Like"
                >
                  ❤️
                </button>
                <button
                  onClick={() => handleFavorite(p._id || "")}
                  className={`p-2 rounded-lg transition-colors ${
                    favoriteProducts.has(p._id || "")
                      ? "text-yellow-500"
                      : "text-gray-400 hover:text-yellow-500"
                  }`}
                  title="Favorito"
                >
                  ⭐
                </button>
                <Link
                  href={`/products/${p._id}`}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-center py-2 rounded-lg transition-colors"
                >
                  Ver Detalles
                </Link>
                <button
                  onClick={() => {
                    addToCart({
                      _id: p._id || "",
                      name: p.name,
                      precio: p.precio,
                      image: p.image,
                      cantidad: 1,
                      tiendaId: p.tiendaId,
                    });
                    Notificaction("✅ Producto agregado al carrito", "success");
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}