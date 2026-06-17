import { IoMdClose } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import { IoMdClipboard } from "react-icons/io";
import { IoMdCamera } from "react-icons/io";
import { LuShieldCheck } from "react-icons/lu";
import { IoMdStar } from "react-icons/io";
import { IoMdTrendingUp } from "react-icons/io";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    id: 0,
    title: "Diagnóstico ESG",
    description:
      "Responda a perguntas simples sobre suas práticas diárias em Ambiente, Social e Governança.",
    iconBg: "bg-emerald-50 text-emerald-500",
    Icon: IoMdClipboard,
    imageUrl:
      "/tutorial1.avif",
  },
  {
    id: 1,
    title: "Envie Evidências",
    description:
      "Tire fotos ou anexe documentos que comprovem suas ações sustentáveis e éticas.",
    iconBg: "bg-sky-50 text-sky-500",
    Icon: IoMdCamera,
    imageUrl:
      "/tutorial2.avif",
  },
  {
    id: 2,
    title: "Peça Validação",
    description:
      "Sua rede de confiança valida suas evidências, garantindo a integridade dos dados.",
    iconBg: "bg-purple-50 text-purple-500",
    Icon: LuShieldCheck,
    imageUrl:
      "/tutorial3.avif",
  },
  {
    id: 3,
    title: "Ganhe Reputação",
    description:
      "Acumule pontos e suba de nível conforme suas ações são validadas pela comunidade.",
    iconBg: "bg-amber-50 text-amber-500",
    Icon: IoMdStar,
    imageUrl:
      "/tutorial4.avif",
  },
  {
    id: 4,
    title: "Acompanhe a Evolução",
    description:
      "Veja seu progresso no dashboard e descubra como você está impactando o mundo.",
    iconBg: "bg-rose-50 text-rose-500",
    Icon: IoMdTrendingUp,
    imageUrl:
      "/tutorial5.avif",
  },
];

export default function Tutorial({ open, onClose }) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setStepIndex(0);
    }
  }, [open]);

  if (!open) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setStepIndex((prev) => prev + 1);
    } else {
      onClose?.();
      navigate("/plataforma/questionario");
    }
  };

  const handleSkip = () => {
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[999] flex bg-slate-800/50 backdrop-blur-sm">
      <div className="m-auto w-full max-w-6xl h-screen bg-slate-50 overflow-hidden shadow-2xl flex flex-col md:h-[520px] md:flex-row md:rounded-3xl">
        <div className="w-full md:w-1/2 h-56 md:h-[520px] relative">
          <img
            src={step.imageUrl}
            alt={step.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col px-8 py-6 md:px-12 md:py-10 relative">
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <IoMdClose size={22} />
          </button>
          <div className="mt-8 md:mt-4 flex-1 flex flex-col justify-center gap-6">
            <div
              className={`w-14 h-14 rounded-3xl flex items-center justify-center ${step.iconBg}`}
            >
              <step.Icon size={28} />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                {step.title}
              </h1>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {STEPS.map((s, index) => {
                const active = index === stepIndex;
                return (
                  <span
                    key={s.id}
                    className={`h-1.5 rounded-full transition-all ${
                      active
                        ? "bg-emerald-500 w-8"
                        : "bg-slate-200 w-2"
                    }`}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/30 hover:bg-emerald-700 transition-colors"
            >
              {isLast ? (
                <>
                  Começar Diagnóstico
                  <IoMdCheckmarkCircleOutline size={18} />
                </>
              ) : (
                <>
                  Próximo
                  <IoMdArrowForward size={18} />
                </>
              )}
            </button>
            {!isLast && (
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm font-semibold text-slate-400 hover:text-slate-600"
              >
                Pular
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}