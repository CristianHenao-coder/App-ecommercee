"use client";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Product } from "@/interfaces/interfaces";
import { Notificaction } from "@/helpers/utils";
import { getProducts } from "@/services/products";

import { sendContact } from "@/services/contact";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  

   useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Mostrar texto temporal mientras se envía
  setStatus("Enviando...");

  try {
    await sendContact(form);
    // ✅ Notificación visual
    Notificaction("✅ Gracias por contactarte, pronto te responderemos.", "success");

    // Limpia el formulario
    setForm({ name: "", email: "", message: "" });

    // Oculta el texto “Enviando...” y muestra confirmación simple
    setStatus("Mensaje enviado correctamente ✅");
  } catch (error) {
    console.error(error);
    Notificaction("❌ Error al enviar el mensaje. Intenta nuevamente.", "error");
    setStatus("Error al enviar el mensaje ❌");
  } finally {
    // Borra el estado después de unos segundos para mantener limpio
    setTimeout(() => setStatus(""), 4000);
  }
};


  return (
    <div className="bg-black text-white min-h-screen">
      {/* 🟩 SECCIÓN 1: PORTADA */}
      <section className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-6xl font-extrabold tracking-tight mb-4">
          <span className="text-white">look</span>
          <span className="text-gray-200 ml-2">GOD</span>
        </h1>
        <p className="text-xl italic mb-6"> El Verbo hecho Style </p>
        <img
          src="/images/hero.jpg"
          alt="LookGod Hero"
          className="w-full max-w-3xl rounded-xl shadow-lg border border-gray-800"
        />
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-6">
          <p className="text-sm uppercase tracking-widest">
            Viste con poder ✨
          </p>
          <p className="text-sm uppercase tracking-widest">
            Viste con propósito 🙌
          </p>
        </div>
      </section>

      {/* 🟨 SECCIÓN 2: PRODUCTOS */}
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

      {/* 🟦 SECCIÓN 3: CONTACTO */}
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
