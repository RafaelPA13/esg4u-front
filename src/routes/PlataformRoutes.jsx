import NavbarPlataform from "../components/NavbarPlataform";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PlataformRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
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
      <main className="pb-16 px-8 pt-8 flex flex-col gap-6 md:w-[70%] md:mx-auto md:pb-0 md:px-0">
        <div>
          <h1 className="text-2xl text-slate-800 font-bold">Olá, {user ? user.nome : "Usuário" }!</h1>
          <p className="text-slate-500">Acompanhe sua jornada ESG hoje.</p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
