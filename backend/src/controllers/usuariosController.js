// backend/src/controllers/usuariosController.js

import Usuario from "../models/Usuario.js";
import TokenReset from "../models/TokenReset.js";
import crypto from "crypto";
import { emailTransporter } from "../services/emailService.js";

/* ============================================================
   🟩 CRIAR USUÁRIO
=============================================================== */
export async function criarUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Informe email e senha." });
    }

    const emailFormatado = email.toLowerCase().trim();

    const existe = await Usuario.findOne({ email: emailFormatado });
    if (existe) {
      return res.status(409).json({ error: "Email já registrado." });
    }

    const novo = new Usuario({ email: emailFormatado });
    await novo.setSenha(senha);
    await novo.save();

    return res.status(201).json({
      message: "Usuário criado com sucesso.",
      usuario: {
        id: novo._id.toString(),
        email: novo.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
}

/* ============================================================
   🟩 LOGIN
=============================================================== */
export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Informe email e senha." });
    }

    const emailFormatado = email.toLowerCase().trim();
    const u = await Usuario.findOne({ email: emailFormatado });

    if (!u) {
      // notificação (email não encontrado)
      try {
        await emailTransporter.sendMail({
          from: `"Grupo Locar" <${process.env.EMAIL_FROM}>`,
          to: emailFormatado,
          subject: "Tentativa de login detectada",
          html: `
            <h3>Tentativa de acesso</h3>
            <p>Uma tentativa de login foi realizada com este e-mail.</p>
            <p>Se não foi você, ignore este aviso.</p>
          `,
        });
      } catch {}

      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    const ok = await u.compareSenha(senha);
    if (!ok) {
      try {
        await emailTransporter.sendMail({
          from: `"Grupo Locar" <${process.env.EMAIL_FROM}>`,
          to: u.email,
          subject: "Senha incorreta",
          html: `
            <h3>Tentativa de login</h3>
            <p>Alguém tentou entrar na sua conta, mas usou uma senha incorreta.</p>
            <p>Se não foi você, recomendamos alterar sua senha.</p>
          `,
        });
      } catch {}

      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // login OK
    try {
      await emailTransporter.sendMail({
        from: `"Grupo Locar" <${process.env.EMAIL_FROM}>`,
        to: u.email,
        subject: "Novo Login Detectado",
        html: `
          <h3>Login realizado</h3>
          <p>Um novo login foi realizado na sua conta.</p>
          <p><strong>Horário:</strong> ${new Date().toLocaleString("pt-BR")}</p>
        `,
      });
    } catch {}

    return res.status(200).json({ message: "Login OK", email: u.email });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no login." });
  }
}

/* ============================================================
   🟦 VALIDAR TOKEN DE RESET (NOVA ROTA)
=============================================================== */
export async function validarTokenReset(req, res) {
  try {
    const { token } = req.params;
    const t = await TokenReset.findOne({ token });

    if (!t) return res.status(400).json({ valido: false });
    if (t.usado) return res.status(400).json({ valido: false });
    if (t.expiresAt < Date.now()) return res.status(400).json({ valido: false });

    return res.json({ valido: true });
  } catch {
    return res.status(500).json({ error: "Erro ao validar token." });
  }
}

/* ============================================================
   🟦 SOLICITAR RESET DE SENHA
=============================================================== */
export async function solicitarResetSenha(req, res) {
  try {
    const { email } = req.body;
    const emailFormatado = (email || "").toLowerCase().trim();

    const u = await Usuario.findOne({ email: emailFormatado });
    if (!u) {
      return res.status(404).json({ error: "Email não encontrado." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await TokenReset.create({
      usuarioId: u._id,
      token,
      expiresAt: Date.now() + 3600000, // 1 hora
    });

    const link = `${process.env.FRONT_URL}/resetar-senha/${token}`;

    await emailTransporter.sendMail({
      from: `"Grupo Locar" <${process.env.EMAIL_FROM}>`,
      to: u.email,
      subject: "Recuperação de Senha",
      html: `
        <h3>Redefinição de Senha</h3>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${link}">Redefinir senha</a>
        <p>Este link expira em 1 hora.</p>
      `,
    });

    return res.json({ message: "E-mail enviado com sucesso." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao solicitar recuperação." });
  }
}

/* ============================================================
   🟦 REDEFINIR SENHA COM TOKEN
=============================================================== */
export async function redefinirSenha(req, res) {
  try {
    const { token } = req.params;
    const { novaSenha } = req.body;

    const t = await TokenReset.findOne({ token });

    if (!t) return res.status(400).json({ error: "Token inválido." });
    if (t.usado) return res.status(400).json({ error: "Token já usado." });
    if (t.expiresAt < Date.now()) return res.status(400).json({ error: "Token expirado." });

    const u = await Usuario.findById(t.usuarioId);
    if (!u) return res.status(404).json({ error: "Usuário não encontrado." });

    await u.setSenha(novaSenha);
    await u.save();

    t.usado = true;
    await t.save();

    // email de confirmação
    try {
      await emailTransporter.sendMail({
        from: `"Grupo Locar" <${process.env.EMAIL_FROM}>`,
        to: u.email,
        subject: "Senha alterada com sucesso",
        html: `
          <h3>Senha atualizada</h3>
          <p>A senha da sua conta foi alterada com sucesso.</p>
          <p>Se você não fez essa alteração, entre em contato imediatamente.</p>
        `,
      });
    } catch {}

    return res.json({ message: "Senha redefinida com sucesso." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao redefinir senha." });
  }
}
