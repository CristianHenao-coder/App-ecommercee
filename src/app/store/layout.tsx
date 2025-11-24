"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "tienda" && user.role !== "seller"))) {
      router.push("/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!user || (user.role !== "tienda" && user.role !== "seller")) {
    return null;
  }

  const menuItems = [
    { href: "/store/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/store/business", label: "Mi Negocio", icon: "🏪" },
    { href: "/store/products", label: "Productos", icon: "📦" },
    { href: "/store/content", label: "Contenido / Posts", icon: "📸" },
    { href: "/store/wallet", label: "Wallet", icon: "💰" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 border-r border-gray-800 transition-all duration-300 fixed h-screen pt-20`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg"
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

