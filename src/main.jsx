import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";

// Páginas
import LandingPage from "./pages/LandingPage";

// Páginas de Autenticação
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import Codigo from "./pages/auth/Codigo";
import ReenviarCodigo from "./pages/auth/ReenviarCodigo";
import SolicitarNovaSenha from "./pages/auth/SolicitarNovaSenha";
import RedefinirSenha from "./pages/auth/RedefinirSenha";

// Páginas da Plataforma
import Dashboard from "./pages/plataforma/Dashboard";
import Questionario from "./pages/plataforma/Questionario";
import Evidencias from "./pages/plataforma/Evidencias";
import TrustValidacao from "./pages/plataforma/TrustValidacao";
import Convites from "./pages/plataforma/Convites";
import Admin from "./pages/plataforma/Admin";

// Rotas
import AuthRoutes from "./routes/AuthRoutes";
import PlataformRoutes from "./routes/PlataformRoutes";

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
        path: "solicitar-nova-senha",
        element: <SolicitarNovaSenha />,
      },
      {
        path: "redefinir-senha",
        element: <RedefinirSenha />,
      }
    ]
  },
  {
    path: "/plataforma",
    element: <PlataformRoutes />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "questionario",
        element: <Questionario />
      },
      {
        path: "evidencias",
        element: <Evidencias />
      },
      {
        path: "trust-validacao",
        element: <TrustValidacao />
      },
      {
        path: "convites",
        element: <Convites />
      },
      {
        path: "admin",
        element: <Admin />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);