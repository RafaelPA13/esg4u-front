import { LuLayoutDashboard } from "react-icons/lu";
import { LuClipboardCheck } from "react-icons/lu";
import { LuImage } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { RxPeople } from "react-icons/rx";
import { LuSettings } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { MdPerson } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavbarPlataform() {
  const [openMenu, setOpenMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
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

  const toggleMenu = (event) => {
    event.stopPropagation();

    if (openMenu) {
      setOpenMenu(false);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    setMenuPos({
      x: rect.right,
      y: rect.top - 8,
    });

    setOpenMenu(true);
  };

  useEffect(() => {
    const closeMenu = () => setOpenMenu(false);

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

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
        <Link
          to="/plataforma/perfil"
          className={`w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl border ${isActive("/plataforma/perfil") ? "border-emerald-500" : "border-transparent hover:border-emerald-300"}`}
        >
          {user?.foto_perfil ? (
            <img
              className="w-full h-full object-cover rounded-full"
              src={user?.foto_perfil}
              alt={`Foto de ${user?.nome}`}
            />
          ) : (
            <MdPerson />
          )}
        </Link>
      </aside>

      {/* NAVBAR MOBILE – BARRA INFERIOR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-slate-200 bg-slate-50 z-40">
        <div className="p-2 flex items-center justify-center gap-2">
          {rotas.map((item, index) => (
            <Link
              key={index}
              to={item.rota}
              className={`w-10 h-10 flex items-center justify-center rounded-2xl text-2xl
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
          <button
            type="button"
            onClick={toggleMenu}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${openMenu ? "bg-emerald-100 text-emerald-600" : "text-slate-400"}`}
          >
            <SlOptions />
          </button>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {openMenu && (
        <div
          className="md:hidden fixed z-50 bg-white rounded-xl shadow border border-slate-100 overflow-hidden"
          style={{
            bottom: "70px",
            right: "12px",
            minWidth: "180px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to="/plataforma/perfil"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => setOpenMenu(false)}
          >
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {user?.foto_perfil ? (
                <img
                  className="w-full h-full object-cover"
                  src={user?.foto_perfil}
                  alt={`Foto de ${user?.nome}`}
                />
              ) : (
                <MdPerson className="text-slate-400" />
              )}
            </span>
            Meu Perfil
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpenMenu(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LuLogOut />
            Sair
          </button>
        </div>
      )}
    </>
  );
}
