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
      <main className="pb-16 md:pl-20">
        <Outlet />
      </main>
    </div>
  );
}
