"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/button/button";

type Role = "admin" | "client";

interface LoginResponseUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

interface LoginResponse {
  message: string;
  user: LoginResponseUser;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await authService.login(form);

      const user = data.user;
      login(user); // guardamos en contexto + localStorage

      // Si es admin lleva al dashboard, si no al inicio
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      let message = t("login.errors.loginError");

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      }

      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-2 text-white tracking-wide">
          {t("login.title")}
        </h2>
        <p className="text-center text-gray-300 mb-6 text-sm">
          {t("login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder={t("login.emailPlaceholder")}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder={t("login.passwordPlaceholder")}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-2"
          >
            {t("login.submitButton")}
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          {t("login.registerPrompt")}{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-green-400 hover:text-green-500 cursor-pointer font-semibold"
          >
            {t("login.registerAction")}
          </span>
        </p>
      </div>
    </div>
  );
}
