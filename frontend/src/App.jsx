import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CriarConta from "./pages/CriarConta";
import ControleDePonto from "./pages/ControleDePonto";
import "./css/style.css";

const router = createBrowserRouter(
  [
    { path: "/", element: <Login /> },
    { path: "/criar-conta", element: <CriarConta /> },
    { path: "/controle-de-ponto", element: <ControleDePonto /> },
    { path: "*", element: <Navigate to="/" replace /> }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}
