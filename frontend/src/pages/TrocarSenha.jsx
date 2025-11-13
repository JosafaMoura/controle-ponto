import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../imagens/logo/Logotipo.png";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../css/style.css";

export default function TrocarSenha() {
  const { token } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  // aplicar estilo do login
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
      await axios.post(`${API}/api/usuarios/resetar/${token}`, {
        novaSenha: senha,
      });

      setMsg("Senha redefinida com sucesso! Redirecionando...");

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMsg("Token inválido ou expirado.");
    }
  }

  return (
    <div className="login-container">
      {/* HEADER igual ao login */}
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Grupo Locar</h2>
      </div>

      <h3>Criar nova senha</h3>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="senha">Nova senha:</label>
          <input
            id="senha"
            type="password"
            placeholder="Digite a nova senha"
            required
            maxLength="16"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-login">
          Salvar nova senha
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

