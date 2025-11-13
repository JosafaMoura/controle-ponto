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

async function startServer() {
  try {
    // Tenta conectar no MongoDB primeiro
    await mongoose.connect(MONGODB_URI, {
      ...(DB_NAME ? { dbName: DB_NAME } : {}),
      // evita ficar "pendurado" muito tempo tentando selecionar o servidor
      serverSelectionTimeoutMS: 15000,
    });

    const conn = mongoose.connection;
    console.log("✅ MongoDB conectado");
    console.log(`🗄️  Banco atual: ${conn.name}`);

    const PORT = Number(process.env.PORT || 8080);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
      console.log(`🔓 CORS liberado para: ${allowedOrigins.join(", ")}`);
    });
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err.message);

    // Ajuda a entender quando o problema é de DNS/rede (caso do outro notebook)
    if (
      err?.name === "MongoServerSelectionError" &&
      /ETIMEOUT|ENOTFOUND|EAI_AGAIN|queryTxt/i.test(err.message || "")
    ) {
      console.error(
        "💡 Dica: Esse erro normalmente é de DNS/rede. " +
          "Teste `nslookup grupolocar.igzhyps.mongodb.net` no PowerShell " +
          "e verifique DNS (8.8.8.8/1.1.1.1), firewall, VPN e bloqueios de porta 27017."
      );
    }

    process.exit(1);
  }
}

// Inicia tudo
startServer();
