import NavbarPlataform from "../components/NavbarPlataform";
import Loading from "../components/Loading";
import Tutorial from "../components/Tutorial";

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function PlataformRoutes() {
  const { user, loading } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!user) return;

    const status = user.status_questionario;
    const jaViu = sessionStorage.getItem("esg4u_tutorial_visto");

    if (!jaViu && (status === "Não Respondido" || status === "Em Andamento")) {
      setShowTutorial(true);
    }
  }, [user]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    sessionStorage.setItem("esg4u_tutorial_visto", "1");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <Loading size={24} borderWidth={2} />
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/autenticacao/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarPlataform />
      <main className="pb-16 px-6 pt-8 flex flex-col gap-6 md:w-[70%] md:mx-auto md:px-0">
        <div>
          <h1 className="text-2xl text-slate-800 font-bold">
            Olá, {user ? user.nome : "Usuário"}!
          </h1>
          <p className="text-slate-500">Acompanhe sua jornada ESG hoje.</p>
        </div>
        <Outlet />
      </main>
      <Tutorial open={showTutorial} onClose={handleCloseTutorial} />
    </div>
  );
}
