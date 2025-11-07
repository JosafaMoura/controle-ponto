import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios' // 🔹 Importa o Axios front-end

function App() {
  const [count, setCount] = useState(0)
  const [dados, setDados] = useState([])

  // 🔹 Quando o componente for carregado, faz uma requisição ao backend Node
  useEffect(() => {
    axios.get("http://localhost:3000/documentos")
      .then((res) => setDados(res.data))
      .catch((err) => console.error("Erro ao conectar com o backend:", err))
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React + Node + Mongo 🚀</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>

      <p className="read-the-docs">Conectando ao backend:</p>

      <ul>
        {dados.length > 0 ? (
          dados.map((doc, i) => <li key={i}>{JSON.stringify(doc)}</li>)
        ) : (
          <li>Nenhum dado carregado ainda...</li>
        )}
      </ul>
    </>
  )
}

export default App