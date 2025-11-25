"use client";
import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddProductModal({ open, onClose }: Props) {
  
  const [name, setName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Si no está abierto, se retorna null, PERO los hooks ya se ejecutaron arriba
  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("categoria", categoria);
      formData.append("stock", "10");
     

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.log("Error al agregar producto");
      }

      onClose(); // cerrar modal
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black text-white p-8 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar producto"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-white-500 text-white rounded hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
