import { RxPerson } from "react-icons/rx";
import { IoMailOutline } from "react-icons/io5";
import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";
import Notification from "../../components/Notification";
import Loading from "../../components/Loading";
import Select from "../../components/Select";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/apiService";
import axios from "axios";

export default function Cadastro() {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [notification, setNotification] = useState(null);

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

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

  const toggleAllPasswordsVisibility = () => {
    setShowPasswords((prevShowPasswords) => !prevShowPasswords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const userData = {
      nome,
      email,
      estado,
      cidade,
      senha,
      confirmar_senha: confirmarSenha,
    };
    const result = await authService.cadastro(userData);

    if (result.success) {
      navigate("/autenticacao/validar-codigo");
    } else {
      setNotification({
        message: result.message,
        type: result.type || "warning",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 bg-slate-100 flex items-center justify-center">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Form
        titulo="Crie sua conta"
        texto="Junte-se a milhares de pessoas transformando o mundo."
        voltar
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="NOME COMPLETO"
            className="col-span-2"
            icon={<RxPerson className="text-slate-400" size={20} />}
            placeholder="Seu nome"
            tipo="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            label="E-MAIL"
            className="col-span-2"
            icon={<IoMailOutline className="text-slate-400" size={20} />}
            placeholder="seu@email.com"
            tipo="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select
            label="ESTADO"
            className="col-span-2 md:col-span-1"
            placeholder={loadingUfs ? "Carregando estados..." : "Selecione"}
            required
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
            required
            options={cidades}
            value={cidade}
            onChange={(val) => setCidade(val)}
          />
          <Input
            label="SENHA"
            className="col-span-2"
            icon={<LuLockKeyhole className="text-slate-400" size={20} />}
            placeholder="Sua senha"
            tipo="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            externalShowPassword={showPasswords}
            onTogglePasswordVisibility={toggleAllPasswordsVisibility}
          />
          <Input
            label="CONFIRMAR SENHA"
            className="col-span-2"
            icon={<LuLockKeyhole className="text-slate-400" size={20} />}
            placeholder="Confirme sua senha"
            tipo="password"
            required
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            externalShowPassword={showPasswords}
            onTogglePasswordVisibility={toggleAllPasswordsVisibility}
          />
        </div>
        <Buttons
          text={loading ? <Loading size={16} borderWidth={2} /> : "Criar conta"}
          type="submit"
          disabled={loading}
        />
        <span className="w-full flex items-center justify-center gap-3">
          <p className="text-slate-800">Já tem uma conta?</p>
          <Link
            to={"/autenticacao/login"}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Entre
          </Link>
        </span>
      </Form>
    </div>
  );
}
