// backend/server.js (ES Modules)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Tente usar a estrutura atual (/backend/src). Se você mover para /backend/routes,
// basta ajustar o caminho do import abaixo para './routes/usuarios.js'.
import usuariosRoutes from './src/routes/usuarios.js';

const app = express();

/* =========================
   Configuração de CORS
   ========================= */
const DEFAULT_ORIGIN = 'http://localhost:3000';
const allowedOrigins = (process.env.CORS_ORIGIN || DEFAULT_ORIGIN)
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Permite chamadas do dev server (sem origin) e da lista configurada
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.set('trust proxy', true);

/* =========================
   Conexão MongoDB (Atlas)
   ========================= */
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Defina MONGODB_URI no .env do backend.');
  process.exit(1);
}

mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI, {
  // useNewUrlParser/useUnifiedTopology não são mais necessários nas versões recentes
})
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });

/* =========================
   Rotas
   ========================= */

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    cors: allowedOrigins,
  });
});

// Monte as rotas de usuários (conforme seus arquivos enviados)
app.use('/api/usuarios', usuariosRoutes);

/* =========================
   Inicialização
   ========================= */
const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
  console.log(`🔓 CORS liberado para: ${allowedOrigins.join(', ')}`);
});
