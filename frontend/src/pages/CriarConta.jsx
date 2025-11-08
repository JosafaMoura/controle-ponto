import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// helpers existentes (mantidos mesmo que alguns não sejam mais usados)
const removeDiacritics = (s = "") =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ç/gi, "c");

const toTitleCaseNoDiacritics = (s = "") =>
  removeDiacritics(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "")
    .replace(/\S+/g, (w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w));

const sanitizeUsuario = (s = "") =>
  removeDiacritics(s).toLowerCase().replace(/[^a-z]/g, "").slice(0, 12);

const sanitizeEstado = (s = "") =>
  removeDiacritics(s).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);

const formatCEP = (digits = "") => {
  const d = (digits.match(/\d/g) || []).join("").slice(0, 8);
  if (d.length < 8) return d;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}-${d.slice(5)}`;
};

export default function CriarConta() {
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usuario: "",
    senha: ""
  });

  const [msg, setMsg] = useState(null); // {type: 'ok'|'err'|'warn', text: string}

  function handleChange(e) {
    const { id, value } = e.target;
    let v = value;

    if (id === "usuario") v = sanitizeUsuario(v); // minúsculo, sem acentos/ç, só letras, até 12
    if (id === "senha") v = v.slice(0, 16);        // até 16

    setForm((f) => ({ ...f, [id]: v }));
  }

  function camposFaltando() {
    const faltando = [];
    if (!form.usuario) faltando.push("Usuário");
    if (!form.senha) faltando.push("Senha");
    return faltando;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);

    const faltando = camposFaltando();
    if (faltando.length) {
      // mostra mensagem e some em 3s
      setMsg({ type: "warn", text: "Campos obrigatórios ausentes." });
      setTimeout(() => setMsg(null), 3000);
      return;
    }

    try {
      // Validações rápidas no front (apenas os dois campos)
      if (!/^[a-z]{1,12}$/.test(form.usuario)) throw new Error("Usuário inválido.");
      if (!form.senha || form.senha.length > 16) throw new Error("Senha inválida (1 a 16).");

      const payload = { ...form };
      const { data } = await axios.post(`${API}/api/usuarios`, payload);

      Swal.fire("Usuário cadastrado!", data?.message || "Cadastro realizado com sucesso.", "success");
      setForm({ usuario: "", senha: "" });
    } catch (err) {
      const friendly = "Ocorreu um erro no Cadastro.";
      setMsg({ type: "err", text: friendly });
      setTimeout(() => setMsg(null), 3000);
      Swal.fire("Erro", friendly, "error");
    }
  }

  function onCancel(e) {
    e.preventDefault();
    navigate("/"); // volta para a tela de login
  }

  // === Estilos (≥ 1600px, fonte maior) ===
  const pageStyle = {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#000000",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "24px",
    fontSize: "18px",
    lineHeight: 1.3
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "16px",
    fontWeight: 800,
    fontSize: "28px"
  };

  const outerWrapper = { width: "100%", maxWidth: "1600px" };
  const cardStyle = {
    width: "100%",
    maxWidth: "1600px",
    border: "1px solid #000",
    borderRadius: "8px",
    padding: "20px",
    boxSizing: "border-box"
  };

  const rowStyle = { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 };

  const widths = {
    usuario: "17ch",
    senha: "17ch"
  };

  const inputBase = {
    padding: "10px",
    border: "1px solid #000",
    borderRadius: "6px",
    color: "#000",
    background: "#fff",
    fontSize: "18px",
    boxSizing: "border-box"
  };

  const btnRow = {
    display: "flex",
    gap: "12px",
    marginTop: "16px"
  };

  const btn = {
    padding: "12px 18px",
    borderRadius: "6px",
    border: "1px solid #000",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "18px"
  };

  const feedbackStyle = (type) => ({
    marginTop: 14,
    color: type === "ok" ? "green" : type === "warn" ? "#b58900" : "crimson",
    fontWeight: 700
  });

  return (
    <div style={pageStyle}>
      <div style={outerWrapper}>
        <h2 style={titleStyle}>Cadastro de Usuário</h2>

        <div style={cardStyle}>
          <form onSubmit={onSubmit}>
            <div style={rowStyle}>
              <input
                id="usuario"
                placeholder="Usuário"
                value={form.usuario}
                onChange={handleChange}
                autoComplete="username"
                maxLength={12}
                style={{ ...inputBase, width: widths.usuario }}
              />
            </div>

            <div style={rowStyle}>
              <input
                id="senha"
                placeholder="Senha (máx 16)"
                type="password"
                value={form.senha}
                onChange={handleChange}
                autoComplete="new-password"
                maxLength={16}
                style={{ ...inputBase, width: widths.senha }}
              />
            </div>

            <div style={btnRow}>
              <button type="submit" style={btn}>Salvar</button>
              <button type="button" onClick={onCancel} style={btn}>Cancelar</button>
            </div>
          </form>

          {msg && (
            <div style={feedbackStyle(msg.type)}>
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- OPCIONAL: StarPasswordInput (mantido) -------------------- */
export function StarPasswordInput({ id, value, onChange, ...rest }) {
  const display = "*".repeat(value.length);
  function handleKeyDown(e) {
    const key = e.key;
    if (key.length === 1) {
      onChange({ target: { id, value: (value + key).slice(0, 16) } });
      e.preventDefault();
    } else if (key === "Backspace") {
      onChange({ target: { id, value: value.slice(0, -1) } });
      e.preventDefault();
    }
  }
  return (
    <input
      id={id}
      type="text"
      value={display}
      onKeyDown={handleKeyDown}
      onChange={() => {}}
      inputMode="text"
      {...rest}
    />
  );
}
