// backend/server.js (ES Modules)
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import usuariosRoutes from "./src/routes/usuarios.js";

const app = express();

/* =========================
   CORS
   ========================= */
const DEFAULT_ORIGIN = "http://localhost:3000";
const allowedOrigins = (process.env.CORS_ORIGIN || DEFAULT_ORIGIN)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.set("trust proxy", true);

/* =========================
   MongoDB (Atlas)
   ========================= */
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME; // ← força o db correto

if (!MONGODB_URI) {
  console.error("❌ Defina MONGODB_URI no .env do backend.");
  process.exit(1);
}

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB_URI, {
    // forçamos o db alvo mesmo que a URI não tenha o path correto
    ...(DB_NAME ? { dbName: DB_NAME } : {}),
  })
  .then(() => {
    const conn = mongoose.connection;
    console.log("✅ MongoDB conectado");
    console.log(`🗄️  Banco atual: ${conn.name}`);
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no MongoDB:", err.message);
    process.exit(1);
  });

/* =========================
   Rotas
   ========================= */

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    cors: allowedOrigins,
    db: mongoose.connection?.name || null,
  });
});

// Rotas de usuários
app.use("/api/usuarios", usuariosRoutes);

/* =========================
   Inicialização
   ========================= */
const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
  console.log(`🔓 CORS liberado para: ${allowedOrigins.join(", ")}`);
});
