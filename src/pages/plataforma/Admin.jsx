import { IoReloadCircle } from "react-icons/io5";
import { TbReload } from "react-icons/tb";
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
          <button>
            <IoReloadCircle />
          </button>
          <button>
            <LuDownload /> Exportar Dados
          </button>
        </span>
      </Titulo>
    </>
  );
}
