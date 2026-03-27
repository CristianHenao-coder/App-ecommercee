import mongoose, { Schema, model, models } from "mongoose";

const shippingZoneSchema = new Schema(
  {
    nombre: { type: String, required: true }, // Ej: "Medellín y municipios"
    costo: { type: Number, required: true }, // Costo en COP
    ciudades: [{ type: String }], // Lista de ciudades cubiertas
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "shippingzones",
  }
);

const ShippingZone = models.ShippingZone || model("ShippingZone", shippingZoneSchema);
export default ShippingZone;
