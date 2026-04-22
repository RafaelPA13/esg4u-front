import { IoReloadCircle } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";

import Titulo from "../../components/Titulo";

export default function Admin() {
  return (
    <>
      <Titulo
        titulo="Painel Administrativo"
        subtitulo="Gestão centralizada do ecossistema ESG4U."
      >
        <span className="flex items-center gap-6">
          <button className="w-14 h-14 flex items-center justify-center bg-slate-50 p-2 rounded-2xl shadow text-slate-400 transition-colors duration-200 hover:text-emerald-600">
            <IoReloadCircle size={32}/>
          </button>
          <button className="bg-slate-900 px-6 py-3 rounded-2xl text-lg text-slate-50 font-black shadow-xl shadow-slate-300/50 flex items-center gap-2 transition-colors duration-300 hover:bg-slate-800">
            <LuDownload /> Exportar Dados
          </button>
        </span>
      </Titulo>
    </>
  );
}
