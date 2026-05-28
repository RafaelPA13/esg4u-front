import { LuPencil } from "react-icons/lu";
import { LuShare2 } from "react-icons/lu";
import { MdPerson } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuShieldCheck } from "react-icons/lu";
import { RiQuestionnaireLine } from "react-icons/ri";
import { LuHouse } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";

import Card from "../../components/Card";
import ModalForm from "../../components/ModalForm";
import Input from "../../components/Input";
import Select from "../../components/Select";
import FileDrop from "../../components/FileDrop";
import Notification from "../../components/Notification";
import Loading from "../../components/Loading";

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { authService, usuariosService } from "../../services/apiService";

export default function Perfil() {
  const { user, setUser } = useAuth();

  // Notificação
  const [notification, setNotification] = useState(null);

  // Estados para o formulário de edição de perfil
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [estado, setEstado] = useState(user?.estado || "");
  const [cidade, setCidade] = useState(user?.cidade || "");
  const [tipoMoradia, setTipoMoradia] = useState(user?.tipo_moradia || "");
  const [pessoasFamilia, setPessoasFamilia] = useState(
    user?.pessoas_familia || "",
  );
  const [faixaEtaria, setFaixaEtaria] = useState(user?.faixa_etaria || "");
  const [grauEscolaridade, setGrauEscolaridade] = useState(
    user?.grau_escolaridade || "",
  );
  const [situacaoProfissional, setSituacaoProfissional] = useState(
    user?.situacao_profissional || "",
  );
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Novos estados para os selects de UF e Cidade
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingUfs, setLoadingUfs] = useState(true);
  const [loadingCidades, setLoadingCidades] = useState(false);

  // Efeito para carregar os estados (UF) ao montar o componente
  useEffect(() => {
    const fetchUfs = async () => {
      try {
        setLoadingUfs(true);
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
        );
        const ufOptions = response.data.map((uf) => ({
          label: uf.sigla,
          value: uf.sigla,
          id: uf.id, // Guardar o ID do IBGE para buscar as cidades
        }));
        setUfs(ufOptions);
      } catch (error) {
        console.error("Erro ao carregar UFs:", error);
        setNotification({
          message: "Erro ao carregar estados. Tente novamente.",
          type: "error",
        });
      } finally {
        setLoadingUfs(false);
      }
    };
    fetchUfs();
  }, []);

  // Efeito para carregar as cidades quando o estado (UF) selecionado muda
  useEffect(() => {
    const fetchCidades = async () => {
      if (!estado) {
        setCidades([]);
        setCidade(""); // Limpa a cidade selecionada se o estado for desmarcado
        return;
      }

      try {
        setLoadingCidades(true);
        // Encontra o ID do estado selecionado a partir da lista de UFs
        const selectedUf = ufs.find((uf) => uf.value === estado);
        if (!selectedUf) {
          setCidades([]);
          setCidade("");
          return;
        }

        const response = await axios.get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf.id}/municipios?orderBy=nome`,
        );
        const cidadeOptions = response.data.map((cidade) => ({
          label: cidade.nome,
          value: cidade.nome,
        }));
        setCidades(cidadeOptions);
        setCidade(""); // Reseta a cidade ao mudar o estado
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
        setNotification({
          message: "Erro ao carregar cidades. Tente novamente.",
          type: "error",
        });
      } finally {
        setLoadingCidades(false);
      }
    };

    fetchCidades();
  }, [estado, ufs]);

  const statusCards = [
    {
      icon: <FaArrowTrendUp size={20} className="text-emerald-500" />,
      bgColor: "bg-emerald-100 border-emerald-200",
      title: "SCORE ESG GERAL",
      value: user?.score_esg || "00.0",
    },
    {
      icon: <LuShieldCheck size={20} className="text-sky-500" />,
      bgColor: "bg-sky-100 border-sky-200",
      title: "REPUTAÇÃO",
      value: user?.reputacao || 0,
    },
    {
      icon: <RiQuestionnaireLine size={20} className="text-rose-500" />,
      bgColor: "bg-rose-100 border-rose-200",
      title: "QUESTIONÁRIO",
      value: user?.status_questionario || "Não respondido",
    },
  ];

  const grauInstrucaoOptions = [
    {
      label: "Ensino fundamental incompleto",
      value: "Ensino fundamental incompleto",
    },
    {
      label: "Ensino fundamental completo",
      value: "Ensino fundamental completo",
    },
    { label: "Ensino médio incompleto", value: "Ensino médio incompleto" },
    { label: "Ensino médio completo", value: "Ensino médio completo" },
    { label: "Ensino técnico", value: "Ensino técnico" },
    {
      label: "Ensino superior incompleto",
      value: "Ensino superior incompleto",
    },
    { label: "Ensino superior completo", value: "Ensino superior completo" },
    { label: "Pós-graduação/MBA", value: "Pós-graduação/MBA" },
    { label: "Mestrado", value: "Mestrado" },
    { label: "Doutorado", value: "Doutorado" },
    { label: "Prefiro não informar", value: null },
  ];

  const situacaoProfissionalOptions = [
    { label: "Empregado(a) CLT", value: "Empregado(a) CLT" },
    { label: "Servidor(a) público(a)", value: "Servidor(a) público(a)" },
    { label: "Empresário(a)", value: "Empresário(a)" },
    { label: "Autônomo(a)/freelancer", value: "Autônomo(a)/freelancer" },
    { label: "Profissional liberal", value: "Profissional liberal" },
    { label: "Estudante", value: "Estudante" },
    { label: "Desempregado(a)", value: "Desempregado(a)" },
    { label: "Aposentado(a)", value: "Aposentado(a)" },
    { label: "Outro", value: "Outro" },
    { label: "Prefiro não informar", value: null },
  ];

  const tipoMoradiaOptions = [
    { label: "Casa", value: "Casa" },
    { label: "Apartamento", value: "Apartamento" },
    { label: "Condomínio fechado", value: "Condomínio fechado" },
    { label: "Área rural/chácara/sítio", value: "Área rural/chácara/sítio" },
    { label: "Habitação compartilhada", value: "Habitação compartilhada" },
    { label: "Outro", value: "Outro" },
    { label: "Prefiro não informar", value: null },
  ];

  const pessoasMorandoOptions = [
    { label: "Moro sozinho(a)", value: "Moro sozinho(a)" },
    { label: "2 pessoas", value: "2 pessoas" },
    { label: "3 pessoas", value: "3 pessoas" },
    { label: "4 pessoas", value: "4 pessoas" },
    { label: "5 pessoas ou mais", value: "5 pessoas ou mais" },
    { label: "Prefiro não informar", value: null },
  ];

  const faixaEtariaOptions = [
    { label: "Até 18 anos", value: "Até 18 anos" },
    { label: "19 a 25 anos", value: "19 a 25 anos" },
    { label: "26 a 35 anos", value: "26 a 35 anos" },
    { label: "36 a 45 anos", value: "36 a 45 anos" },
    { label: "46 a 60 anos", value: "46 a 60 anos" },
    { label: "Mais de 60 anos", value: "Mais de 60 anos" },
    { label: "Prefiro não informar", value: null },
  ];

  const handleUpdateProfile = async () => {
    setLoadingSubmit(true);
    if (!user?.id) {
      setNotification({
        message: "Usuário não encontrado.",
        type: "error",
      });
      return;
    }

    const payload = {
      nome,
      email,
      estado,
      cidade,
      tipo_moradia: tipoMoradia,
      pessoas_familia: pessoasFamilia,
      faixa_etaria: faixaEtaria,
      grau_escolaridade: grauEscolaridade,
      situacao_profissional: situacaoProfissional,
      foto: fotoPerfil,
      admin: user.admin,
    };

    const updateResult = await usuariosService.atualizar(user.id, payload);
    setLoadingSubmit(false);

    if (!updateResult.success) {
      setNotification({
        message: updateResult.message || "Erro ao atualizar perfil.",
        type: updateResult.type || "error",
      });

      return;
    }

    // Rebusca usuário atualizado
    const meResult = await authService.me();

    if (meResult.success) {
      setUser(meResult.data);

      setNotification({
        message: "Perfil atualizado com sucesso!",
        type: "success",
      });

      setOpenModal(false);
    } else {
      setNotification({
        message: "Perfil atualizado, mas houve erro ao recarregar usuário.",
        type: "warning",
      });
    }
  };

  useEffect(() => {
    if (!user) return;

    setNome(user.nome || "");
    setEmail(user.email || "");
    setEstado(user.estado || "");
    setCidade(user.cidade || "");
    setTipoMoradia(user.tipo_moradia || "");
    setPessoasFamilia(user.pessoas_familia || "");
    setFaixaEtaria(user.faixa_etaria || "");
    setGrauEscolaridade(user.grau_escolaridade || "");
    setSituacaoProfissional(user.situacao_profissional || "");
  }, [user]);

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="h-24 bg-linear-to-r from-emerald-500 to-emerald-600" />
        <div className="px-5 pb-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <div
                className="w-18 h-18 rounded-xl bg-slate-100 border-3 border-white flex items-center justify-center overflow-hidden shrink-0"
                style={{
                  width: 72,
                  height: 72,
                  marginTop: -36,
                  borderWidth: 3,
                }}
              >
                <span className="w-full h-full text-3xl text-slate-400">
                  {user?.foto_perfil ? (
                    <img
                      className="w-full h-full object-cover"
                      src={user?.foto_perfil}
                      alt={`Foto de ${user?.nome}`}
                    />
                  ) : (
                    <MdPerson className="w-full h-full" />
                  )}
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-slate-800">
                  {user?.nome || "Usuário"}
                </h1>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <strong>E-mail:</strong> {user?.email || "user@email.com"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <button
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setOpenModal(true)}
              >
                <LuPencil size={14} />
                Editar Perfil
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                <LuShare2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusCards.map((card, index) => (
          <Card key={index}>
            <div className="flex items-center gap-4">
              <span className={`border ${card.bgColor} p-3 rounded-lg`}>
                {card.icon}
              </span>
              <div>
                <p className="text-xs text-slate-500">{card.title}</p>
                <h2 className="text-lg font-bold text-slate-800">
                  {card.value}
                </h2>
              </div>
            </div>
          </Card>
        ))}
      </ul>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <span className="flex items-center gap-3 font-semibold text-slate-800">
            <LuHouse size={20} className="text-emerald-600" /> Informações
            Residenciais
          </span>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <li>
              <p className="text-xs text-slate-400 font-bold">ESTADO</p>
              <h2 className="text-sm text-slate-800 font-medium">
                {user?.estado || "Não Informado"}
              </h2>
            </li>
            <li>
              <p className="text-xs text-slate-400 font-bold">MORADIA</p>
              <h2 className="text-sm text-slate-800 font-medium">
                {user?.tipo_moradia || "Não Informado"}
              </h2>
            </li>
            <li>
              <p className="text-xs text-slate-400 font-bold">CIDADE</p>
              <h2 className="text-sm text-slate-800 font-medium">
                {user?.cidade || "Não Informado"}
              </h2>
            </li>
            <li>
              <p className="text-xs text-slate-400 font-bold">FAMÍLIA</p>
              <h2 className="text-sm text-slate-800 font-medium">
                {user?.pessoas_familia || "Não Informado"}
              </h2>
            </li>
          </ul>
        </Card>
        <div className="col-span-1 bg-slate-900 p-6 rounded-xl flex flex-col gap-3">
          <span className="flex items-center gap-2 text-slate-50">
            <IoPersonOutline size={20} className="text-emerald-600" /> Perfil
            Demográfico
          </span>
          <ul className="flex flex-col gap-2">
            <li>
              <p className="text-xs text-slate-400 font-bold">FAIXA ETÁRIA</p>
              <h2 className="text-sm text-slate-50 font-medium">
                {user?.faixa_etaria || "Não Informado"}
              </h2>
            </li>
            <li>
              <p className="text-xs text-slate-400 font-bold">
                GRAU DE ESCOLARIDADE
              </p>
              <h2 className="text-sm text-slate-50 font-medium">
                {user?.grau_escolaridade || "Não Informado"}
              </h2>
            </li>
            <li>
              <p className="text-xs text-slate-400 font-bold">
                SITUAÇÃO PROFISSIONAL
              </p>
              <h2 className="text-sm text-slate-50 font-medium">
                {user?.situacao_profissional || "Não Informado"}
              </h2>
            </li>
          </ul>
        </div>
      </div>
      <ModalForm
        titulo="Editar Perfil"
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        submit={handleUpdateProfile}
        submitLabel={loadingSubmit ? <Loading size={16} borderWidth={2}/> : "Salvar"}
      >
        <FileDrop
          title="Foto de Perfil"
          file={fotoPerfil}
          onChange={setFotoPerfil}
        />
        <Input
          label="NOME"
          tipo="text"
          placeholder="Nome do usuário"
          className="col-span-2"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          label="E-MAIL"
          className="col-span-2"
          placeholder="seu@email.com"
          tipo="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select
          label="ESTADO"
          className="col-span-2"
          placeholder={loadingUfs ? "Carregando estados..." : "Selecione"}
          options={ufs}
          value={estado}
          onChange={(val) => {
            setEstado(val);
            setCidade("");
          }}
        />
        <Select
          label="CIDADE"
          className="col-span-2 md:col-span-1"
          placeholder={
            loadingCidades
              ? "Carregando cidades..."
              : estado
                ? "Selecione"
                : "Selecione um estado primeiro"
          }
          options={cidades}
          value={cidade}
          onChange={(val) => setCidade(val)}
        />
        <Select
          label="TIPO MORADIA"
          className="col-span-2 md:col-span-1"
          placeholder={"Selecione"}
          options={tipoMoradiaOptions}
          value={tipoMoradia}
          onChange={(val) => setTipoMoradia(val)}
        />
        <Select
          label="PESSOAS NA FAMÍLIA"
          className="col-span-2 md:col-span-1"
          placeholder={"Selecione"}
          options={pessoasMorandoOptions}
          value={pessoasFamilia}
          onChange={(val) => setPessoasFamilia(val)}
        />
        <Select
          label="FAIXA ETÁRIA"
          className="col-span-2 md:col-span-1"
          placeholder={"Selecione"}
          options={faixaEtariaOptions}
          value={faixaEtaria}
          onChange={(val) => setFaixaEtaria(val)}
        />
        <Select
          label="GRAU DE ESCOLARIDADE"
          className="col-span-2 md:col-span-1"
          placeholder={"Selecione"}
          options={grauInstrucaoOptions}
          value={grauEscolaridade}
          onChange={(val) => setGrauEscolaridade(val)}
        />
        <Select
          label="SITUAÇÃO PROFISSIONAL"
          className="col-span-2 md:col-span-1"
          placeholder={"Selecione"}
          options={situacaoProfissionalOptions}
          value={situacaoProfissional}
          onChange={(val) => setSituacaoProfissional(val)}
        />
      </ModalForm>
    </>
  );
}
