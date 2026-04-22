import { LuShieldCheck } from "react-icons/lu";

import Titulo from "../../components/Titulo";

export default function Evidencias() {
  return (
    <>
      <Titulo
        titulo="Gestão de Evidências"
        subtitulo="Comprove suas ações ESG para aumentar sua confiabilidade e score."
      >
        <div className="bg-emerald-100 rounded-2xl border border-emerald-200 p-4 flex items-center gap-3">
          <LuShieldCheck className="text-emerald-600" size={28}/>
          <div>
            <p className="text-xs text-emerald-800 font-bold">MULTIPLICADOR ATIVO</p>
            <h3 className="text-xl text-emerald-600 font-bold">1.5x por evidência</h3>
          </div>
        </div>
      </Titulo>
    </>
  );
}
