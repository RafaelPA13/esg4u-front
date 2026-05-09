import { FaArrowTrendUp } from "react-icons/fa6";
import { HiOutlineUserAdd } from "react-icons/hi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoCopyOutline } from "react-icons/io5";

import Titulo from "../../components/Titulo";
import Card from "../../components/Card";
import Button from "../../components/Button";
import DataTable from "../../components/DataTable";
import ModalForm from "../../components/ModalForm";
import Input from "../../components/Input";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";
import Loading from "../../components/Loading";
import Notification from "../../components/Notification";

import { useState, useEffect, useCallback } from "react";
import { convitesService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";

export default function Convites() {
  const { user } = useAuth();
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [notification, setNotification] = useState(null);

  // Estado para paginação
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paginacao, setPaginacao] = useState({
    registros: 0,
    pages: 1,
    prev_page: false,
    prox_page: false,
    convertidos: 0,
    pendentes: 0,
  });

  // Estados para filtros
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroDtEnvio, setFiltroDtEnvio] = useState(null); // Data no formato YYYY-MM-DD
  const mensagemConvite = `🌱✨ Olá! Quero te convidar para conhecer o *ESG4U*! 

É uma plataforma onde você responde um diagnóstico simples sobre suas práticas *Ambientais, Sociais e de Governança (ESG)*, envia evidências e acompanha sua *reputação sustentável* em tempo real.  

🚀 Com o ESG4U você:
- Entende melhor o seu impacto ESG  
- Organiza evidências das suas ações  
- Melhora sua credibilidade com clientes, parceiros e investidores  

👉 Acesse e comece agora: http://localhost:5173/ `;

  // Modal Enviar Convite
  const [modalConvites, setModalConvites] = useState(false);
  const [emailDestinatario, setEmailDestinatario] = useState("");
  const [conviteEnviado, setConviteEnviado] = useState(false); // Para controlar o estado pós-envio

  const showNotification = (message, type = "success") =>
    setNotification({ message, type });
  const clearNotification = () => setNotification(null);

  const carregarConvites = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    const filtros = {};
    if (filtroEmail) filtros.destinatario = filtroEmail;
    if (filtroStatus) filtros.status = filtroStatus;
    if (filtroDtEnvio) filtros.dt_envio = filtroDtEnvio; // Passa a data formatada

    const result = await convitesService.listarMeusConvites({
      remetenteUuid: user.id,
      page,
      perPage,
      filtros,
    });

    if (result.success) {
      setConvites(result.data.convites || []);
      setPaginacao({
        registros: result.data.registros,
        pages: result.data.pages,
        prev_page: result.data.prev_page,
        prox_page: result.data.prox_page,
        convertidos: result.data.convertidos,
        pendentes: result.data.pendentes,
      });
    } else {
      showNotification(result.message || "Erro ao carregar convites.", "error");
    }
    setLoading(false);
  }, [user, page, perPage, filtroEmail, filtroStatus, filtroDtEnvio]);

  useEffect(() => {
    carregarConvites();
  }, [carregarConvites]);

  // Limpar filtros e recarregar
  const handleClearFilters = () => {
    setFiltroEmail("");
    setFiltroStatus("");
    setFiltroDtEnvio(null);
    setPage(1); // Volta para a primeira página ao limpar filtros
  };

  // Colunas para a DataTable
  const columns = [
    { key: "destinatario", label: "Destinatário" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            row.status === "Convertido"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: "dt_envio", label: "Data de Envio" },
  ];

  const submitConvite = async () => {
    if (!emailDestinatario) {
      showNotification(
        "Por favor, insira o e-mail do destinatário.",
        "warning",
      );
      return;
    }

    setSalvando(true);
    const result = await convitesService.enviarConvite(emailDestinatario);
    setSalvando(false);

    if (result.success) {
      showNotification("Convite enviado com sucesso!", "success");
      setConviteEnviado(true);
      carregarConvites(); // Recarrega a lista de convites
    } else {
      showNotification(result.message || "Erro ao enviar convite.", "error");
    }
  };

  const handleCloseModalConvites = () => {
    setModalConvites(false);
    setConviteEnviado(false); // Reseta o estado para o próximo envio
    setEmailDestinatario("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mensagemConvite);
    showNotification("Link copiado para a área de transferência!", "info");
  };

  const cardsData = [
    { label: "TOTAL ENVIADOS", value: paginacao.registros },
    { label: "CONVERTIDOS", value: paginacao.convertidos },
    { label: "PENDENTES", value: paginacao.pendentes },
  ];

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
        titulo="Gestão de Convites"
        subtitulo="Acompanhe e gerencie os convites enviados para novos usuários."
      >
        <ul className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {cardsData.map((card, index) => (
            <Card key={index}>
              <p className="text-[10px] text-slate-400 font-bold">
                {card.label}
              </p>
              <h3 className="text-3xl font-black -mt-2">{card.value}</h3>
            </Card>
          ))}
        </ul>
      </Titulo>
      <DataTable
        columns={columns}
        data={convites}
        loading={loading}
        pagination={true}
        page={page}
        pages={paginacao.pages}
        perPage={perPage}
        proxPage={paginacao.prox_page}
        prevPage={paginacao.prev_page}
        onPageChange={setPage}
        onPerPageChange={(n) => {
          setPerPage(n);
          setPage(1);
        }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              icon={<RxMagnifyingGlass />}
              placeholder="E-mail do Destinatário"
              className="w-full md:w-[30%]"
              value={filtroEmail}
              onChange={(e) => setFiltroEmail(e.target.value)}
            />
            <Select
              placeholder="Status do Convite"
              className="w-full md:w-[30%]"
              value={filtroStatus}
              options={[
                { label: "Pendente", value: "Pendente" },
                { label: "Convertido", value: "Convertido" },
              ]}
              onChange={(val) => setFiltroStatus(val)}
            />
            <DatePicker
              placeholder="Data de Envio"
              className="w-full md:w-[30%]"
              value={filtroDtEnvio}
              onChange={setFiltroDtEnvio}
            />
          </div>
          {(filtroEmail || filtroStatus || filtroDtEnvio) && (
            <Button
              text="Limpar Filtros"
              onClick={handleClearFilters}
              className="w-full md:w-[20%]"
            />
          )}
          {loading && <Loading size={24} />}
        </div>
      </DataTable>
      <ModalForm
        titulo={conviteEnviado ? "Convite Enviado!" : "Enviar Convite"}
        onClose={handleCloseModalConvites}
        openModal={modalConvites}
        submit={submitConvite}
        submitLabel={salvando ? "Enviando..." : "Enviar Convite"}
        submitDisabled={salvando || conviteEnviado} // Desabilita após o envio
        hideSubmit={conviteEnviado} // Oculta o botão de submit após o envio
      >
        {conviteEnviado ? (
          <div className="col-span-2 flex flex-col gap-4 items-center text-center">
            <p className="text-lg text-emerald-600 font-semibold">
              O convite foi enviado com sucesso!
            </p>
            <p className="text-slate-600">
              Você também pode copiar o link abaixo e enviar manualmente:
            </p>
            <div
              className="w-full bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 cursor-pointer"
              onClick={handleCopyLink}
            >
              <span className="text-slate-700 text-sm text-wrap text-start truncate">
                {mensagemConvite}
              </span>
              <button
                type="button"
                className="text-slate-400 hover:text-emerald-600"
                aria-label="Copiar link"
              >
                <IoCopyOutline size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Clique no campo acima para copiar o link.
            </p>
          </div>
        ) : (
          <Input
            label="E-MAIL"
            tipo="email"
            placeholder="E-mail Destinatário"
            className="col-span-2"
            value={emailDestinatario}
            onChange={(e) => setEmailDestinatario(e.target.value)}
            required
          />
        )}
      </ModalForm>
      <div className="bg-slate-900 p-10 rounded-4xl flex flex-col items-center gap-10 shadow shadow-indigo-900/50 md:flex-row">
        <span className="bg-slate-800 p-4 border border-slate-700 rounded-2xl text-emerald-600">
          <FaArrowTrendUp size={32} />
        </span>
        <span className="w-full flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-slate-50 text-xl font-semibold">
              Expanda sua Rede de Confiança
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Convide mais parceiros para validar suas práticas e aumentar seu
              Trust Score.
            </p>
          </div>
          <Button
            icon={<HiOutlineUserAdd />}
            text="Novo Convite"
            onClick={() => setModalConvites(true)}
          />
        </span>
      </div>
    </>
  );
}
