 // src/lib/db.ts
import mongoose from "mongoose";

const dbConnection = async () => {

  if (mongoose.connections[0].readyState) return;

  try {
    const mongodbAtlas = process.env.MONGODB_URI || "";

    if (!mongodbAtlas) {
      throw new Error("No se encontró la variable MONGODB_URI en .env");
    }

    await mongoose.connect(mongodbAtlas);
    console.log("DB Online");
  } catch (error) {
    console.error(" Error al conectar a la base de datos:", error);
    throw new Error("Error en la base de datos - Hable con el administrador");
  }
};

export default dbConnection;