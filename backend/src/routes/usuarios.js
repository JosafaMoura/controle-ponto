// backend/src/routes/usuarios.js
import { Router } from "express";
import { validarTokenReset } from "../controllers/usuariosController.js";
import {
  criarUsuario,
  loginUsuario,
  solicitarResetSenha,
  redefinirSenha
} from "../controllers/usuariosController.js";

const router = Router();

// Criar usuário
router.post("/", criarUsuario);

// Login
router.post("/login", loginUsuario);

// Recuperação de senha — solicita token
router.post("/recuperar", solicitarResetSenha);

// Redefinir senha — usando token
router.post("/resetar/:token", redefinirSenha);

router.get("/resetar/validar/:token", validarTokenReset);

export default router;
