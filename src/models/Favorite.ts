import mongoose, { Schema, model, models } from "mongoose";

const favoriteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "favorites",
  }
);

// Índice único para evitar duplicados
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favorite = models.Favorite || model("Favorite", favoriteSchema);
export default Favorite;

