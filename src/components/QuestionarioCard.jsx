import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { LuSave } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";

import Loading from "./Loading";

import { useState, useEffect } from "react";

const OPCOES = [
  { label: "Nunca", valor: 0 },
  { label: "Raramente", valor: 1 },
  { label: "Às vezes", valor: 2 },
  { label: "Frequentemente", valor: 3 },
  { label: "Sempre", valor: 4 },
];

export default function QuestionarioCard({
  pergunta,
  exemplo,
  respostaLocal,
  onSelecionarResposta,
  onAvancar,
  onAnterior,
  onFinalizar,
  onRetomarDepois,
  salvando = false,
  isUltima = false,
  animation = "animate-fade-in-left",
}) {
  const [mostrarExemplo, setMostrarExemplo] = useState(true);
  const [animClass, setAnimClass] = useState(animation);

  useEffect(() => {
    setMostrarExemplo(true);
    setAnimClass(animation);
  }, [pergunta?.id_pergunta, animation]);

  const handleAvancarClick = () => {
    if (isUltima) {
      onFinalizar();
      return;
    }
    setAnimClass("animate-fade-out-left");
    setTimeout(() => onAvancar(), 350);
  };

  const handleAnteriorClick = () => {
    if (!onAnterior) return;
    setAnimClass("animate-fade-out-left");
    setTimeout(() => onAnterior(), 350);
  };

  const botaoDesabilitado =
    respostaLocal === null || respostaLocal === undefined || salvando;

  return (
    <>
      <div
        className={`w-full bg-slate-50 rounded-3xl shadow-sm px-8 py-8 flex flex-col gap-6 ${animClass}`}
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
            {pergunta?.pergunta}
          </h1>

          {exemplo && (
            <>
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                onClick={() => setMostrarExemplo((prev) => !prev)}
              >
                <IoMdInformationCircleOutline />
                {mostrarExemplo ? "Ocultar exemplo" : "Ver exemplo prático"}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  mostrarExemplo ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <span className="block text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                  {exemplo}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {OPCOES.map((opcao) => {
            const checked = respostaLocal === opcao.valor;
            return (
              <label
                key={opcao.valor}
                className={`flex items-center justify-between gap-3 px-5 py-4 border border-slate-200 rounded-2xl cursor-pointer transition-colors ${
                  checked
                    ? "bg-emerald-100"
                    : "bg-slate-50 hover:bg-slate-100 hover:border-emerald-600 hover:ring-3 hover:ring-emerald-500/20"
                }`}
              >
                <span className="text-sm font-semibold md:text-base text-slate-800">
                  {opcao.label}
                </span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checked
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      checked ? "bg-white" : "bg-transparent"
                    }`}
                  />
                </span>
                <input
                  type="radio"
                  className="hidden"
                  name={`resposta-${pergunta?.id_pergunta}`}
                  value={opcao.valor}
                  checked={checked}
                  onChange={() =>
                    onSelecionarResposta(pergunta.id_pergunta, opcao.valor)
                  }
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm text-slate-400 transition-colors duration-300 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          onClick={handleAnteriorClick}
          disabled={!onAnterior}
        >
          <MdKeyboardArrowLeft />
          <span className="font-semibold">Anterior</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-slate-600 transition-colors duration-300 hover:bg-slate-200 disabled:opacity-60"
            onClick={onRetomarDepois}
            disabled={salvando}
          >
            {salvando ? <Loading size={14} borderWidth={2} /> : <LuSave />}
            <span>Retomar depois</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/30 disabled:opacity-60"
            onClick={handleAvancarClick}
            disabled={botaoDesabilitado}
          >
            {salvando
              ? "Salvando..."
              : isUltima
                ? "Finalizar"
                : "Salvar e continuar"}
            {salvando ? (
              <Loading size={16} borderWidth={2} />
            ) : (
              <MdKeyboardArrowRight />
            )}
          </button>
        </div>
      </div>
    </>
  );
}