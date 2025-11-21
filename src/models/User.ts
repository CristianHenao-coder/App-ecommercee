import mongoose, {  Schema, model, models } from "mongoose";
import { number } from "yup";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String }, // foto opcional del perfil
    phone: { type: Number, required: false },
    role: { type: String, default: "cliente" },


    // Si el usuario crea una tienda, guardamos su tienda aquí
    tiendaId: { type: Schema.Types.ObjectId, ref: "Tienda", default: null },
  },
  {
     timestamps: true,
     collection: "users",
  }

);

// 👇 Fuerza el nombre exacto de la colección "users"
const User = models.User || model("User", userSchema);
export default User;
