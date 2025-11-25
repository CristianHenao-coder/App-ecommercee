import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String,},
    descripcion: { type: String,  },
    precio: { type: Number,  },
    categoria: { type: String,},
    image: { type: String },
    stock: { type: Number, default: 0 },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  { versionKey: false, 
    timestamps: true,
    collection: "products" }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
