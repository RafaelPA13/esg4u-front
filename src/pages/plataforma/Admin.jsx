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

import Titulo from "../../components/Titulo";
import Tabs from "../../components/Tabs";
import DataTable from "../../components/DataTable";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Loading from "../../components/Loading";
import ModalForm from "../../components/ModalForm";
import ModalDelete from "../../components/ModalDelete";
import Notification from "../../components/Notification";
import Button from "../../components/Button";

import { useState, useEffect, useCallback } from "react";
import { usuariosService, perguntasService } from "../../services/apiService";

export default function Admin() {
  /* ############################## Estados ############################## */

  // Tab ativa
  const [activeTab, setActiveTab] = useState("visao");

  // Notificação
  const [notification, setNotification] = useState(null);

  // Tabela usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Tabela perguntas
  const [perguntas, setPerguntas] = useState([]);
  const [loadingPerguntas, setLoadingPerguntas] = useState(false);
  const [erroPerguntas, setErroPerguntas] = useState(null);

  // Paginação
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paginacao, setPaginacao] = useState({
    registros: 0,
    pages: 1,
    prox_page: false,
    prev_page: false,
  });

  // Filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");

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

  // Estado de loading da exportação CSV
  const [exportandoCsv, setExportandoCsv] = useState(false);
  const [exportandoPerguntasCsv, setExportandoPerguntasCsv] = useState(false);

  /* ############################## Estados ############################## */

  /* ############################## Variáveis ############################## */

  // Tabs
  const tabs = [
    { key: "visao", label: "Visão Geral", icon: <VscGraph /> },
    { key: "usuarios", label: "Usuários", icon: <RxPeople /> },
    { key: "diagnostico", label: "Diagnóstico", icon: <LuTable /> },
    { key: "validacao", label: "Validações", icon: <LuShieldCheck /> },
    { key: "convites", label: "Convites", icon: <IoMailOutline /> },
    { key: "seguranca", label: "Segurança", icon: <LuShieldAlert /> },
  ];

  // Colunas
  const userColumns = [
    { key: "nome", label: "Usuário" },
    { key: "email", label: "E-mail", mobileVisible: false },
    { key: "score_esg", label: "Score ESG", mobileVisible: false },
    { key: "trust_score", label: "Trust Score", mobileVisible: false },
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

  /* ############################## Funções - Modal ############################## */

  /* ############################## Funções - Submissão e Confirmação ############################## */

  // Submeter edição de usuário
  const submitEdit = async () => {
    if (!usuarioSelecionado) return;

    const result = await usuariosService.atualizar(usuarioSelecionado.id, {
      nome: nomeUsuario,
      email: emailUsuario,
      admin: adminUsuario === true,
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

  // Carregar usuários
  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    setErro(null);

    const filtros = {};
    if (filtroNome.trim()) filtros.nome = filtroNome.trim();
    if (filtroEmail.trim()) filtros.email = filtroEmail.trim();

    const result = await usuariosService.listar({ page, perPage, filtros });

    if (result.success) {
      setUsuarios(result.data.users ?? []);
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
  }, [page, perPage, filtroNome, filtroEmail]);

  useEffect(() => {
    if (activeTab === "usuarios") carregarUsuarios();
  }, [activeTab, page, perPage]);

  useEffect(() => {
    if (activeTab === "usuarios") {
      if (page !== 1) setPage(1);
      else carregarUsuarios();
    }
  }, [filtroNome, filtroEmail]);

  // Carregar perguntas
  const carregarPerguntas = useCallback(async () => {
    setLoadingPerguntas(true);
    setErroPerguntas(null);

    const result = await perguntasService.listar();

    if (result.success) {
      // Backend já traz ordenado por indice
      setPerguntas(result.data ?? []);
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

  /* ############################## Funções - Auxiliares ############################## */

  /* ############################## Funções - Exportação ############################## */

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
              activeTab === "usuarios"
                ? carregarUsuarios
                : activeTab === "diagnostico"
                  ? carregarPerguntas
                  : undefined
            }
            className="w-14 h-14 flex items-center justify-center bg-slate-50 p-2 rounded-2xl shadow text-slate-400 transition-colors duration-200 hover:text-emerald-600"
          >
            <IoReloadCircle size={32} />
          </button>
          <button
            onClick={
              activeTab === "usuarios"
                ? handleExportarUsuariosCsv
                : activeTab === "diagnostico"
                  ? handleExportarPerguntasCsv
                  : undefined
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
        {activeTab === "visao" && <div>Conteúdo da visão geral</div>}
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
              onEdit={handleUserEdit}
              onDelete={handleUserDelete}
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
                <span className="text-xs font-bold text-slate-400">
                  {loading ? (
                    <Loading size={16} borderWidth={2} />
                  ) : (
                    `${paginacao.registros} USUÁRIOS`
                  )}
                </span>
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
              <Select
                label="Admin"
                className="col-span-1"
                placeholder="É admin?"
                options={[
                  { label: "Selecione", value: "" },
                  { label: "Sim", value: true },
                  { label: "Não", value: false },
                ]}
                value={adminUsuario}
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
              onEdit={handlePerguntaEdit}
              onDelete={handlePerguntaDelete}
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
              <Select
                label="ATIVA"
                className="col-span-1"
                placeholder="Selecione"
                required
                options={[
                  { label: "True", value: true },
                  { label: "False", value: false },
                ]}
                value={ativaPergunta}
                onChange={(val) => setAtivaPergunta(val)}
              />
              <Select
                label="EIXO ESG"
                className="col-span-1"
                placeholder="Selecione"
                required
                options={[
                  { label: "Ambiental", value: "ambiental" },
                  { label: "Social", value: "social" },
                  { label: "Governança", value: "governança" },
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
        {activeTab === "validacao" && <div>Conteúdo de validacao</div>}
        {activeTab === "convites" && <div>Conteúdo de convites</div>}
        {activeTab === "seguranca" && <div>Conteúdo de seguranca</div>}
      </div>
    </>
  );
}
