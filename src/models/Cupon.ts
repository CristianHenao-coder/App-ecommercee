import mongoose, { Schema, model, models } from "mongoose";

const cuponSchema = new Schema(
  {
    codigo: { type: String, required: true, unique: true, uppercase: true },
    descuento: { type: Number, required: true }, // Porcentaje (ej: 10 = 10%)
    tipo: { type: String, enum: ["porcentaje", "fijo"], default: "porcentaje" },
    fechaExpiracion: { type: Date },
    activo: { type: Boolean, default: true },
    usoMaximo: { type: Number, default: 100 },
    usoActual: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "cupones",
  }
);

const Cupon = models.Cupon || model("Cupon", cuponSchema);
export default Cupon;
