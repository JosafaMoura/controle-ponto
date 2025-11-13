import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../imagens/logo/Logotipo.png";
import { Link } from "react-router-dom";
import "../css/style.css";

export default function RecuperarSenha() {
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  // Aplicar estilização exclusiva do login
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    try {
      await axios.post(`${API}/api/usuarios/recuperar`, {
        usuario: email,
      });

      setMsg("Um link foi enviado para seu e-mail.");
    } catch (err) {
      setMsg("Usuário não encontrado ou erro ao enviar e-mail.");
    }
  }

  return (
    <div className="login-container">
      {/* HEADER igual ao login */}
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Grupo Locar</h2>
      </div>

      <h3>Recuperar senha</h3>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="email">Digite seu e-mail:</label>
          <input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-login">
          Enviar link
        </button>

        {msg && (
          <p className="erro-login" style={{ marginTop: 12 }}>
            {msg}
          </p>
        )}

        <div className="links">
          <Link to="/">Voltar ao Login</Link>
        </div>
      </form>
    </div>
  );
}
