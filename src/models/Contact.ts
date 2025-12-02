import mongoose, { Schema, model, models } from "mongoose";

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },

  
  { timestamps: true,
    collection: "contacts" }
);

const Contact = models.Contact || model("Contact", contactSchema);
export default Contact;
