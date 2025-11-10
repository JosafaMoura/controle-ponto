import React from "react";
import "../css/style-dashboard.css";

export default function Index() {
  return (
    <div className="dashboard">

      <header className="topbar">
        <div className="logo-icon">
          <span className="car-icon">🚗</span>
          <h1>Grupo Locar</h1>
        </div>

        <nav className="menu">
          <a href="#">Gestão de Ponto</a>
          <a href="#">Relatórios</a>
          <a href="#">Cadastro</a>
        </nav>

        <div className="menu-icon">☰</div>
      </header>

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
            <h3>Horas Extras</h3>
            <p>Total de Horas: <strong>0h</strong></p>
            <p>Valor Total: <strong style={{ color: "green" }}>R$ 0,00</strong></p>
          </div>

          <div className="card">
            <h3>Intervalo</h3>
            <p>Em Intervalo: <strong>0</strong></p>
            <p>Sem Intervalo: <strong>0</strong></p>
          </div>

          <div className="card">
            <h3>Escala</h3>
            <p>Presentes: <strong>0</strong></p>
            <p>Ausentes: <strong>0</strong></p>
          </div>
        </section>

      </main>
    </div>
  );
}
