import { PiLightningBold } from "react-icons/pi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuShieldCheck } from "react-icons/lu";
import { RiQuestionnaireLine } from "react-icons/ri";

import Titulo from "../../components/Titulo";
import Card from "../../components/Card";
import Ranking from "../../components/Ranking";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { dashboardService } from "../../services/apiService";

export default function Dashboard() {
  const { user } = useAuth();

  const [ranking, setRanking] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusCards = [
    {
      icon: <FaArrowTrendUp size={20} className="text-emerald-500" />,
      bgColor: "bg-emerald-100 border-emerald-200",
      title: "SCORE ESG GERAL",
      value: user?.score_esg || "00.0",
    },
    {
      icon: <LuShieldCheck size={20} className="text-sky-500" />,
      bgColor: "bg-sky-100 border-sky-200",
      title: "REPUTAÇÃO",
      value: user?.reputacao || 0,
    },
    {
      icon: <RiQuestionnaireLine size={20} className="text-rose-500" />,
      bgColor: "bg-rose-100 border-rose-200",
      title: "QUESTIONÁRIO",
      value: user?.status_questionario || "Não respondido",
    },
  ];

  useEffect(() => {
    carregarRanking();
  }, []);

  const carregarRanking = async () => {
    setLoading(true);

    const result = await dashboardService.obterRanking();

    if (result.success) {
      setRanking(result.data.top_10 || []);
      setUsuarioLogado(result.data.minha_posicao || null);
    }

    setLoading(false);
  };

  return (
    <>
      <Titulo
        titulo="Dashboard ESG"
        subtitulo="Veja seu progresso sustentável."
      >
        <div className="bg-slate-50 p-2 border border-slate-200 rounded-2xl shadow">
          <span className="bg-emerald-100 px-4 py-2 rounded-2xl text-emerald-600 font-bold flex items-center gap-2">
            Minha Posição: {loading ? "Carregando..." : usuarioLogado ? `${usuarioLogado.posicao}º` : "N/A"}
          </span>
        </div>
      </Titulo>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ul className="max-h-[300px] grid grid-cols-1 gap-4">
          {statusCards.map((card, index) => (
            <Card key={index}>
              <div className="flex items-center gap-4">
                <span className={`border ${card.bgColor} p-3 rounded-lg`}>
                  {card.icon}
                </span>
                <div>
                  <p className="text-xs text-slate-500">{card.title}</p>
                  <h2 className="text-lg font-bold text-slate-800">
                    {card.value}
                  </h2>
                </div>
              </div>
            </Card>
          ))}
        </ul>
        <div className="col-span-1 md:col-span-2">
          <Ranking ranking={ranking} loading={loading} />
        </div>
      </div>
    </>
  );
}
