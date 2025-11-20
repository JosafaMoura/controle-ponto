import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../imagens/logo/Logotipo.png";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";

export default function Login() {
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(false);

    try {
      const resp = await axios.post(`${API}/api/usuarios/login`, {
        email,
        senha,
      });

      localStorage.setItem("auth_user", resp.data.email);
      localStorage.setItem("auth_login_ts", new Date().toISOString());

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
        {/* EMAIL */}
        <div className="campo">
          <label htmlFor="email">E-Mail:</label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* SENHA */}
        <div className="campo">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="politica">
          <input type="checkbox" id="termos" required />
          <label htmlFor="termos">
            Ao continuar, você aceita os termos e políticas.
          </label>
        </div>

        <button type="submit" className="btn-login">Entrar</button>

        <div className="links">
          <Link to="/criar-conta">Criar Conta</Link> |{" "}
          <Link to="/recuperar">Esqueci a senha</Link>
        </div>

        {erro && (
          <div className="erro-login" style={{ color: "crimson", marginTop: 8 }}>
            E-mail ou senha incorretos!
          </div>
        )}
      </form>
    </div>
  );
}

