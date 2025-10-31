"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const res = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre }),
    });

    const data = await res.json();
    setMensaje(data.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      <input
        type="email"
        placeholder="Tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2 w-full hover:bg-blue-700"
      >
        {loading ? "Enviando..." : "Registrar"}
      </button>

      {mensaje && <p className="text-center mt-2">{mensaje}</p>}
    </form>
  );
}
