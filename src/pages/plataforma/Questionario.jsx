import { BiLeaf } from "react-icons/bi";
import { GrFavorite } from "react-icons/gr";
import { GoLaw } from "react-icons/go";
import { IoMdGlobe } from "react-icons/io";

import BarraProgresso from "../../components/BarraProgresso";
import QuestionarioCard from "../../components/QuestionarioCard";
import Notification from "../../components/Notification";
import Loading from "../../components/Loading";
import Titulo from "../../components/Titulo";
import Button from "../../components/Button";
import Card from "../../components/Card";

import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { diagnosticoService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";

// Helpers

const OPCOES_LABEL = {
  0: "Nunca",
  1: "Raramente",
  2: "Às vezes",
  3: "Frequentemente",
  4: "Sempre",
};

const EIXO_CONFIG = {
  ambiental: {
    Icon: BiLeaf,
    badgeClasses: "bg-emerald-600 text-white",
    label: "Eixo Ambiental",
  },
  social: {
    Icon: GrFavorite,
    badgeClasses: "bg-rose-600 text-white",
    label: "Eixo Social",
  },
  governança: {
    Icon: GoLaw,
    badgeClasses: "bg-sky-500 text-white",
    label: "Eixo Governança",
  },
  governanca: {
    Icon: GoLaw,
    badgeClasses: "bg-sky-500 text-white",
    label: "Eixo Governança",
  },
};

function getEixoConfig(eixo) {
  const key = (eixo || "").toLowerCase();
  return (
    EIXO_CONFIG[key] || {
      Icon: null,
      badgeClasses: "bg-slate-200 text-slate-700",
      label: eixo || "Eixo",
    }
  );
}

// Sub-componente: Tela de Finalizado

function TelaFinalizado({ perguntas, onRefazer }) {
  return (
    <div className="flex flex-col gap-6">
      <Titulo
        titulo="Questionário ESG"
        subtitulo="Reflita seus comportamentos ESG"
      >
        <Button
          icon={<IoMdGlobe size={24} />}
          text="Refazer Questionário"
          onClick={onRefazer}
        />
      </Titulo>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {perguntas.map((p) => {
          const { Icon, badgeClasses, label } = getEixoConfig(p.eixo_esg);
          const respostaLabel =
            p.resposta && typeof p.resposta.pontuacao === "number"
              ? (OPCOES_LABEL[p.resposta.pontuacao] ?? "—")
              : "Não respondida";

          return (
            <Card key={p.id_pergunta}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-xl ${badgeClasses}`}
                >
                  {Icon && <Icon size={18} />}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {label}
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-800">
                {p.pergunta}
              </h1>
              <span className="bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 text-emerald-600 font-semibold text-sm text-center">
                {respostaLabel}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Componente principal

export default function Questionario() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [perguntas, setPerguntas] = useState([]);
  const [respostasLocais, setRespostasLocais] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [notification, setNotification] = useState(null);

  const abortRef = useRef(null);

  const showNotification = (message, type = "success") =>
    setNotification({ message, type });
  const clearNotification = () => setNotification(null);

  const finalizado = user?.status_questionario === "Finalizada";

  const carregarDados = useCallback(async (forcarInicio = false) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    const sessaoRes = await diagnosticoService.obterSessaoAtual(
      controller.signal,
    );

    if (controller.signal.aborted) return;

    if (!sessaoRes.success) {
      showNotification(
        sessaoRes.message || "Erro ao carregar perguntas.",
        "error",
      );
      setLoading(false);
      return;
    }

    const lista = Array.isArray(sessaoRes.data) ? sessaoRes.data : [];
    setPerguntas(lista);

    const mapa = {};
    lista.forEach((p) => {
      if (p.resposta && typeof p.resposta.pontuacao === "number") {
        mapa[p.id_pergunta] = p.resposta.pontuacao;
      }
    });
    setRespostasLocais(mapa);

    // Se forcarInicio=true (caso do Refazer), sempre começa na primeira
    if (forcarInicio) {
      setCurrentIndex(0);
    } else {
      const primeiraAberta = lista.findIndex((p) => !p.resposta);
      setCurrentIndex(primeiraAberta >= 0 ? primeiraAberta : lista.length - 1);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    carregarDados();
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [carregarDados]);

  // Refazer: limpa status local e recarrega
  const handleRefazer = () => {
    setLoading(true);
    if (setUser) {
      setUser((prev) => ({ ...prev, status_questionario: "Não Respondido" }));
    }
    setRespostasLocais({});
    carregarDados(true);
  };

  // Progresso calculado localmente
  const totalPerguntas = perguntas.length;
  const totalRespondidas = Object.keys(respostasLocais).length;
  const porcentagem =
    totalPerguntas > 0
      ? `${Math.round((totalRespondidas / totalPerguntas) * 100)}%`
      : "0%";

  const perguntaAtual = perguntas[currentIndex] || null;
  const isUltima =
    currentIndex === perguntas.length - 1 && perguntas.length > 0;

  const handleSelecionarResposta = (id_pergunta, pontuacao) => {
    setRespostasLocais((prev) => ({ ...prev, [id_pergunta]: pontuacao }));
  };

  const handleAvancar = () => {
    if (!isUltima) setCurrentIndex((prev) => prev + 1);
  };

  const handleAnterior = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const enviarLote = async (isFinalizado) => {
    const lote = Object.entries(respostasLocais).map(
      ([id_pergunta, pontuacao]) => ({
        id_pergunta: Number(id_pergunta),
        pontuacao,
      }),
    );

    if (lote.length === 0) {
      showNotification(
        "Responda ao menos uma pergunta antes de continuar.",
        "warning",
      );
      return { success: false };
    }

    setSalvando(true);
    const result = await diagnosticoService.salvarRespostasLote(
      lote,
      isFinalizado,
    );
    setSalvando(false);

    if (!result.success) {
      showNotification(
        result.message || "Erro ao salvar respostas.",
        result.type || "error",
      );
    }

    return result;
  };

  const handleFinalizar = async () => {
    const result = await enviarLote(true);
    if (result.success) {
      // Atualiza status no contexto sem precisar chamar /me novamente
      if (setUser) {
        setUser((prev) => ({ ...prev, status_questionario: "Finalizada" }));
      }
      navigate("/plataforma/evidencias");
    }
  };

  const handleRetomarDepois = async () => {
    const result = await enviarLote(false);
    if (result.success) {
      showNotification("Progresso salvo. Continue quando quiser.", "success");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading size={32} borderWidth={3} />
      </div>
    );
  }

  // Tela: Questionário Finalizado
  if (finalizado) {
    return (
      <>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={clearNotification}
          />
        )}
        <TelaFinalizado perguntas={perguntas} onRefazer={handleRefazer} />
      </>
    );
  }

  // Tela: Respondendo o Questionário
  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <div className=" mx-auto flex flex-col gap-6 md:w-[60%]">
        <BarraProgresso
          total={totalPerguntas}
          atual={totalRespondidas}
          porcentagem_conclusao={porcentagem}
          eixo={perguntaAtual?.eixo_esg}
          tema={perguntaAtual?.tema}
        />

        {perguntaAtual ? (
          <QuestionarioCard
            pergunta={perguntaAtual}
            exemplo={perguntaAtual.exemplo}
            respostaLocal={respostasLocais[perguntaAtual.id_pergunta] ?? null}
            onSelecionarResposta={handleSelecionarResposta}
            onAvancar={handleAvancar}
            onAnterior={currentIndex > 0 ? handleAnterior : null}
            onFinalizar={handleFinalizar}
            onRetomarDepois={handleRetomarDepois}
            salvando={salvando}
            isUltima={isUltima}
            animation="animate-fade-in-left"
          />
        ) : (
          <div className="text-center text-slate-500 mt-10">
            Nenhuma pergunta disponível no momento.
          </div>
        )}
      </div>
    </>
  );
}
