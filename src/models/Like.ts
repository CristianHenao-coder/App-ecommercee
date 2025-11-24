import mongoose, { Schema, model, models } from "mongoose";

const likeSchema = new Schema(
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
    collection: "likes",
  }
);

// Índice único para evitar duplicados
likeSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Like = models.Like || model("Like", likeSchema);
export default Like;

