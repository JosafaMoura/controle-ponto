// frontend/src/App.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import CriarConta from "./pages/CriarConta";
import ControleDePonto from "./pages/ControleDePonto";
import Index from "./pages/index.jsx"; // Seu CRM (dashboard)

// IMPORTS QUE FALTAVAM
import RecuperarSenha from "./pages/RecuperarSenha";
import TrocarSenha from "./pages/TrocarSenha";

// 🔒 ROTA PROTEGIDA — impede acesso sem login
function PrivateRoute({ element }) {
  const user = localStorage.getItem("auth_user");
  return user ? element : <Navigate to="/" replace />;
}

const router = createBrowserRouter(
  [
    // LOGIN (rota inicial)
    { path: "/", element: <Login /> },

    // Criar Conta
    { path: "/criar-conta", element: <CriarConta /> },

    // Recuperação de senha (públicas)
    { path: "/recuperar", element: <RecuperarSenha /> },
    { path: "/resetar-senha/:token", element: <TrocarSenha /> },

    // Dashboard (protegido)
    {
      path: "/dashboard",
      element: <PrivateRoute element={<Index />} />,
    },

    // Controle de Ponto (protegido)
    {
      path: "/controle-de-ponto",
      element: <PrivateRoute element={<ControleDePonto />} />,
    },

    // Rotas inválidas
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}
