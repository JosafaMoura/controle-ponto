import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../imagens/logo/Logotipo.png";
import "../css/style.css";

export default function CriarConta() {
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);

    if (!usuario.trim() || !senha.trim()) {
      setMsg("Preencha todos os campos.");
      return;
    }

    try {
      // 1️⃣ Criar usuário
      await axios.post(`${API}/api/usuarios`, {
        usuario,
        senha
      });

      // 2️⃣ Login automático
      const resp = await axios.post(`${API}/api/usuarios/login`, {
        usuario,
        senha
      });

      // 3️⃣ Salvar sessão igual ao Login.jsx
      localStorage.setItem("auth_user", resp.data.usuario);
      localStorage.setItem("auth_login_ts", new Date().toISOString());

      // 4️⃣ Redirecionar para o Dashboard
      Swal.fire("Conta criada!", "Bem-vindo ao sistema!", "success");

      navigate("/dashboard");

    } catch (err) {
      Swal.fire("Erro", "Usuário já existe ou houve falha na criação.", "error");
    }
  }

  return (
    <div className="login-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Grupo Locar</h2>
      </div>

      <h3>Criar uma nova conta</h3>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="usuario">Usuário:</label>
          <input
            id="usuario"
            type="text"
            placeholder="Digite um usuário"
            maxLength="32"
            value={usuario}
            onChange={(e) =>
              setUsuario(e.target.value.toLowerCase())
            }
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha:</label>
          <input
            id="senha"
            type="password"
            placeholder="Senha (máx 16)"
            maxLength="16"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit">Criar Conta</button>

        {msg && (
          <div className="erro-login" style={{ marginTop: "8px" }}>
            {msg}
          </div>
        )}

        <div className="links">
          <Link to="/">Voltar para Login</Link>
        </div>
      </form>
    </div>
  );
}
