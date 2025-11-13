import mongoose from "mongoose";

const TokenResetSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // validade de 1 hora
  usado: { type: Boolean, default: false }    // token só funciona 1 vez
});

export default mongoose.model("TokenReset", TokenResetSchema);
