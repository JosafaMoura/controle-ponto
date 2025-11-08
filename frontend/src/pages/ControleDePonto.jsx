import { useMemo } from "react";

export default function ControleDePonto() {
  const user = localStorage.getItem("auth_user") || "Usuário";
  const ts = localStorage.getItem("auth_login_ts");

  const dataHora = useMemo(() => {
    if (!ts) return "-";
    const d = new Date(ts);
    const fmt = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium"
    });
    return fmt.format(d);
  }, [ts]);

  const page = {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  };

  const box = {
    width: "100%",
    maxWidth: 900,
    border: "1px solid #000",
    borderRadius: 8,
    padding: 16,
    boxSizing: "border-box",
    fontSize: 20
  };

  return (
    <div style={page}>
      <div style={box}>
        <h1 style={{ textAlign: "center", marginBottom: 12 }}>Controle de Ponto</h1>
        <p style={{ textAlign: "center" }}>
          Usuário: <strong>{user}</strong><br />
          Login em: <strong>{dataHora}</strong>
        </p>
      </div>
    </div>
  );
}
