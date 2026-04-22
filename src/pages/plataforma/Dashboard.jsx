import { PiLightningBold } from "react-icons/pi";

import Titulo from "../../components/Titulo";

export default function Dashboard() {
  return (
    <>
      <Titulo
        titulo="Dashboard ESG"
        subtitulo="Veja seu progresso sustentável."
      >
        <div className="bg-slate-50 p-2 border border-slate-200 rounded-2xl shadow">
          <span className="bg-emerald-100 px-4 py-2 rounded-2xl text-emerald-600 font-bold flex items-center gap-2">
            <PiLightningBold size={18} /> Nível Sustentável
          </span>
        </div>
      </Titulo>
    </>
  );
}
