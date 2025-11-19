// backend/src/controllers/usuariosController.js

import Usuario from "../models/Usuario.js";
import TokenReset from "../models/TokenReset.js";
import crypto from "crypto";
import { emailTransporter } from "../services/emailService.js";

/* ============================================================
   CRIAR USUÁRIO
=============================================================== */
export async function criarUsuario(req, res) {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ error: "Informe usuario e senha." });
    }

    const jaExiste = await Usuario.findOne({ usuario: (usuario || "").toLowerCase() });
    if (jaExiste) {
      return res.status(409).json({ error: "Usuário já existe." });
    }

    const u = new Usuario({ usuario });
    await u.setSenha(senha);
    await u.validate();
    await u.save();

    return res.status(201).json({
      message: "Usuário criado com sucesso.",
      usuario: {
        id: u._id.toString(),
        usuario: u.usuario
      }
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Erro ao criar usuário." });
  }
}

/* ============================================================
   LOGIN
=============================================================== */
export async function loginUsuario(req, res) {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(400).json({ error: "Informe e-mail e senha." });

    const u = await Usuario.findOne({ usuario: (usuario || "").toLowerCase() });
    if (!u) return res.status(401).json({ error: "E-mail ou senha incorretos." });

    const ok = await u.compareSenha(senha);
    if (!ok) return res.status(401).json({ error: "E-mail ou senha incorretos." });

    // EMAIL DE LOGIN (mantido exatamente igual ao seu)
    try {
      await emailTransporter.sendMail({
        from: `"Controle de Ponto" <${process.env.MAIL_USER}>`,
        to: "EMAIL_DO_USUARIO_AQUI",
        subject: "Novo login detectado",
        html: `
          <h3>Olá, ${u.usuario}</h3>
          <p>Acabou de ocorrer um login na sua conta.</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
          <p>Se não foi você, entre em contato com o suporte.</p>
        `,
      });
    } catch (emailErr) {
      console.error("Erro ao enviar email:", emailErr.message);
    }

    return res.status(200).json({ message: "Login OK", usuario: u.usuario });

  } catch (err) {
    return res.status(500).json({ error: "Erro no login." });
  }
}

/* ============================================================
   🔵 SOLICITAR RECUPERAÇÃO DE SENHA (NOVO)
=============================================================== */
export async function solicitarResetSenha(req, res) {
  try {
    const { usuario } = req.body;

    const u = await Usuario.findOne({ usuario });
    if (!u) return res.status(404).json({ error: "Usuário não encontrado." });

    // gerar token
    const token = crypto.randomBytes(32).toString("hex");

    // salvar no banco
    await TokenReset.create({
      usuarioId: u._id,
      token,
      expiresAt: Date.now() + 3600000, // 1 hora
    });

    const link = `${process.env.FRONT_URL}/resetar-senha/${token}`;

    // enviar email
    await emailTransporter.sendMail({
      from: `"Grupo Locar" <${process.env.MAIL_USER}>`,
      to: usuario,
      subject: "Recuperação de Senha",
      html: `
        <h3>Recuperação de Senha</h3>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}">Redefinir Senha</a>
        <p>Este link é válido por 1 hora e só pode ser usado uma vez.</p>
      `,
    });

    return res.json({ message: "E-mail enviado com sucesso." });

  } catch (err) {
    return res.status(500).json({ error: "Erro ao solicitar reset." });
  }
}

/* ============================================================
   🔵 REDEFINIR SENHA COM TOKEN (NOVO)
=============================================================== */
export async function redefinirSenha(req, res) {
  try {
    const { token } = req.params;
    const { novaSenha } = req.body;

    const t = await TokenReset.findOne({ token });

    if (!t) return res.status(400).json({ error: "Token inválido." });
    if (t.usado) return res.status(400).json({ error: "Token já utilizado." });
    if (t.expiresAt < Date.now()) return res.status(400).json({ error: "Token expirado." });

    const u = await Usuario.findById(t.usuarioId);
    if (!u) return res.status(404).json({ error: "Usuário não encontrado." });

    await u.setSenha(novaSenha);
    await u.save();

    t.usado = true;
    await t.save();

    return res.json({ message: "Senha redefinida com sucesso." });

  } catch (err) {
    return res.status(500).json({ error: "Erro ao redefinir senha." });
  }
}
