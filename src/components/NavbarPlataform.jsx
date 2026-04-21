import { LuLayoutDashboard } from "react-icons/lu";
import { LuClipboardCheck } from "react-icons/lu";
import { LuImage } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { RxPeople } from "react-icons/rx";
import { LuSettings } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { MdPerson } from "react-icons/md";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavbarPlataform() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const baseRotas = [
    { icon: <LuLayoutDashboard />, rota: "/plataforma/dashboard" },
    { icon: <LuClipboardCheck />, rota: "/plataforma/questionario" },
    { icon: <LuImage />, rota: "/plataforma/evidencias" },
    { icon: <LuShieldCheck />, rota: "/plataforma/trust-validacao" },
    { icon: <RxPeople />, rota: "/plataforma/convites" },
  ];

  const rotas =
    user && user.admin
      ? [...baseRotas, { icon: <LuSettings />, rota: "/plataforma/admin" }]
      : baseRotas;

  const isActive = (rota) => location.pathname.startsWith(rota);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* NAVBAR DESKTOP – BARRA LATERAL */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-20 flex-col gap-6 items-center border-r border-slate-200 bg-slate-50 py-6 z-40">
        <span className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
          4U
        </span>
        <nav className="flex-1 flex flex-col items-center gap-4">
          {rotas.map((item, index) => (
            <Link
              key={index}
              to={item.rota}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 text-2xl
                ${
                  isActive(item.rota)
                    ? "bg-emerald-100 text-emerald-600"
                    : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                }
              `}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 text-2xl"
          onClick={handleLogout}
        >
          <LuLogOut />
        </button>
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
          <MdPerson />
        </div>
      </aside>

      {/* NAVBAR MOBILE – BARRA INFERIOR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-slate-200 bg-slate-50 z-40">
        <div className="flex items-center justify-between p-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
            <MdPerson />
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            {rotas.map((item, index) => (
              <Link
                key={index}
                to={item.rota}
                className={`w-10 h-10 flex items-center justify-center rounded-2xl text-xl
                  ${
                    isActive(item.rota)
                      ? "bg-emerald-100 text-emerald-600"
                      : "text-slate-400"
                  }
                `}
              >
                {item.icon}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-400 text-xl"
            onClick={handleLogout}
          >
            <LuLogOut />
          </button>
        </div>
      </nav>
    </>
  );
}
