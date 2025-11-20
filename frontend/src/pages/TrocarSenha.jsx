import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../imagens/logo/Logotipo.png";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/style.css";

export default function TrocarSenha() {
  const { token } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);

  // estilo da página de login
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  // Verifica token ANTES de mostrar a página
useEffect(() => {
  async function verificar() {
    try {
      const resp = await axios.get(`${API}/api/usuarios/resetar/validar/${token}`);
      setTokenValido(resp.data.valido);
    } catch {
      setTokenValido(false);
    } finally {
      setCarregando(false);
    }
  }
  verificar();
}, [API, token]);


  async function handleSubmit(e) {
    e.preventDefault();

    if (senha.trim().length < 4) {
      Swal.fire("Senha muito curta", "Use pelo menos 4 caracteres.", "warning");
      return;
    }

    try {
      await axios.post(`${API}/api/usuarios/resetar/${token}`, {
        novaSenha: senha,
      });

      Swal.fire("Sucesso!", "Sua senha foi redefinida!", "success");
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      Swal.fire("Erro", "Token inválido ou expirado.", "error");
    }
  }

  /* LOADING */
  if (carregando) {
    return (
      <div className="login-container" style={{ textAlign: "center" }}>
        <h3>verificando usuário...</h3>
      </div>
    );
  }

  /* TOKEN INVÁLIDO */
  if (!tokenValido) {
    return (
      <div className="login-container" style={{ textAlign: "center" }}>
        <h2>Acesso negado inválido ou expirado fale com o suporte</h2>
        <Link to="/recuperar" style={{ marginTop: 12, display: "inline-block" }}>
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="login-container">
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

        <div className="links" style={{ marginTop: 12 }}>
          <Link to="/">Voltar ao Login</Link>
        </div>
      </form>
    </div>
  );
}
