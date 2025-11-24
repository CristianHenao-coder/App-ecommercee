"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "@/contexts/SessionContext";
import { Notificaction } from "@/helpers/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/login", form);
      if (res.data.user) {
        login(res.data.user);
        Notificaction("✅ Inicio de sesión exitoso", "success");
        router.push("/"); // Ir al inicio si login exitoso
      } else {
        setError(res.data.message || "Error al iniciar sesión");
        Notificaction(res.data.message || "Error al iniciar sesión", "error");
      }
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Credenciales incorrectas";
      setError(errorMsg);
      Notificaction(errorMsg, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-green-400 hover:text-green-500 cursor-pointer font-semibold"
          >
            Registrarme
          </span>
        </p>
      </div>
    </div>
  );
}
