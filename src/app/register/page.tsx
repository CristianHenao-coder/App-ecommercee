"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { signIn } from "next-auth/react";
import { Notificaction } from "@/helpers/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/button/button";
import { registerSchema } from "@/schema/auth.schema";
import * as yup from "yup";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "client",
  });

  // 👇 guardamos TODOS los errores de Yup
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      console.log("VALIDANDO FORM >>>", form);

      //  1. Validate with Yup
      await registerSchema.validate(form, { abortEarly: false });

      console.log("VALIDATION OK, SENDING TO /api/user");

      //  2. If everything is OK, send to backend
      await authService.register(form);

      Notificaction(t("register.success"), "success");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: any) {
      console.log("ERROR EN REGISTER >>>", err);

      if (err instanceof yup.ValidationError) {
        // Frontend errors (in case form submission is blocked)
        const msgs = err.errors as string[];
        setErrors(msgs);
        Notificaction(t("register.errors.validation"), "error");
        return;
      }

      // Backend errors (/api/user)
      const msg =
        err?.response?.data?.message ||
        t("register.errors.default");
      setErrors([msg]);
      Notificaction(msg, "error");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">
          {t("register.title")}
        </h2>

        {/* noValidate disables browser validation */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <input
            name="name"
            placeholder={t("register.namePlaceholder")}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="email"
            type="email"
            placeholder={t("register.emailPlaceholder")}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="password"
            type="password"
            placeholder={t("register.passwordPlaceholder")}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="phone"
            placeholder={t("register.phonePlaceholder")}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* mostramos TODOS los errores de Yup */}
          {errors.length > 0 && (
            <div className="space-y-1 bg-red-900/30 border border-red-500/50 p-2 rounded-md text-sm text-red-300">
              {errors.map((err, idx) => (
                <p key={idx}>• {err}</p>
              ))}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-2"
          >
            {t("register.submitButton")}
          </Button>
        </form>

        {/* Divider line */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="px-2 text-gray-400 text-sm">{t("register.divider")}</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/*  Google button */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
          />
          {t("register.googleButton")}
        </Button>

        <p className="text-sm text-center mt-6 text-gray-300">
          {t("register.loginPrompt")}{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-400 hover:text-green-500 cursor-pointer font-semibold"
          >
            {t("register.loginAction")}
          </span>
        </p>
      </div>
    </div>
  );
}
