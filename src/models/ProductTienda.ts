import mongoose, { Schema, model, models } from "mongoose";

const productTiendaSchema = new Schema(
  {
    tiendaId: { type: Schema.Types.ObjectId, ref: "Tienda", required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    categoria: { type: String },
    imagenes: [{ type: String }],
    stock: { type: Number, default: 0 },

    // quién creó este producto (el dueño de esa tienda)
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    collection: "producttiendas",
  }
);

const ProductTienda =
  models.ProductTienda || model("ProductTienda", productTiendaSchema);

export default ProductTienda;
