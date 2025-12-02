import mongoose, { Schema, model, models } from "mongoose";
import { number } from "yup";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String }, // Optional profile photo
    phone: { type: String, required: false }, // Changed to String for better phone handling
    role: { type: String, default: "client" }, // Changed default to "client" to match other parts of the app
    cart: { type: Array, default: [] }, // Array of { productId, quantity }

    // If user creates a store, save store reference here
    tiendaId: { type: Schema.Types.ObjectId, ref: "Tienda", default: null },
  },
  {
    timestamps: true,
    collection: "users",
  }

);

//  Force exact collection name "users"
const User = models.User || model("User", userSchema);
export default User;
