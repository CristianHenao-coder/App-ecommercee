"use client";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Product } from "@/interfaces/interfaces";
import { Notificaction } from "@/helpers/utils";
import { getProducts } from "@/services/products";

import { sendContact } from "@/services/contact";
import { registerSchema } from "@/schema/auth.schema";
import axios from "axios";
import router from "next/router";
import * as yup from 'yup';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  

   useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Validar en el FRONT con Yup
      await registerSchema.validate(form, { abortEarly: false });

      // 2. Si todo está bien, llamar al backend
      await axios.post("/api/user", form);

      Notificaction(" Registro exitoso, redirigiendo al login...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: any) {
      // Errores de validación de Yup
      if (err instanceof yup.ValidationError) {
        const msg = err.errors.join(". ");
        setError(msg);
        Notificaction(msg, "error");
        return;
      }

      // Errores del backend (/api/user)
      const msg =
        err?.response?.data?.message ||
        "Error al registrarse. Intenta de nuevo.";
      setError(msg);
      Notificaction(msg, "error");
    }
  };



  return (
    <div className="bg-black text-white min-h-screen">
      {/*  SECCIÓN 1: PORTADA */}
      <section className="relative flex flex-col items-center justify-center text-center py-20">

        {/* TEXTO GIGANTE DE FONDO */}
       <h1 className="absolute top-1/2 -translate-y-1/2 text-[18rem] font-extrabold text-white tracking-tight select-none pointer-events-none flex gap-10">
          <span>LOOK</span>
          <span>GOD</span>
      </h1>

      

        <p className="text-3xl italic mb-6 relative z-10">El Verbo hecho Style</p>

        <img
          src="/image/portada.png"
          alt="LookGod Hero"
          className="w-full max-w-3xl rounded-xl shadow-lg border relative z-10"
        />
      </section>

      {/* SECCIÓN 2: PRODUCTOS */}
      <section className="py-16 bg-white text-black text-center">
        <h2 className="text-4xl font-semibold mb-10">Nuestras Camisetas</h2>
        <p className="max-w-2xl mx-auto mb-12 text-gray-700 italic">
          Inspira con tu vestimenta. Calidad suprema, mensajes eternos. <br />
          Adquiere una camiseta y lleva palabras de bendición contigo. <br />
          Tú eres el mensaje vivo, refleja lo que eres.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-black text-white rounded-xl shadow-lg p-4 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={p.image}
                alt={p.name}
                className="rounded-lg mb-4 w-full h-80 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-gray-300 mb-2">{p.descripcion}</p>
              <p className="text-green-400 font-bold text-lg">
                ${p.precio.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 uppercase">
                {p.categoria}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/*  SECCIÓN 3: CONTACTO */}
      <section className="py-16 px-6 bg-black text-center border-t border-gray-800">
        <h2 className="text-3xl font-semibold mb-8">Contáctanos</h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex flex-col gap-4"
        >
          <input
            name="name"
            placeholder="Tu nombre"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-700 bg-transparent p-2 rounded text-white"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Tu correo"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-700 bg-transparent p-2 rounded text-white"
            required
          />
          <textarea
            name="message"
            placeholder="Escribe tu mensaje..."
            value={form.message}
            onChange={handleChange}
            className="border border-gray-700 bg-transparent p-2 rounded text-white h-32"
            required
          />
          <button
            type="submit"
            className="bg-white text-black py-2 rounded hover:bg-gray-300 font-semibold transition-colors"
          >
            Enviar
          </button>
          {status && (
            <p className="text-sm mt-2 text-gray-400">{status}</p>
          )}
        </form>
      </section>
    </div>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

