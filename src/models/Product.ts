import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    // Legacy fields (for backward compatibility)
    name: { type: String },
    descripcion: { type: String },
    // New multilingual fields
    name_es: { type: String },
    name_en: { type: String },
    descripcion_es: { type: String },
    descripcion_en: { type: String },
    precio: { type: Number },
    categoria: { type: String },
    image: { type: String },
    stock: { type: Number, default: 0 },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { versionKey: false, 
    timestamps: true,
    collection: "products" }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
