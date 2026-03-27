// Seed de productos para LookGod
// Ejecutar con: npx ts-node src/scripts/seed-products.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";

dotenv.config();

const products = [
  // CAMISETAS OVERSIZE
  {
    name_es: "Camiseta Fe Oversize",
    name_en: "Faith Oversize T-Shirt",
    descripcion_es: "Camiseta oversize de tela peruana premium con diseño de fe. 100% algodón, suave y duradera.",
    descripcion_en: "Premium Peruvian cotton oversize t-shirt with faith design. 100% cotton, soft and durable.",
    precio: 65000,
    categoria: "camisetas",
    stock: 50,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
  },
  {
    name_es: "Camiseta Luz Oversize",
    name_en: "Light Oversize T-Shirt",
    descripcion_es: "Camiseta oversize con mensaje de luz. Tela qatar de alta calidad que no encoge.",
    descripcion_en: "Oversize t-shirt with light message. High-quality Qatar fabric that doesn't shrink.",
    precio: 70000,
    categoria: "camisetas",
    stock: 45,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    name_es: "Camiseta Bendición Oversize",
    name_en: "Blessing Oversize T-Shirt",
    descripcion_es: "Diseño exclusivo con mensaje de bendición. Corte moderno y cómodo.",
    descripcion_en: "Exclusive design with blessing message. Modern and comfortable fit.",
    precio: 75000,
    categoria: "camisetas",
    stock: 40,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
  },
  {
    name_es: "Camiseta Gracia Oversize",
    name_en: "Grace Oversize T-Shirt",
    descripcion_es: "Camiseta oversize premium con diseño minimalista de gracia divina.",
    descripcion_en: "Premium oversize t-shirt with minimalist divine grace design.",
    precio: 68000,
    categoria: "camisetas",
    stock: 55,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
  },
  {
    name_es: "Camiseta Esperanza Oversize",
    name_en: "Hope Oversize T-Shirt",
    descripcion_es: "Lleva esperanza en cada paso. Tela peruana suave al tacto.",
    descripcion_en: "Carry hope in every step. Peruvian fabric soft to the touch.",
    precio: 72000,
    categoria: "camisetas",
    stock: 35,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726a3b?w=800",
  },

  // BUZOS OVERSIZE
  {
    name_es: "Buzo Fe Oversize",
    name_en: "Faith Oversize Hoodie",
    descripcion_es: "Buzo oversize de tela peruana con capucha. Cálido y con diseño de fe.",
    descripcion_en: "Oversize hoodie made of Peruvian fabric. Warm with faith design.",
    precio: 115000,
    categoria: "buzos",
    stock: 30,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
  },
  {
    name_es: "Buzo Amor Oversize",
    name_en: "Love Oversize Hoodie",
    descripcion_es: "Buzo con mensaje de amor divino. Bolsillo frontal y capucha ajustable.",
    descripcion_en: "Hoodie with divine love message. Front pocket and adjustable hood.",
    precio: 120000,
    categoria: "buzos",
    stock: 25,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
  },
  {
    name_es: "Buzo Paz Oversize",
    name_en: "Peace Oversize Hoodie",
    descripcion_es: "Buzo oversize premium que transmite paz. Perfecto para climas frescos.",
    descripcion_en: "Premium oversize hoodie that conveys peace. Perfect for cool weather.",
    precio: 110000,
    categoria: "buzos",
    stock: 28,
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800",
  },

  // CAMISAS CORTAS
  {
    name_es: "Camisa Corta Verdad",
    name_en: "Truth Short Sleeve Shirt",
    descripcion_es: "Camisa corta con estilo único y mensaje de verdad. Fresca y elegante.",
    descripcion_en: "Short sleeve shirt with unique style and truth message. Fresh and elegant.",
    precio: 85000,
    categoria: "camisas",
    stock: 35,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
  },
  {
    name_es: "Camisa Corta Sabiduría",
    name_en: "Wisdom Short Sleeve Shirt",
    descripcion_es: "Camisa corta premium con diseño de sabiduría. Ideal para cualquier ocasión.",
    descripcion_en: "Premium short sleeve shirt with wisdom design. Ideal for any occasion.",
    precio: 90000,
    categoria: "camisas",
    stock: 32,
    image: "https://images.unsplash.com/photo-1607345366928-3ea3ff6e2c3c?w=800",
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DB_URL;
    if (!mongoUri) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Conectado a MongoDB");

    // Limpiar productos existentes (opcional)
    // await Product.deleteMany({});
    // console.log("🗑️ Productos anteriores eliminados");

    // Insertar productos
    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} productos insertados`);

    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedDatabase();
