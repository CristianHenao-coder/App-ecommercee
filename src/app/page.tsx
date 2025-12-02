"use client";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Product } from "@/interfaces/interfaces";
import { Notificaction } from "@/helpers/utils";
import { productService } from "@/services/products";
import { sendContact } from "@/services/contact";
import { registerSchema } from "@/schema/auth.schema";
import * as yup from 'yup';
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { getProductName, getProductDescription } from "@/helpers/productI18n";
import Image from "next/image";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const { t, language } = useLanguage();
  const { addItem } = useCart();

  useEffect(() => {
    productService.getAll().then(setProducts).catch(console.error);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(""); // Reset status

    try {

      if (!form.name || !form.email || !form.message) {
        Notificaction(t("home.contactError"), "error");
        return;
      }

      //  2. If everything is OK, call backend
      await sendContact(form);

      setStatus(t("home.contactSuccess"));
      setForm({ name: "", email: "", message: "" });
      Notificaction(t("home.contactSuccess"), "success");

    } catch (err: any) {
      console.error(err);
      setStatus(t("home.contactError"));
      Notificaction(t("home.contactError"), "error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

    {/*  SECTION 1: HERO */}
    <section className="relative flex flex-col items-center justify-center text-center py-20 overflow-hidden">
      {/* H1 solo para SEO, no se ve */}
      <h1 className="sr-only">
        look GOD - {t("home.heroSubtitle")}
      </h1>

      {/* Texto gigante de fondo: look / GOD */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-between px-4 md:px-16">
        <h2
          aria-hidden="true"
          className="text-[24vw] md:text-[11vw] font-extrabold leading-none tracking-tight text-white/60"
        >
          look
        </h2>
        <h2
          aria-hidden="true"
          className="text-[24vw] md:text-[11vw] font-extrabold leading-none tracking-tight text-white/70"
        >
          GOD
        </h2>
      </div>

      {/* Subtítulo encima, centrado */}
      <p className="text-xl italic mb-6 relative z-20">
        {t("home.heroSubtitle")}
      </p>

      {/* Imagen al frente */}
      <div className="relative z-20 w-full max-w-3xl">
        <Image
          src="/image/portada.png"
          alt="LookGod Hero"
          width={1200}
          height={800}
          className="w-full rounded-xl shadow-lg border border-gray-800"
        />
      </div>

      {/* Textos de abajo */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-130 relative z-20">
        <p className="text-sm uppercase tracking-widest">
          {t("home.heroText1")}
        </p>
        <p className="text-sm uppercase tracking-widest">
          {t("home.heroText2")}
        </p>
      </div>
    </section>
      {/*  SECTION 2: PRODUCTS */}
      <section className="py-16 bg-white text-black text-center">
        <h2 className="text-4xl font-semibold mb-10">{t("home.productsTitle")}</h2>
        <p className="max-w-2xl mx-auto mb-12 text-gray-700 italic">
          {t("home.productsText")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-black text-white rounded-xl shadow-lg p-4 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={p.image}
                alt={getProductName(p, language)}
                className="rounded-lg mb-4 w-full h-80 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">{getProductName(p, language)}</h3>
              <p className="text-gray-300 mb-2">{getProductDescription(p, language)}</p>
              <p className="text-green-400 font-bold text-lg">
                ${p.precio.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 uppercase">
                {p.categoria}
              </p>
              <button
                onClick={() => addItem(p)}
                className="mt-4 w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition-colors"
              >
                {t("cart.add")}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/*  SECTION 3: CONTACT */}
      <section className="py-16 px-6 bg-black text-center border-t border-gray-800">
        <h2 className="text-3xl font-semibold mb-8">{t("home.contactTitle")}</h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex flex-col gap-4"
        >
          <input
            name="name"
            placeholder={t("home.contactNamePlaceholder")}
            value={form.name}
            onChange={handleChange}
            className="border border-gray-700 bg-transparent p-2 rounded text-white"
            required
          />
          <input
            name="email"
            type="email"
            placeholder={t("home.contactEmailPlaceholder")}
            value={form.email}
            onChange={handleChange}
            className="border border-gray-700 bg-transparent p-2 rounded text-white"
            required
          />
          <textarea
            name="message"
            placeholder={t("home.contactMessagePlaceholder")}
            value={form.message}
            onChange={handleChange}
            className="border border-gray-700 bg-transparent p-2 rounded text-white h-32"
            required
          />
          <button
            type="submit"
            className="bg-white text-black py-2 rounded hover:bg-gray-300 font-semibold transition-colors"
          >
            {t("home.contactSendButton")}
          </button>
          {status && (
            <p className="text-sm mt-2 text-gray-400">{status}</p>
          )}
        </form>
      </section>
    </div>
  );
}
