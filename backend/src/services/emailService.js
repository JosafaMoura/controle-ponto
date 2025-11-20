// backend/src/services/emailService.js
import "dotenv/config";
import { Resend } from "resend";

// Inicializa o Resend com a chave secreta do .env
const resend = new Resend(process.env.RESEND_KEY);

/*
  o mesmo formato do Nodemailer:
  emailTransporter.sendMail({ from, to, subject, html })
*/
export const emailTransporter = {
  async sendMail({ from, to, subject, html }) {
    try {
      const sender = from || process.env.EMAIL_FROM; // fallback

      const result = await resend.emails.send({
        from: sender,
        to,
        subject,
        html,
      });

      console.log("📧 Email enviado:", subject, "→", to);
      return result;
    } catch (err) {
      console.error("❌ Erro ao enviar email:");
      console.error(err);
      throw err;
    }
  },
};
