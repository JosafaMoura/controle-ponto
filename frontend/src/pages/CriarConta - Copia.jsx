import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// helpers locais (mesmas regras do backend)
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
    senha: "",
    endereco: "",
    cidade: "",
    bairro: "",
    estado: "",
    cep: ""
  });

  const [msg, setMsg] = useState(null);

  function handleChange(e) {
    const { id, value } = e.target;
    let v = value;

    if (id === "usuario") v = sanitizeUsuario(v);
    if (id === "endereco") v = toTitleCaseNoDiacritics(v).slice(0, 35);
    if (id === "cidade") v = toTitleCaseNoDiacritics(v).slice(0, 20);
    if (id === "bairro") v = toTitleCaseNoDiacritics(v).slice(0, 20);
    if (id === "estado") v = sanitizeEstado(v);
    if (id === "cep") v = formatCEP(v);

    if (id === "senha") {
      v = v.slice(0, 16); // limite de 16
    }

    setForm((f) => ({ ...f, [id]: v }));
  }

  function camposFaltando() {
    const faltando = [];
    if (!form.usuario) faltando.push("Usuário");
    if (!form.senha) faltando.push("Senha");
    // if (!form.endereco) faltando.push("Endereço");
    // if (!form.cidade) faltando.push("Cidade");
    // if (!form.bairro) faltando.push("Bairro");
    // if (!form.estado) faltando.push("Estado (UF)");
    // if (!form.cep) faltando.push("CEP");
    return faltando;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);

    // valida campos vazios e informa quais faltam
    const faltando = camposFaltando();
    if (faltando.length) {
      Swal.fire("Atenção", `Preencha: ${faltando.join(", ")}.`, "warning");
      return;
    }

    try {
      // Validações rápidas no front
      if (!/^[a-z]{1,12}$/.test(form.usuario)) throw new Error("Usuário inválido.");
      if (!form.senha || form.senha.length > 16) throw new Error("Senha inválida (1 a 16).");
      // if (!/^\d{2}\.\d{3}-\d{3}$/.test(form.cep)) throw new Error("CEP inválido.");
      // if (!/^[A-Z]{2}$/.test(form.estado)) throw new Error("Estado inválido.");

      const payload = { ...form };
      const { data } = await axios.post(`${API}/api/usuarios`, payload);

      // sucesso: swal e limpar
      Swal.fire("Usuário cadastrado!", data?.message || "Cadastro realizado com sucesso.", "success");
      // setMsg({ type: "ok", text: data.message || "Usuário criado." });
      // setForm({ usuario: "", senha: "", endereco: "", cidade: "", bairro: "", estado: "", cep: "" });
      setForm({ usuario: "", senha: "" });
    } catch (err) {
      setMsg({ type: "err", text: err.response?.data?.error || err.message || "Erro ao criar usuário." });
      Swal.fire("Erro", err.response?.data?.error || err.message || "Erro ao criar usuário.", "error");
    }
  }

  function onCancel(e) {
    e.preventDefault();
    navigate("/"); // volta para a tela de login
  }

  // === Estilos  ===
  const pageStyle = {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#000000",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "24px"
  };

  // card com borda, largura máx 500px, sem incluir o título
  const cardStyle = {
    width: "100%",
    maxWidth: "800px",
    border: "1px solid #000",
    borderRadius: "8px",
    padding: "16px",
    boxSizing: "border-box"
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "12px",
    fontWeight: 700
  };

  const rowStyle = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 };

  // larguras por campo (em ch, conforme limites)
  const widths = {
    usuario: "17ch",
    senha: "17ch",
    // endereco: "35ch",
    // cidade: "35ch",
    // bairro: "35ch",
    // estado: "5ch",
    // cep: "15ch"
  };

  const inputBase = {
    padding: "8px",
    border: "1px solid #000",
    borderRadius: "6px",
    color: "#000",
    background: "#fff",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const btnRow = {
    display: "flex",
    gap: "10px",
    marginTop: "12px"
  };

  const btn = {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #000",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: 600
  };

  // linha com Estado e CEP lado a lado, com espaço de 50px entre eles
  const ufCepRow = {
    display: "flex",
    alignItems: "flex-start",
    gap: "50px",
    marginBottom: 10
  };

  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h2 style={titleStyle}>Cadastro de Usuário</h2>
        <div style={cardStyle}>
          <form onSubmit={onSubmit}>
            <div style={rowStyle}>
              {/* <label htmlFor="usuario">Usuário:</label> */}
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
              {/* <label htmlFor="senha">Senha (máx 16):</label> */}
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

            {/* <div style={rowStyle}>
              <input
                id="endereco"
                placeholder="Endereço"
                value={form.endereco}
                onChange={handleChange}
                maxLength={35}
                style={{ ...inputBase, width: widths.endereco }}
              />
            </div> */}

            {/* <div style={rowStyle}>
              <input
                id="cidade"
                placeholder="Cidade"
                value={form.cidade}
                onChange={handleChange}
                maxLength={20}
                style={{ ...inputBase, width: widths.cidade }}
              />
            </div> */}

            {/* <div style={rowStyle}>
              <input
                id="bairro"
                placeholder="Bairro"
                value={form.bairro}
                onChange={handleChange}
                maxLength={20}
                style={{ ...inputBase, width: widths.bairro }}
              />
            </div> */}

            {/* <div style={ufCepRow}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  id="estado"
                  placeholder="UF"
                  value={form.estado}
                  onChange={handleChange}
                  maxLength={2}
                  style={{ ...inputBase, width: widths.estado, textTransform: "uppercase" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  id="cep"
                  placeholder="CEP"
                  value={form.cep}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={12}
                  style={{ ...inputBase, width: widths.cep }}
                />
              </div>
            </div> */}

            <div style={btnRow}>
              <button type="submit" style={btn}>Salvar</button>
              <button type="button" onClick={onCancel} style={btn}>Cancelar</button>
            </div>
          </form>

          {msg && (
            <div
              style={{
                marginTop: 12,
                color: msg.type === "ok" ? "green" : "crimson",
                fontWeight: 600
              }}
            >
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- OPCIONAL: StarPasswordInput -------------------- */
// Para EXIBIR '*' por caractere (não o • do navegador), use esse componente.
// ATENÇÃO: use só se necessário. Por segurança, prefira <input type="password" />.
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


