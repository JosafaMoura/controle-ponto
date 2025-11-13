import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../imagens/logo/Logotipo.png";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";

export default function Login() {
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  // Estilo exclusivo da página de Login
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(false);

    try {
      const payload = { usuario, senha };

      // Faz login e obtém a resposta do backend
      const resp = await axios.post(`${API}/api/usuarios/login`, payload);

      // Salva o usuário vindo DA API, não o digitado
      localStorage.setItem("auth_user", resp.data.usuario);
      localStorage.setItem("auth_login_ts", new Date().toISOString());

      // Redireciona para o DASHBOARD do CRM
      navigate("/dashboard");

    } catch (err) {
      setErro(true);
      setTimeout(() => setErro(false), 3000);
    }
  }

  return (
    <div className="login-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Grupo Locar</h2>
      </div>

      <h3>Insira seu E-mail e Senha</h3>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="usuario">E-mail:</label>
          <input
            type="text"
            id="usuario"
            placeholder="email@example.com"
            required
            autoComplete="username"
            inputMode="email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value.slice(0, 16))}
          />
        </div>

        <div className="politica">
          <input type="checkbox" id="termos" required />
          <label htmlFor="termos">
            Ao clicar em continuar, você concorda com os nossos
            <a href="#"> termos de serviço</a> e
            <a href="#"> políticas de privacidade</a>.
          </label>
        </div>

        <button type="submit" className="btn-login">Entrar</button>

        <div className="links">
          <Link to="/criar-conta">Criar Conta</Link> |{" "}
          <Link to="/recuperar">Esqueci a senha</Link>
        </div>

        {erro && (
          <div
            className="erro-login"
            style={{
              color: "crimson",
              marginTop: 8,
              fontWeight: 600,
            }}
          >
            Usuário ou senha incorretos!
          </div>
        )}
      </form>
    </div>
  );
}

