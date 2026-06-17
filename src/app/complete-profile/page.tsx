"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Notificaction } from "@/helpers/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { login } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos de Google cuando la sesión esté disponible
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userName = session.user.name || "";
      const userEmail = session.user.email || "";
      setForm(prev => ({
        ...prev,
        name: userName,
        email: userEmail,
      }));
    } else if (status === "unauthenticated") {
      // Si no hay sesión de Google, venir de registro normal
      const email = searchParams.get("email");
      const name = searchParams.get("name");
      if (email) {
        setForm(prev => ({ ...prev, email, name: name || "" }));
      }
    }
  }, [session, status, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error del campo al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "El celular es requerido";
    } else if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "El celular debe tener 10 dígitos";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar en localStorage y context
        login(data.user);
        Notificaction("¡Cuenta creada exitosamente! Bienvenido a LookGod", "success");
        
        // Redirigir a collections o carrito
        const redirect = searchParams.get("redirect") || "/collections";
        setTimeout(() => {
          router.push(redirect);
        }, 800);
      } else {
        Notificaction(data.message || "Error al completar registro", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Notificaction("Error de conexión", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Completa tu Perfil</h1>
          <p className="text-gray-400">
            {form.email ? `Registrando: ${form.email}` : "Finaliza tu registro"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white/5 border ${
                errors.name ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:border-white/30`}
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email (readonly si viene de Google) */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este correo viene de tu cuenta de Google
            </p>
          </div>

          {/* Celular */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Número de celular *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white/5 border ${
                errors.phone ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:border-white/30`}
              placeholder="300 123 4567"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Crea una contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white/5 border ${
                errors.password ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:border-white/30`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Confirma tu contraseña *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white/5 border ${
                errors.confirmPassword ? "border-red-500" : "border-white/10"
              } focus:outline-none focus:border-white/30`}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registrando..." : "Completar Registro"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando...</div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  );
}
