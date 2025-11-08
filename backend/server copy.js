// server.js
require("dotenv").config();
const express = require("express");
const connectToMongo = require("./conexao"); // Importa a função de conexão
const cors = require("cors");

const app = express();

// Porta: usa ambiente ou 8080 (não conflita com Vite 3000)
const port = Number(process.env.PORT || 8080);

// CORS: origem configurável ou liberado no dev
const corsOrigin = process.env.CORS_ORIGIN || true;
app.use(cors({ origin: corsOrigin, credentials: true }));

app.set("trust proxy", true);
app.use(express.json());

// Pequena helper para listar rotas montadas (evita ReferenceError)
function collectRoutes() {
  const prefixes = [];
  const endpoints = [];

  function parseLayer(path, layer) {
    if (layer.route) {
      const routePath = path + (layer.route.path || "");
      const methods = Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());
      endpoints.push({ path: routePath, methods });
    } else if (layer.name === "router" && layer.handle.stack) {
      layer.handle.stack.forEach((l) => parseLayer(path + (layer.regexp?.fast_slash ? "" : (layer.regexp?.source || "")), l));
    }
  }

  if (app._router && app._router.stack) {
    app._router.stack.forEach((layer) => {
      if (layer?.handle?.name === "router") {
        prefixes.push(layer.regexp?.source || "(desconhecido)");
      }
      parseLayer("", layer);
    });
  }
  return { prefixes, endpoints };
}

let db; // Variável para armazenar a conexão com o banco de dados

// Função para iniciar o servidor
async function startServer() {
  // Conecta ao MongoDB antes de iniciar o servidor
  db = await connectToMongo();

  if (!db) {
    console.error("Não foi possível conectar ao banco de dados. O servidor não será iniciado.");
    return;
  }

  // Deixa o db acessível nas rotas
  app.locals.db = db;
  app.use((req, _res, next) => {
    req.db = db;
    next();
  });

  // --- Rotas da API ---

  // Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({
      ok: true,
      port,
      corsOrigin,
      db: !!req.db,
      time: new Date().toISOString(),
    });
  });

  // Rota GET de teste
  app.get("/", (req, res) => {
    res.send("Servidor Express rodando!");
  });

  // Rota POST para adicionar um documento
  app.post("/documentos", async (req, res) => {
    try {
      const collection = db.collection("site");
      const novoDoc = req.body;
      const result = await collection.insertOne(novoDoc);
      res.status(201).json({
        mensagem: "Documento adicionado!",
        documento: result.insertedId, // Retorna o documento inserido
      });
    } catch (error) {
      res.status(500).json({ mensagem: "Erro ao adicionar documento.", erro: error.message });
    }
  });

  // Rota GET para buscar todos os documentos
  app.get("/documentos", async (_req, res) => {
    try {
      const collection = db.collection("site");
      const documentos = await collection.find({}).toArray();
      res.status(200).json(documentos);
    } catch (error) {
      res.status(500).json({ mensagem: "Erro ao buscar documentos.", erro: error.message });
    }
  });

  // 🔌 Monta rotas de usuários se existirem (não quebra se ainda não criou)
  try {
    const usuariosRoutes = require("./routes/usuarios");
    app.use("/api/usuarios", usuariosRoutes);
  } catch (e) {
    console.warn("(/api/usuarios) Rotas de usuários não encontradas. Pulei montagem.");
  }

  // Inicialização do servidor
  app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://0.0.0.0:${port}`);
    const { prefixes, endpoints } = collectRoutes();
    console.log("🔧 Prefixos montados via app.use:", prefixes.length ? prefixes : "(nenhum)");
    console.log("🔧 Endpoints detectados:", endpoints.length ? endpoints : "(nenhum)");
  });
}

// Chama a função para iniciar o servidor
startServer();
