"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Notificaction } from "@/helpers/utils";
import CreateStoreModal from "@/components/store/CreateStoreModal";

export default function ProfilePage() {
  const { user, loading, updateUser } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/user", { ...form, _id: user?._id });
      if (res.data.success) {
        updateUser(res.data.user);
        setIsEditing(false);
        Notificaction("✅ Perfil actualizado correctamente", "success");
      }
    } catch (err: any) {
      Notificaction(
        err?.response?.data?.message || "Error al actualizar perfil",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Mi Perfil</h1>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 overflow-hidden">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isEditing && (
              <input
                name="avatar"
                type="url"
                placeholder="URL del avatar"
                value={form.avatar}
                onChange={handleChange}
                className="w-full max-w-md p-2 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Nombre</label>
              {isEditing ? (
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              ) : (
                <p className="text-white text-lg">{form.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Correo electrónico</label>
              <p className="text-white text-lg">{form.email}</p>
              <p className="text-gray-400 text-sm mt-1">
                El correo no se puede modificar
              </p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Teléfono</label>
              {isEditing ? (
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-white text-lg">{form.phone || "No especificado"}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Rol</label>
              <p className="text-white text-lg capitalize">{user.role}</p>
            </div>

            {!isEditing ? (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Editar Perfil
                </button>
                {user.role === "cliente" && (
                  <button
                    type="button"
                    onClick={() => setShowStoreModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Crear mi negocio
                  </button>
                )}
              </div>
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
                    setForm({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      avatar: user.avatar || "",
                    });
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

      {showStoreModal && (
        <CreateStoreModal
          onClose={() => setShowStoreModal(false)}
          onSuccess={() => {
            setShowStoreModal(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

