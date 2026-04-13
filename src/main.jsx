import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// Páginas
import LandingPage from "./pages/LandingPage";

// Páginas de Autenticação
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";

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
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);