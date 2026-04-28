import { IoReloadCircle } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { IoMdGlobe } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { LuShieldAlert } from "react-icons/lu";
import { LuTable } from "react-icons/lu";
import { VscGraph } from "react-icons/vsc";
import { RxPeople } from "react-icons/rx";
import { RxMagnifyingGlass } from "react-icons/rx";

import Titulo from "../../components/Titulo";
import Tabs from "../../components/Tabs";
import DataTable from "../../components/DataTable";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Loading from "../../components/Loading";
import ModalEdicao from "../../components/ModalEdicao";
import ModalDelete from "../../components/ModalDelete";
import Notification from "../../components/Notification";

import { useState, useEffect, useCallback } from "react";
import { usuariosService } from "../../services/apiService";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("visao");

  // Notificação
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Estados da tabela
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

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

  // Modal de edição
  const [userEditModal, setUserEditModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [scoreUsuario, setScoreUsuario] = useState("");
  const [trustUsuario, setTrustUsuario] = useState("");
  const [reputacaoUsuario, setReputacaoUsuario] = useState("");
  const [adminUsuario, setAdminUsuario] = useState("");

  // Modal de exclusão
  const [userDeleteModal, setUserDeleteModal] = useState(false);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);

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

  // Abrir modal de edição
  const handleEdit = async (row) => {
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

  // Submeter edição
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

  // Abrir modal de exclusão
  const handleDelete = (row) => {
    setUsuarioParaDeletar(row);
    setUserDeleteModal(true);
  };

  // Confirmar exclusão
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

  // Estado de loading da exportação CSV
  const [exportandoCsv, setExportandoCsv] = useState(false);

  const handleExportarCsv = async () => {
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
            onClick={carregarUsuarios}
            className="w-14 h-14 flex items-center justify-center bg-slate-50 p-2 rounded-2xl shadow text-slate-400 transition-colors duration-200 hover:text-emerald-600"
          >
            <IoReloadCircle size={32} />
          </button>
          <button
            onClick={handleExportarCsv}
            className="bg-slate-900 px-6 py-3 rounded-2xl text-lg text-slate-50 font-black shadow-xl shadow-slate-300/50 flex items-center gap-2 transition-colors duration-300 hover:bg-slate-800"
          >
            <LuDownload /> Exportar Dados
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
              onEdit={handleEdit}
              onDelete={handleDelete}
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
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <span className="flex flex-wrap items-center gap-3 md:w-[75%]">
                  <Input
                    icon={<RxMagnifyingGlass />}
                    placeholder="Nome do usuário"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                  />
                  <Input
                    icon={<RxMagnifyingGlass />}
                    placeholder="E-mail do usuário"
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
            <ModalEdicao
              titulo="Editar Usuário"
              onClose={() => setUserEditModal(false)}
              openModal={userEditModal}
              handleEdit={submitEdit}
            >
              <Input
                icon={<IoPersonOutline />}
                label="NOME DO USUÁRIO"
                placeholder="Nome do usuário"
                className="col-span-2"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
              />
              <Input
                icon={<IoMailOutline />}
                label="E-MAIL DO USUÁRIO"
                placeholder="E-mail do usuário"
                className="col-span-2"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
              />
              <Input
                icon={<IoMdGlobe />}
                label="SCORE ESG"
                disabled
                className="col-span-1"
                value={scoreUsuario}
              />
              <Input
                icon={<LuShieldCheck />}
                label="TRUST SCORE"
                disabled
                className="col-span-1"
                value={trustUsuario}
              />
              <Input
                icon={<LuShieldCheck />}
                label="REPUTAÇÃO"
                disabled
                className="col-span-1"
                value={reputacaoUsuario}
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
            </ModalEdicao>
            <ModalDelete
              titulo="Excluir Usuário"
              onClose={() => setUserDeleteModal(false)}
              openModal={userDeleteModal}
              handleDelete={submitDelete}
            />
          </>
        )}
        {activeTab === "diagnostico" && <div>Conteúdo de diagnóstico</div>}
        {activeTab === "validacao" && <div>Conteúdo de validacao</div>}
        {activeTab === "convites" && <div>Conteúdo de convites</div>}
        {activeTab === "seguranca" && <div>Conteúdo de seguranca</div>}
      </div>
    </>
  );
}
