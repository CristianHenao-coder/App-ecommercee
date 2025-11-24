"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
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

export default function ProductsPage() {
  const { user } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (user?.tiendaId) {
      fetchProducts();
    }
  }, [user]);

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

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await axios.delete(`/api/products/${productId}`);
      Notificaction("✅ Producto eliminado", "success");
      fetchProducts();
    } catch (error) {
      Notificaction("Error al eliminar producto", "error");
    }
  };

  if (loading) {
    return <div className="text-gray-400">Cargando productos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Productos</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          + Agregar Producto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
          <p className="text-gray-400 text-lg mb-4">
            No tienes productos aún
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Crear tu primer producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                {product.descripcion}
              </p>
              <p className="text-green-400 font-bold text-lg mb-2">
                ${product.precio.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Stock: {product.stock} | {product.categoria}
              </p>
              <button
                onClick={() => handleDelete(product._id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

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

