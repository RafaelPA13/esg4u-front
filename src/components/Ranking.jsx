import { LuTrophy } from "react-icons/lu";
import { CiMedal } from "react-icons/ci";
import { IoMedalOutline } from "react-icons/io5";
import { MdPerson } from "react-icons/md";

export default function Ranking({ ranking, loading }) {
  const getPosicaoIcon = (posicao) => {
    switch (posicao) {
      case 1:
        return <LuTrophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <CiMedal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <IoMedalOutline className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="font-bold text-slate-800">#{posicao}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ranking ESG</h2>

        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse h-16 bg-gray-100 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 bg-linear-to-r from-emerald-500 to-emerald-600">
          <h2 className="text-2xl font-bold text-slate-50">Ranking ESG</h2>
          <p className="text-sm text-slate-100">
            Top 10 usuários com maior Score ESG
          </p>
        </div>
        <div className="divide-y divide-slate-300">
          {ranking.map((usuario) => (
            <div
              key={usuario.posicao}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 flex justify-center">
                  {getPosicaoIcon(usuario.posicao)}
                </div>
                {usuario.foto_perfil ? (
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={usuario?.foto_perfil}
                    alt={`Foto de ${usuario?.nome}`}
                  />
                ) : (
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-200 text-slate-400">
                      <MdPerson size={24} />
                    </span>
                  )}

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {usuario.nome}
                  </h3>
                </div>
              </div>

              <div>
                <span className="text-lg font-bold text-green-600">
                  {usuario.score_esg.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
