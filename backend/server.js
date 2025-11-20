// backend/server.js

// ===============================
//  Carregar variáveis de ambiente (.env)
// ===============================
import dotenv from "dotenv";
dotenv.config();

// ===============================
//  Imports principais
// ===============================
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import usuariosRoutes from "./src/routes/usuarios.js";

// ===============================
//  Iniciar Express
// ===============================
const app = express();

// ===============================
//  CORS
// ===============================
const DEFAULT_ORIGIN = "http://localhost:3000";

const allowedOrigins = (process.env.CORS_ORIGIN || DEFAULT_ORIGIN)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.set("trust proxy", true);

// ===============================
//  MongoDB (Atlas)
// ===============================
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  console.error("❌ ERRO: MONGODB_URI não encontrado no .env");
  process.exit(1);
}

mongoose.set("strictQuery", true);

// ===============================
//  Healthcheck
// ===============================
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    cors: allowedOrigins,
    db: mongoose.connection?.name || null,
  });
});

// ===============================
//  Rotas
// ===============================
app.use("/api/usuarios", usuariosRoutes);

// ===============================
//  Inicialização do servidor
// ===============================
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      ...(DB_NAME ? { dbName: DB_NAME } : {}),
      serverSelectionTimeoutMS: 15000,
    });

    const conn = mongoose.connection;
    console.log("✅ MongoDB conectado com sucesso!");
    console.log(`🗄️ Banco selecionado: ${conn.name}`);

    const PORT = Number(process.env.PORT || 8080);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`🔓 CORS liberado para: ${allowedOrigins.join(", ")}`);
    });
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err.message);

    if (
      err?.name === "MongoServerSelectionError" &&
      /ETIMEOUT|ENOTFOUND|EAI_AGAIN|queryTxt/i.test(err.message || "")
    ) {
      console.error(
        "💡 Possível problema de DNS. Execute no PowerShell:\n" +
          "   nslookup grupolocar.igzhyps.mongodb.net\n" +
          "E verifique DNS: 8.8.8.8 / 1.1.1.1"
      );
    }

    process.exit(1);
  }
}

startServer();
