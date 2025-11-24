"use client";

import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import LanguageSelector from "@/components/LanguageSelector";

export default function NavMain() {
  const { user, loading, logout } = useSession();
  const { cart } = useCart();
  const router = useRouter();

  if (loading) {
    return (
      <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold">
          <span className="text-white">look</span>
          <span className="text-gray-300">GOD</span>
        </Link>
        <div className="text-gray-400">Cargando...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold hover:text-green-400 transition-colors">
        <span className="text-white">look</span>
        <span className="text-gray-300">GOD</span>
      </Link>
      
      <ul className="flex gap-6 items-center">
        <li>
          <LanguageSelector />
        </li>
        <li>
          <Link href="/" className="hover:text-green-400 transition-colors">
            Inicio
          </Link>
        </li>
        
        <li>
          <Link href="/collections" className="hover:text-green-400 transition-colors">
            Colección
          </Link>
        </li>
        <li>
          <Link href="/cart" className="hover:text-green-400 transition-colors relative">
            Carrito
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        </li>

        {user ? (
          <>
            {user.role === "tienda" || user.role === "seller" ? (
              <li>
                <Link href="/store/dashboard" className="hover:text-green-400 transition-colors">
                  Mi Negocio
                </Link>
              </li>
            ) : null}
            {user.tiendaId && (
              <li>
                <Link href="/collections/my-collections" className="hover:text-green-400 transition-colors">
                  Mis Colecciones
                </Link>
              </li>
            )}
            <li>
              <Link href="/profile" className="hover:text-green-400 transition-colors">
                Perfil
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gray-300">
                Hola, <span className="text-green-400 font-semibold">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login" className="hover:text-green-400 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link 
                href="/register" 
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                Registrarme
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
