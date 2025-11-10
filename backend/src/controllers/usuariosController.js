// backend/src/controllers/usuariosController.js export async function loginUsuario
import Usuario from "../models/Usuario.js";
import { emailTransporter } from "../services/emailService.js"; //Importando o aquivo service.js 

export async function criarUsuario(req, res) {
  try {
    const { usuario, senha } = req.body;

    // Agora só exigimos usuario e senha
    if (!usuario || !senha) {
      return res.status(400).json({ error: "Informe usuario e senha." });
    }

    // Checa duplicidade
    const jaExiste = await Usuario.findOne({ usuario: (usuario || "").toLowerCase() });
    if (jaExiste) {
      return res.status(409).json({ error: "Usuário já existe." });
    }

    // Cria somente com usuario e senha
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

export async function loginUsuario(req, res) {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(400).json({ error: "Informe usuario e senha." });

    const u = await Usuario.findOne({ usuario: (usuario || "").toLowerCase() });
    if (!u) return res.status(401).json({ error: "Usuário ou senha incorretos." });

    const ok = await u.compareSenha(senha);
    if (!ok) return res.status(401).json({ error: "Usuário ou senha incorretos." });

    /* =========================
       ✅ Envio do e-mail
    ========================= */
    try {
      await emailTransporter.sendMail({
        from: `"Controle de Ponto" <${process.env.MAIL_USER}>`,
        to: "EMAIL_DO_USUARIO_AQUI", // depois vamos usar o email real
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

    /* =========================
       ✅ Retorno final
    ========================= */
    return res.status(200).json({ message: "Login OK", usuario: u.usuario });

  } catch (err) {
    return res.status(500).json({ error: "Erro no login." });
  }
}
