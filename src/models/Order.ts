import mongoose, { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        total: { type: Number, required: true },
        status: { type: String, default: "pending" }, // pending, paid, shipped, delivered, cancelled
        paymentId: { type: String }, // PayPal Order ID
        paymentStatus: { type: String }, // PayPal status
    },
    {
        timestamps: true,
    }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
