import { useState } from "react";
import axios from "axios";
import logo from "../imagens/logo/Logotipo.png";
import { Link } from "react-router-dom";
// import { StarPasswordInput } from "./CriarConta"; // se quiser usar o campo com '*'

export default function Login() {
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(false);
    try {
      const payload = { usuario, senha };
      await axios.post(`${API}/api/usuarios/login`, payload);
      // sucesso → redirecione para a área logada
      // ex.: window.location.href = "/dashboard";
      console.log("Login OK");
    } catch (err) {
      // mostra erro por 3s
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
            placeholder="endereço@email.com"
            required
            autoComplete="username"
            inputMode="email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha:</label>

          {/* Opção A (recomendada): campo password nativo */}
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value.slice(0, 16))}
          />

          {/* Opção B (se quiser ver '*' por caractere):
          <StarPasswordInput
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          */}
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
          {/* <a href="/criar-conta">Criar Conta</a> */}
          <Link to="/criar-conta">Criar Conta</Link>
        </div>

        <div
          className="erro-login"
          id="erro-login"
          style={{
            display: erro ? "block" : "none",
            color: "crimson",
            marginTop: 8,
            fontWeight: 600
          }}
        >
          Usuário ou senha incorretos!
        </div>
      </form>
    </div>
  );
}
