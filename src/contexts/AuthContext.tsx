"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

export type Role = "admin" | "client" | "cliente";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "authUser";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // Sincronizar con localStorage y NextAuth
  useEffect(() => {
    const syncUser = async () => {
      // Primero intentar obtener de localStorage
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        try {
          const parsed: AuthUser = JSON.parse(stored);
          setUser(parsed);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setLoading(false);
        return;
      }

      // Si no hay usuario en localStorage pero hay sesión de NextAuth
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch(`/api/user/me?email=${session.user.email}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }

      setLoading(false);
    };

    syncUser();
  }, [session, status]);

  const login = (authUser: AuthUser) => {
    setUser(authUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    }
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("lookgod_cart");
      window.localStorage.removeItem("lookgod_cupon");
    }
    // También cerrar sesión de NextAuth
    await signOut({ redirect: false });
  };

  const isAdmin = () => user?.role === "admin";

  const value: AuthContextType = {
    user,
    loading: loading || status === "loading",
    isAuthenticated: Boolean(user),
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
