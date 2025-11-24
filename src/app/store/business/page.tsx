"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import axios from "axios";
import { Notificaction } from "@/helpers/utils";

export default function BusinessPage() {
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    logo: "",
    banner: "",
    redesSociales: {
      instagram: "",
      facebook: "",
      tiktok: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    if (user?.tiendaId) {
      fetchStore();
    }
  }, [user]);

  const fetchStore = async () => {
    try {
      const res = await axios.get(`/api/tiendas/${user?.tiendaId}`);
      if (res.data.success) {
        setStore(res.data.tienda);
        setForm({
          nombre: res.data.tienda.nombre || "",
          descripcion: res.data.tienda.descripcion || "",
          categoria: res.data.tienda.categoria || "",
          logo: res.data.tienda.logo || "",
          banner: res.data.tienda.banner || "",
          redesSociales: {
            instagram: res.data.tienda.redesSociales?.instagram || "",
            facebook: res.data.tienda.redesSociales?.facebook || "",
            tiktok: res.data.tienda.redesSociales?.tiktok || "",
            whatsapp: res.data.tienda.redesSociales?.whatsapp || "",
          },
        });
      }
    } catch (error) {
      console.error("Error al cargar tienda:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("redes.")) {
      const red = name.split(".")[1];
      setForm({
        ...form,
        redesSociales: {
          ...form.redesSociales,
          [red]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/tiendas/${user?.tiendaId}`, form);
      if (res.data.success) {
        setStore(res.data.tienda);
        setIsEditing(false);
        Notificaction("✅ Negocio actualizado correctamente", "success");
      }
    } catch (err: any) {
      Notificaction(
        err?.response?.data?.message || "Error al actualizar negocio",
        "error"
      );
    }
  };

  if (loading) {
    return <div className="text-gray-400">Cargando...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Mi Negocio</h1>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Nombre del Negocio</label>
            {isEditing ? (
              <input
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            ) : (
              <p className="text-white text-lg">{form.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Descripción</label>
            {isEditing ? (
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-white">{form.descripcion || "Sin descripción"}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Categoría</label>
            {isEditing ? (
              <input
                name="categoria"
                type="text"
                value={form.categoria}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-white text-lg">{form.categoria || "Sin categoría"}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Logo (URL)</label>
            {isEditing ? (
              <input
                name="logo"
                type="url"
                value={form.logo}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              form.logo && (
                <img
                  src={form.logo}
                  alt="Logo"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              )
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Banner (URL)</label>
            {isEditing ? (
              <input
                name="banner"
                type="url"
                value={form.banner}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              form.banner && (
                <img
                  src={form.banner}
                  alt="Banner"
                  className="w-full h-64 rounded-lg object-cover"
                />
              )
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-400">
              Redes Sociales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(form.redesSociales).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-gray-300 mb-2 capitalize">
                    {key}
                  </label>
                  {isEditing ? (
                    <input
                      name={`redes.${key}`}
                      type="url"
                      value={value}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-white">
                      {value || "No especificado"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Editar Negocio
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  fetchStore();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

