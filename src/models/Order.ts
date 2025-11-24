import mongoose, { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    compradorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tiendaId: {
      type: Schema.Types.ObjectId,
      ref: "Tienda",
      required: true,
    },
    productos: [
      {
        productoId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
      },
    ],
    montoTotal: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "confirmado", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },
    direccionEnvio: {
      calle: String,
      ciudad: String,
      codigoPostal: String,
      pais: String,
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;

