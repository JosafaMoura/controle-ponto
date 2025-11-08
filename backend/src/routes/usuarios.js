// backend/src/routes/usuarios.js
import { Router } from "express";
import { criarUsuario, loginUsuario } from "../controllers/usuariosController.js";

const router = Router();

router.post("/", criarUsuario);       // POST /api/usuarios
router.post("/login", loginUsuario);  // POST /api/usuarios/login

export default router;
