"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface Store {
  _id: string;
  nombre: string;
  descripcion: string;
  logo: string;
  banner: string;
  categoria: string;
  redesSociales: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

interface Product {
  _id: string;
  name: string;
  descripcion: string;
  precio: number;
  categoria: string;
  image: string;
  stock: number;
}

export default function StoreProfilePage() {
  const params = useParams();
  const storeId = params.id as string;
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeId) {
      fetchStore();
      fetchProducts();
    }
  }, [storeId]);

  const fetchStore = async () => {
    try {
      const res = await axios.get(`/api/tiendas/${storeId}`);
      if (res.data.success) {
        setStore(res.data.tienda);
      }
    } catch (error) {
      console.error("Error al cargar tienda:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products?tiendaId=${storeId}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Tienda no encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Banner */}
      {store.banner && (
        <div className="w-full h-64 md:h-96 relative">
          <img
            src={store.banner}
            alt={store.nombre}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Store Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {store.logo && (
            <img
              src={store.logo}
              alt={store.nombre}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-800"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{store.nombre}</h1>
            <p className="text-gray-300 mb-4">{store.descripcion}</p>
            {store.categoria && (
              <span className="inline-block bg-green-600/20 text-green-400 px-4 py-2 rounded-lg text-sm">
                {store.categoria}
              </span>
            )}

            {/* Redes Sociales */}
            {store.redesSociales && (
              <div className="flex gap-4 mt-4">
                {store.redesSociales.instagram && (
                  <a
                    href={store.redesSociales.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {store.redesSociales.facebook && (
                  <a
                    href={store.redesSociales.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {store.redesSociales.tiktok && (
                  <a
                    href={store.redesSociales.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    TikTok
                  </a>
                )}
                {store.redesSociales.whatsapp && (
                  <a
                    href={store.redesSociales.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Productos</h2>
          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-12">
              Esta tienda aún no tiene productos
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
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
                  <p className="text-green-400 font-bold text-lg">
                    ${product.precio.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

