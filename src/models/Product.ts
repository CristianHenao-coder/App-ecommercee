import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String,},
    descripcion: { type: String,  },
    precio: { type: Number,  },
    categoria: { type: String,},
    image: { type: String },
  },
  { versionKey: false, 
    collection: "products" }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
