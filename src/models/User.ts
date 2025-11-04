import mongoose, {  Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    
      role: {
      type: String,
      enum: ["admin", "client"], 
      default: "client", 
    },


  },
  {
     timestamps: true,
     collection: "users",
  }


);

// 👇 Fuerza el nombre exacto de la colección "users"
const User = models.User || model("User", userSchema);
export default User;
