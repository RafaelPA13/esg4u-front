import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// Páginas
import LandingPage from "./pages/LandingPage";

// Páginas de Autenticação
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import Codigo from "./pages/auth/Codigo";
import ReenviarCodigo from "./pages/auth/ReenviarCodigo";
import RedefinirSenha from "./pages/auth/RedefinirSenha";

// Páginas da Plataforma
import Home from "./pages/plataforma/Home";

// Rotas
import AuthRoutes from "./routes/AuthRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/autenticacao",
    element: <AuthRoutes />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "cadastro",
        element: <Cadastro />,
      },
      {
        path: "validar-codigo",
        element: <Codigo />,
      },
      {
        path: "reenviar-codigo",
        element: <ReenviarCodigo />,
      },
      {
        path: "redefinir-senha",
        element: <RedefinirSenha />,
      }
    ]
  },
  {
    path: "/cliente",
    element: <Home />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);