import { BiLeaf } from "react-icons/bi";
import { GrFavorite } from "react-icons/gr";
import { GoLaw } from "react-icons/go";

export default function BarraProgresso({
  total = 0,
  atual = 0,
  porcentagem_conclusao = "0%",
  eixo,
  tema,
}) {
  const percNumber =
    Number(String(porcentagem_conclusao).replace("%", "")) || 0;
  const progresso = Math.min(Math.max(percNumber, 0), 100);

  const eixoLower = (eixo || "").toLowerCase();

  let Icon = null;
  let badgeClasses = "bg-slate-200 text-slate-700";

  if (eixoLower === "ambiental") {
    Icon = BiLeaf;
    badgeClasses = "bg-emerald-600 text-white";
  } else if (eixoLower === "social") {
    Icon = GrFavorite;
    badgeClasses = "bg-rose-600 text-white";
  } else if (eixoLower === "governança" || eixoLower === "governanca") {
    Icon = GoLaw;
    badgeClasses = "bg-sky-500 text-white";
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-50 rounded-2xl shadow-sm px-6 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-xl ${badgeClasses}`}
          >
            {Icon && <Icon size={18} />}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500">
              {eixo ? `Eixo ${eixo}`.toUpperCase() : "Eixo"}
            </span>
            {tema && (
              <span className="text-[10px] font-semibold text-slate-800">
                {tema}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end text-xs text-slate-500">
          <span>
            {atual || 0} de {total || 0}
          </span>
          <span className="text-emerald-600 font-semibold">
            {porcentagem_conclusao}
          </span>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  );
}
