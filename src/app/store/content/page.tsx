"use client";

import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import axios from "axios";
import { Notificaction } from "@/helpers/utils";

export default function ContentPage() {
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    hashtags: "",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) {
      Notificaction("Debes seleccionar una imagen o video", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descripcion", form.descripcion);
      formData.append("hashtags", form.hashtags);
      formData.append("tiendaId", user?.tiendaId || "");
      formData.append("media", mediaFile);

      // TODO: Crear endpoint /api/posts
      Notificaction("Funcionalidad de posts próximamente", "info");
    } catch (err: any) {
      Notificaction("Error al crear post", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Contenido / Posts</h1>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Título</label>
            <input
              name="titulo"
              type="text"
              value={form.titulo}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Hashtags (separados por comas)</label>
            <input
              name="hashtags"
              type="text"
              value={form.hashtags}
              onChange={handleChange}
              placeholder="lookgod, moda, estilo"
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Imagen o Video</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {loading ? "Subiendo..." : "Publicar Contenido"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 Los posts que publiques aparecerán en el feed del marketplace y
            ayudarán a dar visibilidad a tu marca.
          </p>
        </div>
      </div>
    </div>
  );
}

