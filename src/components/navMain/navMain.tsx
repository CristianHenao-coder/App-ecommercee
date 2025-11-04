"use client";

import Link from "next/link";

export default function NavMain() {
  return (
    <nav className="bg-white-700 text-black px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold"> Ecommerce</h1>
      <ul className="flex gap-6">
        <li>
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
