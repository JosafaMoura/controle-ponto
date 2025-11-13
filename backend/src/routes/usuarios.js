// backend/src/routes/usuarios.js
import { Router } from "express";

import {
  criarUsuario,
  loginUsuario,
  solicitarResetSenha,
  redefinirSenha
} from "../controllers/usuariosController.js";

const router = Router();

// Criar usuário
router.post("/", criarUsuario); // POST /api/usuarios

// Login
router.post("/login", loginUsuario); // POST /api/usuarios/login

// 🔵 Recuperação de senha — solicita token
router.post("/recuperar", solicitarResetSenha); // POST /api/usuarios/recuperar

// 🔵 Redefinir senha — usando token
router.post("/resetar/:token", redefinirSenha); // POST /api/usuarios/resetar/:token

export default router;
