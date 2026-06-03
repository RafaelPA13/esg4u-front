import { IoReloadCircle } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { LuShieldAlert } from "react-icons/lu";
import { LuTable } from "react-icons/lu";
import { VscGraph } from "react-icons/vsc";
import { RxPeople } from "react-icons/rx";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoAdd } from "react-icons/io5";
import { MdArrowDropUp } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import { LuPencil } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";
import { HiOutlineLightningBolt } from "react-icons/hi";

import Titulo from "../../components/Titulo";
import Tabs from "../../components/Tabs";
import DataTable from "../../components/DataTable";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Checkbox from "../../components/Checkbox";
import Loading from "../../components/Loading";
import ModalForm from "../../components/ModalForm";
import ModalDelete from "../../components/ModalDelete";
import Notification from "../../components/Notification";
import Button from "../../components/Button";
import DatePicker from "../../components/DatePicker";
import Card from "../../components/Card";

import { useState, useEffect, useCallback } from "react";
import useDebounce from "../../hooks/Debounce";
import {
  usuariosService,
  perguntasService,
  convitesService,
  validacoesService,
  bugsService,
  dashboardService,
} from "../../services/apiService";

export default function Admin() {
  /* ############################## Estados ############################## */

  // Tab ativa
  const [activeTab, setActiveTab] = useState("visao");

  // Notificação
  const [notification, setNotification] = useState(null);

  // Dashboard
  const [dashboardData, setDashboardData] = useState({
    totalUsuarios: 0,
    scoreMedio: 0.0,
    evidenciasAnexadas: 0,
    validacoesPendentes: 0,
    convitesEnviados: 0,
    taxaConversaoConvites: 0.0,
    bugsReportados: 0,
  });
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [erroDashboard, setErroDashboard] = useState(null);

  // Tabela usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Tabela perguntas
  const [perguntas, setPerguntas] = useState([]);
  const [loadingPerguntas, setLoadingPerguntas] = useState(false);
  const [erroPerguntas, setErroPerguntas] = useState(null);

  // Tabela convites
  const [convites, setConvites] = useState([]);
  const [loadingConvites, setLoadingConvites] = useState(false);
  const [erroConvites, setErroConvites] = useState(null);

  // Tabela validações
  const [validacoes, setValidacoes] = useState([]);
  const [loadingValidacoes, setLoadingValidacoes] = useState(false);
  const [erroValidacoes, setErroValidacoes] = useState(null);

  // Tabela bugs
  const [bugs, setBugs] = useState([]);
  const [loadingBugs, setLoadingBugs] = useState(false);
  const [erroBugs, setErroBugs] = useState(null);

  // Paginação (para usuários)
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paginacao, setPaginacao] = useState({
    registros: 0,
    pages: 1,
    prox_page: false,
    prev_page: false,
  });

  // Paginação (para convites)
  const [pageConvites, setPageConvites] = useState(1);
  const [perPageConvites, setPerPageConvites] = useState(10);
  const [paginacaoConvites, setPaginacaoConvites] = useState({
    registros: 0,
    pages: 1,
    prox_page: false,
    prev_page: false,
  });

  // Paginação (para validações)
  const [pageValidacoes, setPageValidacoes] = useState(1);
  const [perPageValidacoes, setPerPageValidacoes] = useState(10);
  const [paginacaoValidacoes, setPaginacaoValidacoes] = useState({
    registros: 0,
    pages: 1,
    prox_page: false,
    prev_page: false,
  });

  // Paginação (para bugs)
  const [pageBugs, setPageBugs] = useState(1);
  const [perPageBugs, setPerPageBugs] = useState(10);
  const [paginacaoBugs, setPaginacaoBugs] = useState({
    registros: 0,
    pages: 1,
    prox_page: false,
    prev_page: false,
  });

  // Filtros (para usuários)
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const filtroNomeDebounced = useDebounce(filtroNome, 500);
  const filtroEmailDebounced = useDebounce(filtroEmail, 500);

  // Filtros (convites)
  const [filtroConviteRemetente, setFiltroConviteRemetente] = useState("");
  const [filtroConviteDestinatario, setFiltroConviteDestinatario] =
    useState("");
  const [filtroConviteStatus, setFiltroConviteStatus] = useState("");
  const [filtroConviteDtEnvio, setFiltroConviteDtEnvio] = useState(null);
  const filtroConviteRemetenteDebounced = useDebounce(
    filtroConviteRemetente,
    500,
  );
  const filtroConviteDestinatarioDebounced = useDebounce(
    filtroConviteDestinatario,
    500,
  );

  // Filtros (validações)
  const [filtroValidacaoPedido, setFiltroValidacaoPedido] = useState("");
  const [filtroValidacaoAprovador, setFiltroValidacaoAprovador] = useState("");
  const filtroValidacaoPedidoDebounced = useDebounce(
    filtroValidacaoPedido,
    500,
  );
  const filtroValidacaoAprovadorDebounced = useDebounce(
    filtroValidacaoAprovador,
    500,
  );

  // Filtros (bugs)
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");

  // Modal de edição de usuários
  const [userEditModal, setUserEditModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [scoreUsuario, setScoreUsuario] = useState("");
  const [trustUsuario, setTrustUsuario] = useState("");
  const [reputacaoUsuario, setReputacaoUsuario] = useState("");
  const [adminUsuario, setAdminUsuario] = useState("");

  // Modal de exclusão de usuários
  const [userDeleteModal, setUserDeleteModal] = useState(false);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);

  // Modal de adição/edição de perguntas
  const [perguntaModal, setPerguntaModal] = useState(false);
  const [perguntaEditando, setPerguntaEditando] = useState(null);
  const [ativaPergunta, setAtivaPergunta] = useState(true);
  const [eixoPergunta, setEixoPergunta] = useState("");
  const [temaPergunta, setTemaPergunta] = useState("");
  const [indicePergunta, setIndicePergunta] = useState("");
  const [textoPergunta, setTextoPergunta] = useState("");
  const [exemploPergunta, setExemploPergunta] = useState("");

  // Modal de delete de pergunta
  const [perguntaDeleteModal, setPerguntaDeleteModal] = useState(false);
  const [perguntaParaDeletar, setPerguntaParaDeletar] = useState(null);

  // Modal de detalhes de bug
  const [bugDetalhesModal, setBugDetalhesModal] = useState(false);
  const [bugSelecionado, setBugSelecionado] = useState({
    id: 0,
    user_id: "",
    titulo: "",
    descricao: "",
    print: "",
    status: "",
    created_at: "",
  });

  // Estado de loading da exportação CSV
  const [exportandoCsv, setExportandoCsv] = useState(false);

  /* ############################## Estados ############################## */

  /* ############################## Variáveis ############################## */

  // Tabs
  const tabs = [
    { key: "visao", label: "Visão Geral", icon: <VscGraph /> },
    { key: "usuarios", label: "Usuários", icon: <RxPeople /> },
    { key: "diagnostico", label: "Diagnóstico", icon: <LuTable /> },
    { key: "validacoes", label: "Validações", icon: <LuShieldCheck /> },
    { key: "convites", label: "Convites", icon: <IoMailOutline /> },
    { key: "bugs", label: "Bugs", icon: <LuShieldAlert /> },
  ];

  // Colunas
  const userColumns = [
    { key: "nome", label: "Usuário" },
    { key: "email", label: "E-mail", mobileVisible: false },
    { key: "score_esg", label: "Score ESG", mobileVisible: false },
    { key: "reputacao", label: "Reputação", mobileVisible: false },
  ];

  const perguntasColumns = [
    {
      key: "indice",
      label: "Ordem",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-700 w-6 text-center">
            {row.indice}
          </span>
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => moverPergunta(row, "up")}
              disabled={row.indice === 1}
              className="inline-flex items-center justify-center w-6 h-5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              title="Mover para cima"
            >
              <MdArrowDropUp size={20} />
            </button>
            <button
              type="button"
              onClick={() => moverPergunta(row, "down")}
              disabled={row.indice === perguntas.length}
              className="inline-flex items-center justify-center w-6 h-5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              title="Mover para baixo"
            >
              <MdArrowDropDown size={20} />
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "eixo_esg",
      label: "Eixo",
      mobileVisible: false,
      render: (row) => {
        const eixo = String(row.eixo_esg || "").toLowerCase();
        if (eixo === "ambiental") {
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              AMBIENTAL
            </span>
          );
        }
        if (eixo === "social") {
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
              SOCIAL
            </span>
          );
        }
        if (eixo === "governança" || eixo === "governanca") {
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-600">
              GOVERNANÇA
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
            {row.eixo_esg}
          </span>
        );
      },
    },
    { key: "pergunta", label: "Pergunta" },
    {
      key: "ativa",
      label: "Status",
      mobileVisible: false,
      render: (row) =>
        row.ativa ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            ATIVA
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-400">
            INATIVA
          </span>
        ),
    },
  ];

  const convitesColumns = [
    { key: "remetente", label: "Remetente" },
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

  const validacoesColumns = [
    {
      key: "pedido_por",
      label: "Pedido Por",
      render: (row) => row.validacao?.pedido_por ?? "—",
    },
    { key: "pergunta", label: "Pergunta" },
    {
      key: "avaliador",
      label: "Avaliador",
      render: (row) => (
        <span className="break-all whitespace-normal">
          {row.validacao?.avaliador ?? "—"}
        </span>
      ),
    },
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

  const bugsColumns = [
    { key: "titulo", label: "Título" },
    { key: "descricao", label: "Descrição", mobileVisible: false },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        if (row.status === "resolvido")
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              RESOLVIDO
            </span>
          );
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
            PENDENTE
          </span>
        );
      },
    },
    { key: "created_at", label: "Data" },
  ];

  /* ############################## Variáveis ############################## */

  /* ############################## Funções - Modal ############################## */

  // Abrir modal de edição de usuário
  const handleUserEdit = async (row) => {
    const result = await usuariosService.buscarPorId(row.id);

    if (result.success) {
      const u = result.data;
      setUsuarioSelecionado(u);
      setNomeUsuario(u.nome ?? "");
      setEmailUsuario(u.email ?? "");
      setScoreUsuario(u.score_esg ?? 0);
      setTrustUsuario(u.trust_score ?? 0);
      setReputacaoUsuario(u.reputacao ?? 0);
      setAdminUsuario(u.admin ?? false);
      setUserEditModal(true);
    } else {
      showNotification(result.message || "Erro ao buscar usuário.", "error");
    }
  };

  // Abrir modal de exclusão de usuário
  const handleUserDelete = (row) => {
    setUsuarioParaDeletar(row);
    setUserDeleteModal(true);
  };

  // Abrir modal de "Nova Pergunta"
  const handlePerguntaAdd = () => {
    setPerguntaEditando(null);
    setAtivaPergunta(true);
    setEixoPergunta("");
    setTemaPergunta("");
    setIndicePergunta("");
    setTextoPergunta("");
    setExemploPergunta("");
    setPerguntaModal(true);
  };

  // Abrir modal de edição de pergunta
  const handlePerguntaEdit = async (row) => {
    const result = await perguntasService.buscarPorId(row.id);

    if (!result.success) {
      showNotification(
        result.message || "Erro ao buscar pergunta.",
        result.type || "error",
      );
      return;
    }

    const p = result.data;

    setPerguntaEditando(p);
    setAtivaPergunta(p.ativa);
    setEixoPergunta(p.eixo_esg);
    setTemaPergunta(p.tema);
    setIndicePergunta(p.indice);
    setTextoPergunta(p.pergunta);
    setExemploPergunta(p.exemplo ?? "");
    setPerguntaModal(true);
  };

  // Abrir modal de exclusão de pergunta
  const handlePerguntaDelete = (row) => {
    setPerguntaParaDeletar(row);
    setPerguntaDeleteModal(true);
  };

  const handleBugDetalhes = (row) => {
    setBugDetalhesModal(true);
    setBugSelecionado({
      id: row.id,
      user_id: row.user_id,
      titulo: row.titulo,
      descricao: row.descricao,
      print: row.print,
      status: row.status,
      created_at: row.created_at,
    });
  };
  /* ############################## Funções - Modal ############################## */

  /* ############################## Funções - Submissão e Confirmação ############################## */

  // Submeter edição de usuário
  const submitEdit = async () => {
    if (!usuarioSelecionado) return;

    const result = await usuariosService.atualizar(usuarioSelecionado.id, {
      nome: nomeUsuario,
      email: emailUsuario,
      admin: adminUsuario === true,
      foto: null, // mantém compatibilidade com novo formato
    });

    if (result.success) {
      showNotification(
        result.data?.message || "Usuário atualizado com sucesso.",
        "success",
      );
      await carregarUsuarios();
    } else {
      showNotification(result.message || "Erro ao atualizar usuário.", "error");
    }
  };

  // Confirmar exclusão de usuário
  const submitDelete = async () => {
    if (!usuarioParaDeletar) return;

    const result = await usuariosService.deletar(usuarioParaDeletar.id);

    if (result.success) {
      showNotification(
        result.data?.message || "Usuário excluído com sucesso.",
        "success",
      );
      setUsuarioParaDeletar(null);
      await carregarUsuarios();
    } else {
      showNotification(result.message || "Erro ao excluir usuário.", "error");
    }
  };

  // Submeter adição de pergunta
  const submitAddPergunta = async () => {
    const payload = {
      indice: Number(indicePergunta),
      ativa: ativaPergunta === true,
      eixo_esg: eixoPergunta,
      tema: temaPergunta,
      pergunta: textoPergunta,
      exemplo: exemploPergunta || null,
    };

    const result = await perguntasService.criar(payload);

    if (result.success) {
      showNotification(
        result.data?.sucesso || "Pergunta adicionada com sucesso.",
        "success",
      );
      await carregarPerguntas();
    } else {
      showNotification(
        result.message || "Erro ao adicionar pergunta.",
        result.type || "error",
      );
    }
  };

  // Submeter edição de pergunta
  const submitEditPergunta = async () => {
    if (!perguntaEditando) return;

    const payload = {
      indice: Number(indicePergunta),
      ativa: ativaPergunta === true,
      eixo_esg: eixoPergunta,
      tema: temaPergunta,
      pergunta: textoPergunta,
      exemplo: exemploPergunta || null,
    };

    const result = await perguntasService.atualizar(
      perguntaEditando.id,
      payload,
    );

    if (result.success) {
      showNotification(
        result.data?.sucesso || "Pergunta atualizada com sucesso.",
        "success",
      );
      await carregarPerguntas();
    } else {
      showNotification(
        result.message || "Erro ao atualizar pergunta.",
        result.type || "error",
      );
    }
  };

  // Confirmar exclusão de pergunta
  const submitDeletePergunta = async () => {
    if (!perguntaParaDeletar) return;

    const result = await perguntasService.deletar(perguntaParaDeletar.id);

    if (result.success) {
      showNotification("Pergunta removida com sucesso.", "success");
      setPerguntaParaDeletar(null);
      await carregarPerguntas();
    } else {
      showNotification(
        result.message || "Erro ao remover pergunta.",
        result.type || "error",
      );
    }
  };

  /* ############################## Funções - Submissão e Confirmação ############################## */

  /* ############################## Funções - Carregamento ############################## */

  // Carregar visão geral do dashboard
  const carregarDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    setErroDashboard(null);

    const result = await dashboardService.obterVisaoGeral();
    if (result.success) {
      setDashboardData({
        totalUsuarios: result.data.total_usuarios ?? 0,
        scoreMedio: result.data.score_esg_medio ?? 0.0,
        evidenciasAnexadas: result.data.evidencias_anexadas ?? 0,
        validacoesPendentes: result.data.validacoes_pendentes ?? 0,
        convitesEnviados: result.data.convites_enviados ?? 0,
        taxaConversaoConvites: result.data.taxa_conversao_convites ?? 0.0,
        bugsReportados: result.data.bugs_reportados ?? 0,
      });
    } else {
      setErroDashboard(result.message || "Erro ao carregar visão geral.");
    }
    setLoadingDashboard(false);
  }, []);

  useEffect(() => {
    if (activeTab === "visao") carregarDashboard();
  }, [activeTab]);

  // Carregar usuários
  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    setErro(null);

    const filtros = {};
    if (filtroNomeDebounced.trim()) filtros.nome = filtroNomeDebounced.trim();
    if (filtroEmailDebounced.trim())
      filtros.email = filtroEmailDebounced.trim();

    const result = await usuariosService.listar({ page, perPage, filtros });

    if (result.success) {
      setUsuarios(Array.isArray(result.data?.users) ? result.data.users : []);
      setPaginacao({
        registros: result.data.registros ?? 0,
        pages: result.data.pages ?? 1,
        prox_page: result.data.prox_page ?? false,
        prev_page: result.data.prev_page ?? false,
      });
    } else {
      setErro(result.message || "Erro ao carregar usuários.");
      setUsuarios([]);
    }

    setLoading(false);
  }, [page, perPage, filtroNomeDebounced, filtroEmailDebounced]);

  useEffect(() => {
    if (activeTab === "usuarios") carregarUsuarios();
  }, [activeTab, page, perPage]);

  useEffect(() => {
    if (activeTab === "usuarios") {
      if (page !== 1) setPage(1);
      else carregarUsuarios();
    }
  }, [filtroNomeDebounced, filtroEmailDebounced]);

  // Carregar perguntas
  const carregarPerguntas = useCallback(async () => {
    setLoadingPerguntas(true);
    setErroPerguntas(null);

    const result = await perguntasService.listar();

    if (result.success) {
      const lista =
        Array.isArray(result.data) && result.data.length
          ? result.data
          : Array.isArray(result.data?.perguntas)
            ? result.data.perguntas
            : [];
      setPerguntas(lista);
    } else {
      setErroPerguntas(result.message || "Erro ao carregar perguntas.");
      setPerguntas([]);
    }

    setLoadingPerguntas(false);
  }, []);

  useEffect(() => {
    if (activeTab === "diagnostico") {
      carregarPerguntas();
    }
  }, [activeTab]);

  // Carregar convites
  const carregarConvites = useCallback(async () => {
    setLoadingConvites(true);
    setErroConvites(null);

    const filtros = {};
    if (filtroConviteRemetenteDebounced.trim())
      filtros.remetente = filtroConviteRemetenteDebounced.trim();
    if (filtroConviteDestinatarioDebounced.trim())
      filtros.destinatario = filtroConviteDestinatarioDebounced.trim();
    if (filtroConviteStatus) filtros.status = filtroConviteStatus;
    if (filtroConviteDtEnvio) filtros.dt_envio = filtroConviteDtEnvio;

    const result = await convitesService.listarTodosConvites({
      page: pageConvites,
      perPage: perPageConvites,
      filtros,
    });

    if (result.success) {
      setConvites(
        Array.isArray(result.data?.convites) ? result.data.convites : [],
      );
      setPaginacaoConvites({
        registros: result.data.registros ?? 0,
        pages: result.data.pages ?? 1,
        prox_page: result.data.prox_page ?? false,
        prev_page: result.data.prev_page ?? false,
      });
    } else {
      setErroConvites(result.message || "Erro ao carregar convites.");
      setConvites([]);
    }

    setLoadingConvites(false);
  }, [
    pageConvites,
    perPageConvites,
    filtroConviteRemetenteDebounced,
    filtroConviteDestinatarioDebounced,
    filtroConviteStatus,
    filtroConviteDtEnvio,
  ]);

  useEffect(() => {
    if (activeTab === "convites") carregarConvites();
  }, [activeTab, pageConvites, perPageConvites]);

  useEffect(() => {
    if (activeTab === "convites") {
      if (pageConvites !== 1) setPageConvites(1);
      else carregarConvites();
    }
  }, [
    filtroConviteRemetenteDebounced,
    filtroConviteDestinatarioDebounced,
    filtroConviteStatus,
    filtroConviteDtEnvio,
  ]);

  // Carregar validações
  const carregarValidacoes = useCallback(async () => {
    setLoadingValidacoes(true);
    setErroValidacoes(null);

    const filtroPedidoPor = filtroValidacaoPedidoDebounced;
    const filtroAprovador = filtroValidacaoAprovadorDebounced;

    const result = await validacoesService.listarTodasValidacoes({
      page: pageValidacoes,
      perPage: perPageValidacoes,
      pedido_por: filtroPedidoPor,
      avaliador: filtroAprovador,
    });

    if (result.success) {
      setValidacoes(
        Array.isArray(result.data?.validacoes) ? result.data.validacoes : [],
      );
      setPaginacaoValidacoes({
        registros: result.data.registros ?? 0,
        pages: result.data.pages ?? 1,
        prox_page: result.data.prox_page ?? false,
        prev_page: result.data.prev_page ?? false,
      });
    } else {
      setErroValidacoes(result.message || "Erro ao carregar validações.");
      setValidacoes([]);
    }

    setLoadingValidacoes(false);
  }, [
    pageValidacoes,
    perPageValidacoes,
    filtroValidacaoPedidoDebounced,
    filtroValidacaoAprovadorDebounced,
  ]);

  useEffect(() => {
    if (activeTab === "validacoes") carregarValidacoes();
  }, [activeTab, pageValidacoes, perPageValidacoes]);

  useEffect(() => {
    if (activeTab === "validacoes") {
      if (pageValidacoes !== 1) setPageValidacoes(1);
      else carregarValidacoes();
    }
  }, [filtroValidacaoPedidoDebounced, filtroValidacaoAprovadorDebounced]);

  // Carregar bugs
  const carregarBugs = useCallback(async () => {
    setLoadingBugs(true);
    setErroBugs(null);

    const filtroBugsStatus = filtroStatus;
    const filtroBugsDataInicio = filtroDataInicio;
    const filtroBugsDataFim = filtroDataFim;

    const result = await bugsService.listar({
      pageBugs,
      perPageBugs,
      status: filtroBugsStatus,
      dt_inicio: filtroBugsDataInicio,
      dt_fim: filtroBugsDataFim,
    });

    if (result.success) {
      setBugs(Array.isArray(result.data?.bugs) ? result.data.bugs : []);
      setPaginacaoBugs({
        registros: result.data.registros ?? 0,
        pages: result.data.pages ?? 1,
        prox_page: result.data.prox_page ?? false,
        prev_page: result.data.prev_page ?? false,
      });
    } else {
      setErroBugs(result.message || "Erro ao carregar bugs.");
      setBugs([]);
    }

    setLoadingBugs(false);
  }, [pageBugs, perPageBugs, filtroStatus, filtroDataInicio, filtroDataFim]);

  useEffect(() => {
    if (activeTab === "bugs") carregarBugs();
  }, [activeTab, pageBugs, perPageBugs]);

  useEffect(() => {
    if (activeTab === "bugs") {
      if (pageBugs !== 1) setPageBugs(1);
      else carregarBugs();
    }
  }, [filtroStatus, filtroDataInicio, filtroDataFim]);

  /* ############################## Funções - Carregamento ############################## */

  /* ############################## Funções - Auxiliares ############################## */

  // Funções de notificação
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Mudar ordem (índice) usando PUT /diagnostico/pergunta/{id}
  const moverPergunta = async (row, direcao) => {
    // direcao: "up" ou "down"
    const indiceAtual = row.indice;
    const novoIndice = direcao === "up" ? indiceAtual - 1 : indiceAtual + 1;

    if (novoIndice < 1) return; // não deixa ir abaixo de 1

    const result = await perguntasService.atualizar(row.id, {
      indice: novoIndice,
      ativa: row.ativa,
      eixo_esg: row.eixo_esg,
      tema: row.tema,
      pergunta: row.pergunta,
      exemplo: row.exemplo,
    });

    if (result.success) {
      await carregarPerguntas();
    } else {
      showNotification(
        result.message || "Erro ao alterar ordem da pergunta.",
        result.type || "error",
      );
    }
  };

  const marcarComoResolvido = async (row) => {
    setLoadingBugs(true);
    const result = await bugsService.atualizarStatus(row.id, "resolvido");

    if (result.success) {
      showNotification(
        result.data?.message || "Bug marcado como resolvido.",
        "success",
      );
      await carregarBugs();
    } else {
      showNotification(
        result.message || "Erro ao marcar bug como resolvido.",
        "error",
      );
    }
    setLoadingBugs(false);
  };

  /* ############################## Funções - Auxiliares ############################## */

  /* ############################## Funções - Exportação ############################## */

  // Exportar usuários para CSV
  const handleExportarDashboardCsv = async () => {
    setExportandoCsv(true);

    const result = await dashboardService.exportarCsv();

    if (!result.success) {
      showNotification(
        result.message || "Erro ao exportar CSV.",
        result.type || "error",
      );
    }

    setExportandoCsv(false);
  };

  // Exportar usuários para CSV
  const handleExportarUsuariosCsv = async () => {
    setExportandoCsv(true);

    const result = await usuariosService.exportarCsv();

    if (!result.success) {
      showNotification(
        result.message || "Erro ao exportar CSV.",
        result.type || "error",
      );
    }

    setExportandoCsv(false);
  };

  // Exportar perguntas para CSV
  const handleExportarPerguntasCsv = async () => {
    setExportandoCsv(true);

    const result = await perguntasService.exportarCsv();

    if (!result.success) {
      showNotification(
        result.message || "Erro ao exportar perguntas.",
        result.type || "error",
      );
    }

    setExportandoCsv(false);
  };

  // Exportar convites para CSV
  const handleExportarConvitesCsv = async () => {
    setExportandoCsv(true);

    const result = await convitesService.exportarCsv();

    if (!result.success) {
      showNotification(
        result.message || "Erro ao exportar convites.",
        result.type || "error",
      );
    }

    setExportandoCsv(false);
  };

  // Exportar validações para CSV
  const handleExportarValidacoesCsv = async () => {
    setExportandoCsv(true);

    const result = await validacoesService.exportarCsv();

    if (!result.success) {
      showNotification(
        result.message || "Erro ao exportar validações.",
        result.type || "error",
      );
    }

    setExportandoCsv(false);
  };

  // Exportar validações para CSV
  const handleExportarBugsCsv = async () => {
    setExportandoCsv(true);

    const result = await bugsService.exportarCsv();

    if (!result.success) {
      showNotification(
        result.message || "Erro ao exportar bugs.",
        result.type || "error",
      );
    }

    setExportandoCsv(false);
  };

  /* ############################## Funções - Exportação ############################## */

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
        titulo="Painel Administrativo"
        subtitulo="Gestão centralizada do ecossistema ESG4U."
      >
        <span className="flex items-center gap-6">
          <button
            onClick={
              activeTab === "visao"
                ? carregarDashboard
                : activeTab === "usuarios"
                  ? carregarUsuarios
                  : activeTab === "diagnostico"
                    ? carregarPerguntas
                    : activeTab === "convites"
                      ? carregarConvites
                      : activeTab === "validacoes"
                        ? carregarValidacoes
                        : carregarBugs
            }
            className="w-14 h-14 flex items-center justify-center bg-slate-50 p-2 rounded-2xl shadow text-slate-400 transition-colors duration-200 hover:text-emerald-600"
          >
            <IoReloadCircle size={32} />
          </button>
          <button
            onClick={
              activeTab === "visao"
                ? handleExportarDashboardCsv
                : activeTab === "usuarios"
                  ? handleExportarUsuariosCsv
                  : activeTab === "diagnostico"
                    ? handleExportarPerguntasCsv
                    : activeTab === "convites"
                      ? handleExportarConvitesCsv
                      : activeTab === "validacoes"
                        ? handleExportarValidacoesCsv
                        : handleExportarBugsCsv
            }
            className="bg-slate-900 px-6 py-3 rounded-2xl text-lg text-slate-50 font-black shadow-xl shadow-slate-300/50 flex items-center gap-2 transition-colors duration-300 hover:bg-slate-800"
          >
            {exportandoCsv ? (
              <Loading size={20} borderWidth={2} />
            ) : (
              <LuDownload />
            )}
            Exportar Dados
          </button>
        </span>
      </Titulo>
      <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
      <div>
        {activeTab === "visao" && (
          <>
            {erroDashboard && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {erroDashboard}
              </div>
            )}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <span className="w-14 h-14 flex items-center justify-center p-3 bg-sky-50 text-sky-500 border border-sky-200 rounded-xl">
                    <RxPeople size={28} />
                  </span>
                  <h2 className="font-medium text-slate-500">
                    Total de Usuários
                  </h2>
                  <p className="text-2xl font-bold text-slate-950">
                    {dashboardData.totalUsuarios}
                  </p>
                </Card>
                <Card>
                  <span className="w-14 h-14 flex items-center justify-center p-3 bg-emerald-50 text-emerald-500 border border-emerald-200 rounded-xl">
                    <FaArrowTrendUp size={28} />
                  </span>
                  <h2 className="font-medium text-slate-500">
                    Score ESG Médio Global
                  </h2>
                  <p className="text-2xl font-bold text-slate-950">
                    {dashboardData.scoreMedio}
                  </p>
                </Card>
                <Card>
                  <span className="w-14 h-14 flex items-center justify-center p-3 bg-purple-50 text-purple-500 border border-purple-200 rounded-xl">
                    <FaRegFileAlt size={28} />
                  </span>
                  <h2 className="font-medium text-slate-500">
                    Evidências
                  </h2>
                  <p className="text-2xl font-bold text-slate-950">
                    {dashboardData.evidenciasAnexadas}
                  </p>
                </Card>
                <Card>
                  <span className="w-14 h-14 flex items-center justify-center p-3 bg-amber-50 text-amber-500 border border-amber-200 rounded-xl">
                    <LuShieldCheck size={28} />
                  </span>
                  <h2 className="font-medium text-slate-500">
                    Validações Pendentes
                  </h2>
                  <p className="text-2xl font-bold text-slate-950">
                    {dashboardData.validacoesPendentes}
                  </p>
                </Card>
              </div>
              <div className="w-full grid gap-4 grid-cols-1 lg:grid-cols-3">
                <Card>
                  <span className="w-14 h-14 flex items-center justify-center p-3 bg-indigo-50 text-indigo-500 border border-indigo-200 rounded-xl">
                    <IoMailOutline size={28} />
                  </span>
                  <h2 className="font-medium text-slate-500">
                    Convites Enviados
                  </h2>
                  <p className="text-2xl font-bold text-slate-950">
                    {dashboardData.convitesEnviados}
                  </p>
                </Card>
                <Card>
                  <span className="w-14 h-14 flex items-center justify-center p-3 bg-lime-50 text-lime-500 border border-lime-200 rounded-xl">
                    <HiOutlineLightningBolt size={28} />
                  </span>
                  <h2 className="font-medium text-slate-500">
                    Taxa de Conversão 
                  </h2>
                  <p className="text-2xl font-bold text-slate-950">
                    {dashboardData.taxaConversaoConvites}%
                  </p>
                </Card>
                <Card>
                  <span className="w-14 h-14 flex items-center justify-center p-3 bg-red-50 text-red-500 border border-red-200 rounded-xl">
                    <LuShieldAlert size={28} />
                  </span>
                  <h2 className="font-medium text-slate-500">
                    Bugs Reportados
                  </h2>
                  <p className="text-2xl font-bold text-slate-950">
                    {dashboardData.bugsReportados}
                  </p>
                </Card>
              </div>
            </div>
          </>
        )}
        {activeTab === "usuarios" && (
          <>
            {erro && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {erro}
              </div>
            )}
            <DataTable
              columns={userColumns}
              data={usuarios}
              loading={loading}
              actions={[
                {
                  label: "Editar",
                  icon: <LuPencil size={14} />,
                  className: "text-slate-700 hover:bg-slate-100",
                  onClick: handleUserEdit,
                },
                {
                  label: "Excluir",
                  icon: <LuTrash2 size={14} />,
                  className: "text-red-600 hover:bg-red-50",
                  onClick: handleUserDelete,
                },
              ]}
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
              <div className="flex flex-wrap gap-3 md:items-center md:justify-between">
                <span className="flex flex-wrap items-center gap-3 md:w-[75%]">
                  <Input
                    icon={<RxMagnifyingGlass />}
                    placeholder="Nome do usuário"
                    className="w-full md:w-auto"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                  />
                  <Input
                    icon={<RxMagnifyingGlass />}
                    placeholder="E-mail do usuário"
                    className="w-full md:w-auto"
                    value={filtroEmail}
                    onChange={(e) => setFiltroEmail(e.target.value)}
                  />
                </span>
                <div className="flex items-center gap-3">
                  {(filtroNome || filtroEmail) && (
                    <Button
                      text="Limpar Filtros"
                      onClick={() => {
                        setFiltroNome("");
                        setFiltroEmail("");
                        setPageValidacoes(1);
                      }}
                    />
                  )}
                  <span className="text-xs font-bold text-slate-400">
                    {loading ? (
                      <Loading size={16} borderWidth={2} />
                    ) : (
                      `${paginacao.registros} USUÁRIOS`
                    )}
                  </span>
                </div>
              </div>
            </DataTable>
            <ModalForm
              titulo="Editar Usuário"
              onClose={() => setUserEditModal(false)}
              openModal={userEditModal}
              submit={submitEdit}
            >
              <Input
                label="NOME DO USUÁRIO"
                tipo="text"
                placeholder="Nome do usuário"
                className="col-span-2"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
              />
              <Input
                label="E-MAIL DO USUÁRIO"
                tipo="text"
                placeholder="E-mail do usuário"
                className="col-span-2"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
              />
              <Checkbox
                label="ADMIN"
                className="col-span-1"
                checked={adminUsuario === true}
                onChange={(val) => setAdminUsuario(val)}
              />
              <Input
                label="SCORE ESG"
                tipo="text"
                disabled
                className="col-span-1"
                value={scoreUsuario}
              />
              <Input
                label="TRUST SCORE"
                tipo="text"
                disabled
                className="col-span-1"
                value={trustUsuario}
              />
              <Input
                label="REPUTAÇÃO"
                tipo="text"
                disabled
                className="col-span-1"
                value={reputacaoUsuario}
              />
            </ModalForm>
            <ModalDelete
              titulo="Excluir Usuário"
              onClose={() => setUserDeleteModal(false)}
              openModal={userDeleteModal}
              handleDelete={submitDelete}
            />
          </>
        )}
        {activeTab === "diagnostico" && (
          <>
            {erroPerguntas && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {erroPerguntas}
              </div>
            )}
            <DataTable
              columns={perguntasColumns}
              data={perguntas}
              loading={loadingPerguntas}
              actions={[
                {
                  label: "Editar",
                  icon: <LuPencil size={14} />,
                  className: "text-slate-700 hover:bg-slate-100",
                  onClick: handlePerguntaEdit,
                },
                {
                  label: "Excluir",
                  icon: <LuTrash2 size={14} />,
                  className: "text-red-600 hover:bg-red-50",
                  onClick: handlePerguntaDelete,
                },
              ]}
              pagination={false}
            >
              <div className="flex flex-wrap gap-3 md:items-center md:justify-between">
                <Button
                  icon={<IoAdd />}
                  text="Nova Pergunta"
                  onClick={handlePerguntaAdd}
                />
                <span className="text-xs font-bold text-slate-400">
                  {loadingPerguntas ? (
                    <Loading size={16} borderWidth={2} />
                  ) : (
                    `${perguntas.length} PERGUNTAS`
                  )}
                </span>
              </div>
            </DataTable>
            <ModalForm
              titulo={
                perguntaEditando ? "Editar Pergunta" : "Adicionar Pergunta"
              }
              onClose={() => setPerguntaModal(false)}
              openModal={perguntaModal}
              submit={perguntaEditando ? submitEditPergunta : submitAddPergunta}
            >
              <Checkbox
                label="ATIVA"
                className="col-span-1"
                checked={ativaPergunta === true}
                onChange={(val) => setAtivaPergunta(val)}
              />
              <Select
                label="EIXO ESG"
                className="col-span-1"
                placeholder="Selecione"
                required
                options={[
                  { label: "Ambiental", value: "Ambiental" },
                  { label: "Social", value: "Social" },
                  { label: "Governança", value: "Governança" },
                ]}
                value={eixoPergunta}
                onChange={(val) => setEixoPergunta(val)}
              />
              <Input
                label="TEMA"
                tipo="text"
                placeholder="Ex: Consumo Consciente"
                required
                className="col-span-1"
                value={temaPergunta}
                onChange={(e) => setTemaPergunta(e.target.value)}
              />
              <Input
                label="ORDEM DE EXIBIÇÃO"
                tipo="number"
                placeholder="Ex: 1"
                required
                className="col-span-1"
                value={indicePergunta}
                onChange={(e) => setIndicePergunta(e.target.value)}
              />
              <Input
                label="TEXTO DA PERGUNTA"
                tipo="text"
                placeholder="Digite a pergunta aqui..."
                required
                className="col-span-2"
                value={textoPergunta}
                onChange={(e) => setTextoPergunta(e.target.value)}
              />
              <Input
                label="EXEMPLO PRÁTICO"
                tipo="text"
                placeholder="Dê um exemplo para ajudar o usuário..."
                className="col-span-2"
                value={exemploPergunta}
                onChange={(e) => setExemploPergunta(e.target.value)}
              />
            </ModalForm>
            <ModalDelete
              titulo="Excluir Pergunta"
              onClose={() => setPerguntaDeleteModal(false)}
              openModal={perguntaDeleteModal}
              handleDelete={submitDeletePergunta}
            />
          </>
        )}
        {activeTab === "validacoes" && (
          <>
            {erroValidacoes && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {erroValidacoes}
              </div>
            )}
            <DataTable
              columns={validacoesColumns}
              data={validacoes}
              loading={loadingValidacoes}
              pagination={true}
              page={pageValidacoes}
              pages={paginacaoValidacoes.pages}
              perPage={perPageValidacoes}
              proxPage={paginacaoValidacoes.prox_page}
              prevPage={paginacaoValidacoes.prev_page}
              onPageChange={setPageValidacoes}
              onPerPageChange={(n) => {
                setPerPageValidacoes(n);
                setPageValidacoes(1);
              }}
            >
              <>
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      icon={<RxMagnifyingGlass />}
                      className="w-full md:w-auto"
                      placeholder="Pedido por (Nome)"
                      value={filtroValidacaoPedido}
                      onChange={(e) => setFiltroValidacaoPedido(e.target.value)}
                    />
                    <Input
                      icon={<RxMagnifyingGlass />}
                      className="w-full md:w-auto"
                      placeholder="Aprovador (E-mail)"
                      value={filtroValidacaoAprovador}
                      onChange={(e) =>
                        setFiltroValidacaoAprovador(e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {(filtroValidacaoPedido || filtroValidacaoAprovador) && (
                      <Button
                        text="Limpar Filtros"
                        onClick={() => {
                          setFiltroValidacaoPedido("");
                          setFiltroValidacaoAprovador("");
                          setPageValidacoes(1);
                        }}
                      />
                    )}
                    <span className="text-xs font-bold text-slate-400">
                      {loadingValidacoes ? (
                        <Loading size={16} borderWidth={2} />
                      ) : (
                        `${paginacaoValidacoes.registros} VALIDAÇÕES`
                      )}
                    </span>
                  </div>
                </div>
              </>
            </DataTable>
          </>
        )}
        {activeTab === "convites" && (
          <>
            {erroConvites && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {erroConvites}
              </div>
            )}
            <DataTable
              columns={convitesColumns}
              data={convites}
              loading={loadingConvites}
              pagination={true}
              page={pageConvites}
              pages={paginacaoConvites.pages}
              perPage={perPageConvites}
              proxPage={paginacaoConvites.prox_page}
              prevPage={paginacaoConvites.prev_page}
              onPageChange={setPageConvites}
              onPerPageChange={(n) => {
                setPerPageConvites(n);
                setPageConvites(1);
              }}
            >
              <>
                <div className="flex flex-wrap gap-3 items-center">
                  <Input
                    icon={<RxMagnifyingGlass />}
                    placeholder="Remetente Nome"
                    className="w-full md:w-[20%]"
                    value={filtroConviteRemetente}
                    onChange={(e) => setFiltroConviteRemetente(e.target.value)}
                  />
                  <Input
                    icon={<RxMagnifyingGlass />}
                    placeholder="E-mail Destinatário"
                    className="w-full md:w-[25%]"
                    value={filtroConviteDestinatario}
                    onChange={(e) =>
                      setFiltroConviteDestinatario(e.target.value)
                    }
                  />
                  <Select
                    placeholder="Status do Convite"
                    className="w-full md:w-[20%]"
                    value={filtroConviteStatus}
                    options={[
                      { label: "Pendente", value: "Pendente" },
                      { label: "Convertido", value: "Convertido" },
                    ]}
                    onChange={(val) => setFiltroConviteStatus(val)}
                  />
                  <DatePicker
                    placeholder="Data de Envio"
                    className="w-full md:w-[20%]"
                    value={filtroConviteDtEnvio}
                    onChange={setFiltroConviteDtEnvio}
                  />
                  {(filtroConviteRemetente ||
                    filtroConviteDestinatario ||
                    filtroConviteStatus ||
                    filtroConviteDtEnvio) && (
                    <Button
                      text="Limpar Filtros"
                      onClick={() => {
                        setFiltroConviteRemetente("");
                        setFiltroConviteDestinatario("");
                        setFiltroConviteStatus("");
                        setFiltroConviteDtEnvio(null);
                        setPageConvites(1);
                      }}
                    />
                  )}
                  <span className="text-xs font-bold text-slate-400">
                    {loadingConvites ? (
                      <Loading size={16} borderWidth={2} />
                    ) : (
                      `${paginacaoConvites.registros} CONVITES`
                    )}
                  </span>
                </div>
              </>
            </DataTable>
          </>
        )}
        {activeTab === "bugs" && (
          <>
            {erroConvites && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {erroConvites}
              </div>
            )}
            <DataTable
              columns={bugsColumns}
              data={bugs}
              actionsResolver={(row) => {
                const acoes = [
                  {
                    label: "Ver Detalhes",
                    icon: <FaRegEye size={14} />,
                    className: "text-slate-700 hover:bg-slate-100",
                    onClick: () => handleBugDetalhes(row),
                  },
                ];

                if (row.status !== "resolvido") {
                  acoes.push({
                    label: "Resolvido",
                    icon: <FaCheck size={14} />,
                    className: "text-emerald-600 hover:bg-emerald-50",
                    onClick: marcarComoResolvido,
                  });
                }

                return acoes;
              }}
              loading={loadingBugs}
              pagination={true}
              page={pageBugs}
              pages={paginacaoBugs.pages}
              perPage={perPageBugs}
              proxPage={paginacaoBugs.prox_page}
              prevPage={paginacaoBugs.prev_page}
              onPageChange={setPageBugs}
              onPerPageChange={(n) => {
                setPerPageBugs(n);
                setPageBugs(1);
              }}
            >
              <>
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <Select
                      placeholder="Status do Bug"
                      className="w-full md:w-auto"
                      value={filtroStatus}
                      options={[
                        { label: "Pendente", value: "pendente" },
                        { label: "Resolvido", value: "resolvido" },
                      ]}
                      onChange={(val) => setFiltroStatus(val)}
                    />
                    <DatePicker
                      placeholder="Data de Inicio"
                      className="w-full md:w-auto"
                      value={filtroDataInicio}
                      onChange={setFiltroDataInicio}
                    />
                    <DatePicker
                      placeholder="Data Fim"
                      className="w-full md:w-auto"
                      value={filtroDataFim}
                      onChange={setFiltroDataFim}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {(filtroStatus || filtroDataInicio || filtroDataFim) && (
                      <Button
                        text="Limpar Filtros"
                        onClick={() => {
                          setFiltroStatus("");
                          setFiltroDataInicio(null);
                          setFiltroDataFim(null);
                          setPageBugs(1);
                        }}
                      />
                    )}
                    <span className="text-xs font-bold text-slate-400">
                      {loadingBugs ? (
                        <Loading size={16} borderWidth={2} />
                      ) : (
                        `${paginacaoBugs.registros} BUGS`
                      )}
                    </span>
                  </div>
                </div>
              </>
            </DataTable>
            <ModalForm
              titulo={
                `${bugSelecionado.titulo} : ${bugSelecionado.id}` ||
                "Detalhes do Bug"
              }
              onClose={() => {
                setBugDetalhesModal(false);
                setBugSelecionado({
                  id: 0,
                  user_id: "",
                  titulo: "",
                  descricao: "",
                  print: "",
                  status: "",
                  created_at: "",
                });
              }}
              openModal={bugDetalhesModal}
              hideSubmit
            >
              <div className="col-span-2 flex items-center justify-between gap-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${bugSelecionado.status === "resolvido" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {bugSelecionado.status.toLocaleUpperCase()}
                </span>
                <span className="px-2 py-1 text-xs font-bold text-slate-800 rounded-full border border-slate-800">
                  {bugSelecionado.created_at}
                </span>
              </div>
              <p className="col-span-2 text-slate-800">
                {bugSelecionado.descricao}
              </p>
              <img
                className="col-span-2 w-full max-h-[300px] object-cover"
                src={bugSelecionado.print}
                alt="Print do Bug"
              />
            </ModalForm>
          </>
        )}
      </div>
    </>
  );
}
