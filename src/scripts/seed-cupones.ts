import mongoose from "mongoose";
import dotenv from "dotenv";
import Cupon from "../models/Cupon";

dotenv.config();

const cupones = [
  {
    codigo: "BIENVENIDO10",
    descuento: 10,
    tipo: "porcentaje",
    usoMaximo: 100,
    activo: true,
  },
  {
    codigo: "DIOS15",
    descuento: 15,
    tipo: "porcentaje",
    usoMaximo: 50,
    activo: true,
  },
  {
    codigo: "FE20",
    descuento: 20,
    tipo: "porcentaje",
    usoMaximo: 20,
    activo: true,
  },
];

async function seedCupones() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DB_URL;
    if (!mongoUri) {
      throw new Error("MongoDB URI not found");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Conectado a MongoDB");

    for (const cupon of cupones) {
      const exists = await Cupon.findOne({ codigo: cupon.codigo });
      if (!exists) {
        await Cupon.create(cupon);
        console.log(`✅ Cupón ${cupon.codigo} creado`);
      } else {
        console.log(`ℹ️ Cupón ${cupon.codigo} ya existe`);
      }
    }

    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedCupones();
