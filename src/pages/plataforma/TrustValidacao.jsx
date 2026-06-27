import { GoArrowUpRight } from "react-icons/go";
import { GoArrowDownLeft } from "react-icons/go";
import { GrValidate } from "react-icons/gr";
import { LuShieldCheck } from "react-icons/lu";
import { LiaCertificateSolid } from "react-icons/lia";
import { FaRegCircleCheck } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";

import Titulo from "../../components/Titulo";
import Tabs from "../../components/Tabs";
import Button from "../../components/Button";
import Card from "../../components/Card";
import ModalForm from "../../components/ModalForm";
import Input from "../../components/Input";
import Notification from "../../components/Notification";
import Loading from "../../components/Loading";
import DataTable from "../../components/DataTable";
import { Link } from "react-router-dom";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuariosService, validacoesService } from "../../services/apiService";
import { set } from "date-fns";

// Helpers
const eixoLabel = {
  AMBIENTAL: { bg: "bg-emerald-100", text: "text-emerald-700" },
  SOCIAL: { bg: "bg-rose-100", text: "text-rose-700" },
  GOVERNANÇA: { bg: "bg-sky-100", text: "text-sky-700" },
};

const validacaoLabel = (validado) => {
  if (validado === "validado")
    return {
      label: "VALIDADO",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-700",
    };
  if (validado === "rejeitado")
    return {
      label: "REJEITADO",
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-700",
    };
  if (validado === "pendente")
    return {
      label: "PENDENTE",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-700",
    };
  return {
    label: "NÃO VALIDADO",
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-500",
  };
};

const columns = [
  {
    key: "pedido_por",
    label: "Pedido Por",
    render: (row) => (
      <span className="break-all whitespace-normal">
        {row.validacao?.pedido_por ?? "—"}
      </span>
    ),
  },
  {
    key: "eixo_esg",
    label: "Eixo",
    mobileVisible: false,
    render: (row) => {
      const eixo = String(row.eixo_esg || "").toLowerCase();
      if (eixo === "ambiental")
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            AMBIENTAL
          </span>
        );
      if (eixo === "social")
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
            SOCIAL
          </span>
        );
      if (eixo === "governança" || eixo === "governanca")
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-600">
            GOVERNANÇA
          </span>
        );
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
          {row.eixo_esg}
        </span>
      );
    },
  },
  { key: "pergunta", label: "Pergunta" },
  {
    key: "validado",
    label: "Status",
    mobileVisible: false,
    render: (row) => {
      if (row.validacao?.validado === "validado")
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            VALIDADO
          </span>
        );
      if (row.validacao?.validado === "rejeitado")
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">
            REJEITADO
          </span>
        );
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
          PENDENTE
        </span>
      );
    },
  },
];

export default function TrustValidacao() {
  const { user } = useAuth();

  const tabs = [
    { key: "enviadas", label: "Enviadas", icon: <GoArrowUpRight /> },
    { key: "recebidas", label: "Recebidas", icon: <GoArrowDownLeft /> },
  ];

  const [activeTab, setActiveTab] = useState("enviadas");

  // Notificação
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = "success") =>
    setNotification({ message, type });
  const clearNotification = () => setNotification(null);

  // Loading geral da página
  const [loadingPage, setLoadingPage] = useState(true);

  // Minhas Validações (enviadas)
  const [minhasValidacoes, setMinhasValidacoes] = useState([]);
  const [loadingValidacoes, setLoadingValidacoes] = useState(false);

  // Modal de Solicitação
  const [modalSolicitacao, setModalSolicitacao] = useState(false);
  const [salvandoSolicitacao, setSalvandoSolicitacao] = useState(false);
  const [idResposta, setIdResposta] = useState("");
  const [emailAprovador, setEmailAprovador] = useState("");
  const [nomeAprovador, setNomeAprovador] = useState("");

  // Validações para avaliar (recebidas)
  const [validacoesParaAvaliar, setValidacoesParaAvaliar] = useState([]);
  const [loadingValidacoesParaAvaliar, setLoadingValidacoesParaAvaliar] =
    useState(false);
  const [salvandoValidacao, setSalvandoValidacao] = useState(false);

  // Carrega minhas validações enviadas
  const carregarMinhasValidacoes = useCallback(async () => {
    if (!user?.email) return;
    setLoadingValidacoes(true);
    const result = await validacoesService.listarMinhasValidacoes(user.email);
    if (result.success) {
      setMinhasValidacoes(result.data);
    } else {
      showNotification(
        result.message || "Erro ao carregar suas validações.",
        "error",
      );
    }
    setLoadingValidacoes(false);
  }, [user?.email]);

  // Carrega validações para avaliar
  const carregarValidacoesParaAvaliar = useCallback(async () => {
    if (!user?.email) return;
    setLoadingValidacoesParaAvaliar(true);
    const result = await validacoesService.listarValidacoesParaAvaliar(
      user.email,
    );
    if (result.success) {
      setValidacoesParaAvaliar(result.data);
    } else {
      showNotification(
        result.message || "Erro ao carregar validações recebidas.",
        "error",
      );
    }
    setLoadingValidacoesParaAvaliar(false);
  }, [user?.email]);

  useEffect(() => {
    const load = async () => {
      setLoadingPage(true);
      await Promise.all([
        carregarMinhasValidacoes(),
        carregarValidacoesParaAvaliar(),
      ]);
      setLoadingPage(false);
    };
    load();
  }, [carregarMinhasValidacoes, carregarValidacoesParaAvaliar]);

  const handleOpenModalSolicitacao = (item) => {
    setModalSolicitacao(true);
    setIdResposta(item.resposta?.id_resposta || "");
  };

  const handleCloseModalSolicitacao = () => {
    setModalSolicitacao(false);
    setIdResposta("");
    setEmailAprovador("");
    setNomeAprovador("");
  };

  const handlePedirValidacao = async () => {
    if (!idResposta || !emailAprovador) {
      showNotification(
        "Campos faltantes: " +
          [
            !idResposta && "ID da resposta",
            !emailAprovador && "Email do aprovador",
          ]
            .filter(Boolean)
            .join(", "),
        "warning",
      );
      return;
    }

    setSalvandoSolicitacao(true);
    const result = await validacoesService.pedirValidacao(
      idResposta,
      emailAprovador,
    );

    if (result.success) {
      showNotification(
        "Solicitação de validação enviada com sucesso!",
        "success",
      );
      handleCloseModalSolicitacao();
      carregarMinhasValidacoes(); // recarrega a lista após nova solicitação
    } else {
      showNotification(
        result.message || "Erro ao enviar solicitação de validação.",
        "error",
      );
    }
    setSalvandoSolicitacao(false);
  };

  const handleAprovar = async (row) => {
    setSalvandoValidacao(true);
    const result = await validacoesService.validarResposta(
      row.validacao?.id_validacao,
      "validado",
    );
    if (result.success) {
      showNotification("Resposta aprovada com sucesso!", "success");
      await carregarValidacoesParaAvaliar();
    } else {
      showNotification(result.message || "Erro ao aprovar resposta.", "error");
    }
    setSalvandoValidacao(false);
  };

  const handleRejeitar = async (row) => {
    setSalvandoValidacao(true);
    const result = await validacoesService.validarResposta(
      row.validacao?.id_validacao,
      "rejeitado",
    );
    if (result.success) {
      showNotification("Resposta rejeitada.", "success");
      await carregarValidacoesParaAvaliar();
    } else {
      showNotification(result.message || "Erro ao rejeitar resposta.", "error");
    }
    setSalvandoValidacao(false);
  };

  if (loadingPage) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading size={32} borderWidth={3} />
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
      <Titulo
        titulo="Trust & Validação"
        subtitulo="Aumente sua credibilidade solicitando confirmações de terceiros."
      >
        <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
      </Titulo>
      <div>
        {activeTab === "enviadas" && (
          <div className="grid grid-cols-1 items-baseline gap-3 md:grid-cols-4">
            <div className="col-span-1 flex flex-col gap-3 md:col-span-3">
              {loadingValidacoes ? (
                <div className="flex justify-center py-8">
                  <Loading size={28} borderWidth={3} />
                </div>
              ) : minhasValidacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-6">
                  <p className="text-2xl text-slate-800 text-center font-semibold">
                    Nenhuma resposta encontrada.
                  </p>
                  <Link
                    to="/plataforma/questionario"
                    className="bg-emerald-600 px-4 py-2 rounded-xl text-white shadow-lg shadow-emerald-300 transition-colors duration-300 flex items-center gap-3 hover:bg-emerald-700"
                  >
                    Responda Agora
                  </Link>
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {minhasValidacoes.map((item) => {
                    const eixo =
                      eixoLabel[item.eixo_esg?.toUpperCase()] ??
                      eixoLabel["AMBIENTAL"];
                    const status = validacaoLabel(item.validacao?.validado);
                    return (
                      <Card
                        key={item.validacao?.id_validacao}
                        className="col-span-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${eixo.bg} ${eixo.text}`}
                            >
                              {item.eixo_esg ?? "—"}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${status.border} ${status.text}`}
                          >
                            {item.validacao?.pontuacao ??
                              item.evidencia?.pontuacao ??
                              item.resposta?.pontuacao}
                          </span>
                        </div>
                        <p className="text-slate-800 text-xl font-semibold">
                          {item.pergunta}
                        </p>
                        {item.validacao?.avaliador ? (
                          <span className="text-slate-500 text-sm">
                            Avaliador:{" "}
                            <strong>
                              {item.validacao?.avaliador ?? "Não atribuído"}
                            </strong>
                          </span>
                        ) : (
                          <Button
                            text="Solicitar Validação"
                            onClick={() => handleOpenModalSolicitacao(item)}
                          />
                        )}
                      </Card>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="col-span-1 bg-slate-900 p-4 rounded-2xl shadow flex flex-col gap-3">
              <span className="flex items-center gap-2">
                <LuShieldCheck size={20} className="text-emerald-600" />
                <h2 className="text-slate-50 font-semibold">
                  Por que validar?
                </h2>
              </span>
              <p className="text-slate-400 text-sm">
                Respostas validadas por terceiros recebem um multiplicador de{" "}
                <span className="text-emerald-600 font-medium">1.2x</span> ou{" "}
                <span className="text-emerald-600 font-medium">1.7x</span> no
                seu score ESG, dependendo se houver uma evidência anexada, além
                de aumentar significativamente sua reputação na rede.
              </p>
            </div>
          </div>
        )}
        {activeTab === "recebidas" && (
          <div className="flex flex-col gap-4">
            {salvandoValidacao ? (
              <div className="w-full bg-white rounded-2xl shadow flex items-center justify-center py-16">
                <Loading size={32} borderWidth={3} />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={validacoesParaAvaliar}
                loading={loadingValidacoesParaAvaliar}
                actionsResolver={(row) => {
                  if (row.validacao?.validado !== "pendente") return [];
                  return [
                    {
                      label: "Aprovar",
                      icon: <FaRegCircleCheck size={14} />,
                      className: "text-emerald-700 hover:bg-emerald-50",
                      onClick: handleAprovar,
                    },
                    {
                      label: "Rejeitar",
                      icon: <VscError size={14} />,
                      className: "text-red-600 hover:bg-red-50",
                      onClick: handleRejeitar,
                    },
                  ];
                }}
                pagination={false}
              >
                <span className="text-xs font-bold text-slate-400">
                  {loadingValidacoesParaAvaliar ? (
                    <Loading size={16} borderWidth={2} />
                  ) : (
                    `${validacoesParaAvaliar.length} VALIDAÇÕES`
                  )}
                </span>
              </DataTable>
            )}
            <div className="bg-slate-900 p-6 rounded-2xl flex flex-col items-start gap-4 shadow shadow-indigo-900/50 md:flex-row md:items-center">
              <span className="bg-slate-800 p-4 border border-slate-700 rounded-2xl text-emerald-600 shrink-0">
                <LiaCertificateSolid size={32} />
              </span>
              <div>
                <h1 className="text-slate-50 text-xl font-semibold">
                  Impacto da Validação
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Ao validar uma ação, você ajuda a manter a integridade da
                  rede. Respostas validadas com evidência recebem multiplicador
                  de <span className="text-emerald-600 font-medium">1.7x</span>,
                  e sem evidência{" "}
                  <span className="text-emerald-600 font-medium">1.2x</span>.
                  Sua reputação aumenta em{" "}
                  <span className="text-emerald-600 font-medium">+10 pts</span>{" "}
                  por cada validação honesta realizada.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <ModalForm
        titulo="Solicitar Validação"
        onClose={handleCloseModalSolicitacao}
        openModal={modalSolicitacao}
        submit={handlePedirValidacao}
        submitDisabled={salvandoSolicitacao}
      >
        <Input
          label="NOME DO APROVADOR"
          placeholder="Digite o nome do aprovador (opcional)"
          className="col-span-2"
          value={nomeAprovador}
          onChange={(e) => setNomeAprovador(e.target.value)}
        />
        <Input
          label="E-MAIL DO APROVADOR"
          placeholder="Digite o email do aprovador"
          className="col-span-2"
          required
          value={emailAprovador}
          onChange={(e) => setEmailAprovador(e.target.value)}
        />
      </ModalForm>
    </>
  );
}
