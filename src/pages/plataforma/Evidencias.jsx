import { LuShieldCheck } from "react-icons/lu";
import { LuImagePlus } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { LuUpload } from "react-icons/lu";

import Titulo from "../../components/Titulo";
import DataTable from "../../components/DataTable";
import ModalForm from "../../components/ModalForm";
import Notification from "../../components/Notification";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import FileDrop from "../../components/FileDrop";

import { useState, useEffect, useCallback, useRef } from "react";
import { evidenciasService } from "../../services/apiService";

const OPCOES_LABEL = {
  0: "Nunca",
  1: "Raramente",
  2: "Às vezes",
  3: "Frequentemente",
  4: "Sempre",
};

export default function Evidencias() {
  const [evidencias, setEvidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modal Adicionar
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [arquivoEvidencia, setArquivoEvidencia] = useState(null);

  // Modal Ver
  const [modalVer, setModalVer] = useState(false);
  const [itemVer, setItemVer] = useState(null);

  const showNotification = (message, type = "success") =>
    setNotification({ message, type });
  const clearNotification = () => setNotification(null);

  const carregarEvidencias = useCallback(async () => {
    setLoading(true);
    const result = await evidenciasService.listarMinhasEvidencias();
    if (result.success) {
      setEvidencias(Array.isArray(result.data) ? result.data : []);
    } else {
      showNotification(
        result.message || "Erro ao carregar evidências.",
        "error",
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    carregarEvidencias();
  }, [carregarEvidencias]);

  // Colunas
  const columns = [
    {
      key: "pergunta",
      label: "Pergunta",
      render: (row) => (
        <span className="line-clamp-2 text-sm text-slate-700">
          {row.pergunta}
        </span>
      ),
    },
    {
      key: "resposta",
      label: "Resposta",
      mobileVisible: false,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
          {OPCOES_LABEL[row.resposta?.pontuacao] ?? "—"}
        </span>
      ),
    },
    {
      key: "evidencia",
      label: "Evidência",
      mobileVisible: false,
      render: (row) =>
        row.evidencia ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            Anexado
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-400">
            Não anexado
          </span>
        ),
    },
  ];

  // Ações dinâmicas por linha
  const getActions = (row) => {
    if (row.evidencia) {
      return [
        {
          label: "Ver Evidência",
          icon: <LuEye size={14} />,
          className: "text-slate-700 hover:bg-slate-50",
          onClick: (r) => {
            setItemVer(r);
            setModalVer(true);
          },
        },
      ];
    }
    return [
      {
        label: "Adicionar Evidência",
        icon: <LuImagePlus size={14} />,
        className: "text-emerald-700 hover:bg-emerald-50",
        onClick: (r) => {
          setItemSelecionado(r);
          setArquivoEvidencia(null);
          setModalAdicionar(true);
        },
      },
    ];
  };

  const submitEvidencia = async () => {
    if (!arquivoEvidencia) {
      showNotification("Selecione uma imagem para a evidência.", "warning");
      return;
    }
    if (!itemSelecionado?.resposta?.id_resposta) return;

    setSalvando(true);
    const formData = new FormData();
    formData.append("evidencia", arquivoEvidencia);
    formData.append(
      "id_resposta",
      String(itemSelecionado.resposta.id_resposta),
    );

    const result = await evidenciasService.adicionarEvidencia(formData);
    setSalvando(false);

    if (result.success) {
      showNotification("Evidência adicionada com sucesso.", "success");
      setModalAdicionar(false);
      await carregarEvidencias();
    } else {
      showNotification(
        result.message || "Erro ao adicionar evidência.",
        "error",
      );
    }
  };

  if (loading) {
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
      <div className="flex flex-col gap-6">
        <Titulo
          titulo="Gestão de Evidências"
          subtitulo="Comprove suas ações ESG para aumentar sua confiabilidade e score."
        >
          <div className="bg-emerald-100 rounded-2xl border border-emerald-200 p-4 flex items-center gap-3">
            <LuShieldCheck className="text-emerald-600" size={28} />
            <div>
              <p className="text-xs text-emerald-800 font-bold">
                MULTIPLICADOR ATIVO
              </p>
              <h3 className="text-xl text-emerald-600 font-bold">
                1.5x por evidência
              </h3>
            </div>
          </div>
        </Titulo>
        <DataTable
          columns={columns}
          data={evidencias}
          actionsResolver={getActions}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              {evidencias.length} PERGUNTAS
            </span>
          </div>
        </DataTable>
      </div>
      <ModalForm
        titulo="Adicionar Evidência"
        onClose={() => setModalAdicionar(false)}
        openModal={modalAdicionar}
        submit={submitEvidencia}
      >
        <Input
          label="PERGUNTA"
          tipo="text"
          disabled
          className="col-span-2"
          value={itemSelecionado?.pergunta ?? ""}
          onChange={() => {}}
        />
        <Input
          label="RESPOSTA"
          tipo="text"
          disabled
          className="col-span-1"
          value={OPCOES_LABEL[itemSelecionado?.resposta?.pontuacao] ?? "—"}
          onChange={() => {}}
        />
        <Input
          label="PONTUAÇÃO COM EVIDÊNCIA"
          tipo="text"
          disabled
          className="col-span-1"
          value={
            itemSelecionado?.resposta?.pontuacao != null
              ? `${(itemSelecionado.resposta.pontuacao * 1.5).toFixed(1)} pts`
              : "—"
          }
          onChange={() => {}}
        />
        <FileDrop title="Imagem da Evidência" file={arquivoEvidencia} onChange={setArquivoEvidencia} />
      </ModalForm>
      <ModalForm
        titulo="Evidência"
        onClose={() => setModalVer(false)}
        openModal={modalVer}
        hideSubmit
      >
        <div className="col-span-2 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {itemVer?.pergunta}
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 text-emerald-700 font-semibold text-sm">
              {OPCOES_LABEL[itemVer?.resposta?.pontuacao] ?? "—"}
            </span>
            <span className="bg-sky-100 px-3 py-2 rounded-xl border border-sky-200 text-sky-700 font-semibold text-sm">
              {itemVer?.evidencia?.pontuacao != null
                ? `${itemVer.evidencia.pontuacao.toFixed(1)} pts com evidência`
                : "—"}
            </span>
          </div>
          {itemVer?.evidencia?.evidencia && (
            <img
              src={itemVer.evidencia.evidencia}
              alt="Evidência"
              className="w-full rounded-2xl object-contain max-h-80 border border-slate-100"
            />
          )}
        </div>
      </ModalForm>
    </>
  );
}
