import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/style-dashboard.css";

export default function Index() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);   // menu lateral (mobile)
  const [gestaoOpen, setGestaoOpen] = useState(false); // dropdown Gestão de Ponto (desktop + mobile)

  function logout() {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_login_ts");
    navigate("/");
  }

  // Itens de Gestão de Ponto (reutilizados desktop + mobile)
  const gestaoItens = (
    <>
      <li onClick={() => { navigate("/controle-de-ponto"); setMenuOpen(false); }}>
        Controle de ponto
      </li>
      <li>Solicitações de ajustes</li>
      <li>Banco de horas</li>
      <li>Afastamento de férias</li>
      <li>Escala de folgas</li>
      <li>Espelho de ponto</li>
      <li>Sobreaviso</li>
    </>
  );

  return (
    <div className="dashboard">
      {/* ------- TOPO ------- */}
      <header className="topbar">
        <div className="logo-icon">
          <span className="car-icon">🚗</span>
          <h1>Grupo Locar</h1>
        </div>

        {/* MENU DESKTOP / TABLET */}
        <nav className="menu">
          <div
            className="menu-item"
            onMouseLeave={() => setGestaoOpen(false)}
          >
            <button
              type="button"
              className="menu-button"
              onClick={() => setGestaoOpen(!gestaoOpen)}
            >
              Gestão de Ponto ▾
            </button>

            {gestaoOpen && (
              <div className="menu-dropdown">
                <ul onClick={() => setGestaoOpen(false)}>
                  {gestaoItens}
                </ul>
              </div>
            )}
          </div>

          <button type="button" className="menu-button">
            Relatórios
          </button>

          <button type="button" className="menu-button">
            Cadastro
          </button>
        </nav>

        {/* ÍCONE HAMBÚRGUER (SÓ MOBILE – controlado via CSS) */}
        <div className="menu-icon" onClick={() => setMenuOpen(true)}>
          ☰
        </div>
      </header>

      {/* ------- MENU LATERAL (MOBILE) ------- */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={() => setMenuOpen(false)}>
          ×
        </div>

        <ul>
          <li onClick={() => setGestaoOpen(!gestaoOpen)}>
            Gestão de Ponto {gestaoOpen ? "▲" : "▼"}
          </li>

          {gestaoOpen && gestaoItens}

          <li>Relatórios</li>
          <li>Cadastro</li>
          <li onClick={logout} className="logout-btn">
            Sair
          </li>
        </ul>
      </aside>

      {/* BACKDROP – fecha ao clicar fora (mobile) */}
      {menuOpen && (
        <div className="backdrop" onClick={() => setMenuOpen(false)}></div>
      )}

      {/* ------- CONTEÚDO PRINCIPAL ------- */}
      <main>
        <section className="saudacao">
          <div className="msg">
            <h2>Bom dia!</h2>
            <p>domingo, 9 de novembro de 2025 às 11:25:18</p>
          </div>

          <div className="cards-mini">
            <div className="mini-card atrasados">
              <span>0</span>
              <p>ATRASADOS</p>
            </div>
            <div className="mini-card horas">
              <span>0</span>
              <p>HORAS EXTRAS</p>
            </div>
            <div className="mini-card saida">
              <span>0</span>
              <p>SAÍDA ANTECIPADA</p>
            </div>
          </div>
        </section>

        <section className="filtros">
          <div className="filtro">
            <label>Empregador</label>
            <select>
              <option>Todos os empregadores</option>
            </select>
          </div>

          <div className="filtro">
            <label>Unidade</label>
            <select>
              <option>Todas as unidades</option>
            </select>
          </div>
        </section>

        <section className="cards">
          <div className="card">
            <h3 className="card-title">
              <span className="card-icon horas-icon">⏱️</span>
              Horas Extras
            </h3>
            <p>
              Total de Horas: <strong>0h</strong>
            </p>
            <p>
              Valor Total: <strong style={{ color: "green" }}>R$ 0,00</strong>
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">
              <span className="card-icon intervalo-icon">🍽️</span>
              Intervalo
            </h3>
            <p>
              Em Intervalo: <strong>0</strong>
            </p>
            <p>
              Sem Intervalo: <strong>0</strong>
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">
              <span className="card-icon escala-icon">📊</span>
              Escala
            </h3>
            <p>
              Presentes: <strong>0</strong>
            </p>
            <p>
              Ausentes: <strong>0</strong>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

