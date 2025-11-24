"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Notificaction } from "@/helpers/utils";
import AddProductModal from "@/components/store/AddProductModal";

interface Product {
  _id: string;
  name: string;
  descripcion: string;
  precio: number;
  categoria: string;
  image: string;
  stock: number;
  tiendaId?: string;
}

export default function MyCollectionsPage() {
  const { user, loading: sessionLoading } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("nombre");

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login");
      return;
    }
    if (user?.tiendaId) {
      fetchProducts();
    }
  }, [user, sessionLoading, router]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products?tiendaId=${user?.tiendaId}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.categoria.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "nombre":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!user || !user.tiendaId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Necesitas crear un negocio para ver tus colecciones
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Ir a Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mis Colecciones</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            + Agregar Producto
          </button>
        </div>

        {/* Filtros y ordenamiento */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Buscar</label>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Buscar por nombre o categoría..."
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="nombre">Nombre</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <p className="text-gray-400 text-lg mb-4">
              {filter ? "No se encontraron productos" : "No tienes productos aún"}
            </p>
            {!filter && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Crear tu primer producto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                  {product.descripcion}
                </p>
                <p className="text-green-400 font-bold text-lg mb-2">
                  ${product.precio.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">
                  Stock: {product.stock} | {product.categoria}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

