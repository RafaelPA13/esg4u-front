import { RxPerson } from "react-icons/rx";
import { IoMailOutline } from "react-icons/io5";
import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";
import Notification from "../../components/Notification";
import Loading from "../../components/Loading";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/apiService";

export default function Cadastro() {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [notification, setNotification] = useState(null);

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleAllPasswordsVisibility = () => {
    setShowPasswords((prevShowPasswords) => !prevShowPasswords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const userData = { nome, email, senha, confirmar_senha: confirmarSenha };
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Crie sua conta"
        texto="Junte-se a milhares de pessoas transformando o mundo."
        voltar
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <Input
            label="NOME COMPLETO"
            icon={<RxPerson className="text-slate-400" size={20} />}
            placeholder="Seu nome"
            tipo="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            label="E-MAIL"
            icon={<IoMailOutline className="text-slate-400" size={20} />}
            placeholder="seu@email.com"
            tipo="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="SENHA"
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
            icon={<LuLockKeyhole className="text-slate-400" size={20} />}
            placeholder="Confirme sua senha"
            tipo="password"
            required
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            externalShowPassword={showPasswords}
            onTogglePasswordVisibility={toggleAllPasswordsVisibility}
          />
          <Buttons
            text={loading ? <Loading size={16} borderWidth={2}/> : "Criar conta"}
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
        </div>
      </Form>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}
