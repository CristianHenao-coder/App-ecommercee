import mongoose, { Schema, model, models } from "mongoose";

const walletSchema = new Schema(
  {
    tiendaId: {
      type: Schema.Types.ObjectId,
      ref: "Tienda",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0 },
    movements: [
      {
        tipo: {
          type: String,
          enum: ["ingreso", "egreso"],
          required: true,
        },
        monto: { type: Number, required: true },
        descripcion: { type: String, required: true },
        fecha: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    collection: "wallets",
  }
);

const Wallet = models.Wallet || model("Wallet", walletSchema);
export default Wallet;

