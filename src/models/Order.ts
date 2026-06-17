import mongoose, { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, required: true }, // Email del usuario para búsquedas
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 15000 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    total: { type: Number, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    },
    shippingAddress: {
      fullName: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      notes: { type: String },
    },
    paymentMethod: { type: String },
    paymentId: { type: String },
    paymentStatus: { type: String },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
