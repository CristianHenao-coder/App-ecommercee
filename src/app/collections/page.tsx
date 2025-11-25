"use client";

import { useEffect, useState, useMemo } from "react";
import { Product } from "@/interfaces/interfaces";
import AddProductModal from "@/components/modals /AddProductModal";

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceOrder, setPriceOrder] = useState("none");
  const [openModal, setOpenModal] = useState(false);

  
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/products");
      const data: Product[] = await res.json();
      setProducts(data);
    }
    load();
  }, []);
  
  console.log(products)
  
  const filtered = useMemo(() => {
    let list = [...products];

   
    if (search.trim() !== "") {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

 
    if (category !== "all") {
      list = list.filter((p) => p.categoria === category);
    }


    if (priceOrder === "asc") {
      list.sort((a, b) => a.precio - b.precio);
    }
    if (priceOrder === "desc") {
      list.sort((a, b) => b.precio - a.precio);
    }

    return list;
  }, [products, search, category, priceOrder]);

  console.log(filtered)

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        Colección de Productos
      </h1>


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


      
      <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-white text-black rounded-lg" >
          agregar Product
      </button>           
      <AddProductModal open={openModal} onClose={() => setOpenModal(false)} />
      </div>

      
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

              <p className="texts-xs   " > 
                
                Gets or sets the length of the array. This is a number one higher than the highest index in the array.

              </p>
            </div>

            
          ))}
        </div>
        
      )}
    </main>
  );
}