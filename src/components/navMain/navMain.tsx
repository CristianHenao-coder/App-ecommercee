"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function NavMain() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <header className="w-full bg-black border-b border-white/10 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tighter">
            <span className="text-white/70 group-hover:text-white transition-colors">look</span>
            <span className="text-white group-hover:text-green-400 transition-colors">GOD</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {/* Public routes */}
          <Link 
            href="/" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            {t("nav.home") || "Inicio"}
          </Link>
          <Link 
            href="/collections" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            {t("nav.collection") || "Colección"}
          </Link>

          {/* Invitado (no autenticado) */}
          {!isAuthenticated && (
            <>
              <Link 
                href="/login" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                {t("nav.login") || "Ingresar"}
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t("nav.register") || "Registrarse"}
              </Link>
            </>
          )}

          {/* Usuario autenticado */}
          {isAuthenticated && (
            <>
              {/* Carrito */}
              <Link 
                href="/cart" 
                className="relative flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>{t("nav.cart") || "Carrito"}</span>
                {count > 0 && (
                  <span className="bg-green-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>

              {/* Mis Pedidos */}
              <Link 
                href="/orders" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Mis Pedidos
              </Link>

              {/* Dashboard solo para admin */}
              {isAdmin && (
                <Link 
                  href="/dashboard" 
                  className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                >
                  ⚡ Admin
                </Link>
              )}

              {/* Perfil */}
              <Link 
                href="/profile" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{user?.name?.[0]?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Salir
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 space-y-4">
          <Link 
            href="/" 
            className="block text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("nav.home") || "Inicio"}
          </Link>
          <Link 
            href="/collections" 
            className="block text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("nav.collection") || "Colección"}
          </Link>

          {!isAuthenticated ? (
            <>
              <Link 
                href="/login" 
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.login") || "Ingresar"}
              </Link>
              <Link 
                href="/register" 
                className="block px-4 py-2 bg-white text-black font-bold rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.register") || "Registrarse"}
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/cart" 
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Carrito ({count})
              </Link>
              <Link 
                href="/orders" 
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mis Pedidos
              </Link>
              {isAdmin && (
                <Link 
                  href="/dashboard" 
                  className="block text-yellow-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚡ Dashboard Admin
                </Link>
              )}
              <Link 
                href="/profile" 
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block text-red-400"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
