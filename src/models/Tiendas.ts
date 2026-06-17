import mongoose, { Schema, model, models } from "mongoose";

const tiendaSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    nombre: { type: String, required: true },

    descripcion: { type: String },

    logo: { type: String },
    banner: { type: String },

    categoria: { type: String },

    redesSociales: {
      instagram: { type: String },
      facebook: { type: String },
      tiktok: { type: String },
      whatsapp: { type: String },
    },

    ubicacion: {
      ciudad: { type: String },
      direccion: { type: String },
    },

    estado: {
      type: String,
      enum: ["activa", "suspendida", "revision"],
      default: "activa",
    },

    productosVendidos: { type: Number, default: 0 },
    calificacionPromedio: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "tiendas",
  }
);

const Tienda = models.Tienda || model("Tienda", tiendaSchema);
export default Tienda;
