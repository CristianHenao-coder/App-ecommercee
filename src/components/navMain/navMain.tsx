"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function NavMain() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();

  const isAdmin = user?.role === "admin";

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / nombre de la marca */}
        <div className="font-bold text-lg">Ecommerce</div>

        <div className="flex items-center gap-6 text-sm">
          {/* Rutas públicas (todos las ven) */}
          <Link href="/">{t("nav.home")}</Link>
          <Link href="/collections">{t("nav.collection")}</Link>

          {/* Invitado (no autenticado) */}
          {!isAuthenticated && (
            <>
              <Link href="/login">{t("nav.login")}</Link>
              <Link href="/register">{t("nav.register")}</Link>
            </>
          )}

          {/* Usuario autenticado */}
          {isAuthenticated && (
            <>
              {/* Carrito para cualquier usuario logueado */}
              <Link href="/cart" className="relative group flex items-center">
                <span className="hover:text-gray-600 transition-colors">
                  {t("nav.cart")}
                </span>
                {count > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              {/* Dashboard solo para admin */}
              {isAdmin && (
                <Link href="/dashboard">{t("nav.DashboardPage")}</Link>
              )}

              {/* Nombre del usuario / perfil */}
              <Link href="/profile" className="font-semibold max-w-[140px] truncate hover:text-gray-600">
                {user?.name ?? t("nav.profile")}
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className="text-xs text-red-600 hover:text-red-700"
              >
                {t("nav.logout")}
              </button>
            </>
          )}

          {/* Selector de idioma */}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
