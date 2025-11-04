"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import { Notificaction } from "@/helpers/utils";


export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "client",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/user", form);
       Notificaction(" Registro exitoso, redirigiendo al login...", "success");
       setTimeout(() => {
         router.push("/login");
       }, 1000);
    } catch (err) {
      setError("Error al registrarse. Intenta de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">
          Crear cuenta
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Nombre completo"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
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
          <input
            name="phone"
            placeholder="Teléfono"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* 🧍 Rol */}
          <div className="flex justify-between items-center text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="client"
                checked={form.role === "client"}
                onChange={handleChange}
                className="accent-green-500"
              />
              Cliente
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === "admin"}
                onChange={handleChange}
                className="accent-green-500"
              />
              Administrador
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
          >
            Registrarme
          </button>
        </form>

        {/* Línea divisora */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="px-2 text-gray-400 text-sm">o</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* 🔘 Botón de Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-500 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
          />
          Ingresar con Google
        </button>

        <p className="text-sm text-center mt-6 text-gray-300">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-400 hover:text-green-500 cursor-pointer font-semibold"
          >
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );
}
