import { IoMailOutline } from "react-icons/io5";
import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";
import Notification from "../../components/Notification";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const [notification, setNotification] = useState(null);

  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const credentials = { email, senha };
    const result = await authService.login(credentials);
    
    if (result.success) {
      const token = result.data.token;
      localStorage.setItem("esg4u_token", token);
      const userResult = await authService.me(token);
      if (userResult.success) {
        loginContext(token, userResult.data);
        navigate("/plataforma/dashboard");
      } else {
        setNotification({
          message: userResult.message || "Erro ao carregar dados do usuário.",
          type: "danger",
        });
        authService.logout();
      }
    } else {
      setNotification({ message: result.message, type: "danger" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Bem-vindo de volta"
        texto="Entre para acompanhar sua jornada ESG."
        voltar
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3">
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
          />
          <Link
            to="/autenticacao/solicitar-nova-senha"
            className="text-emerald-600 hover:underline font-semibold self-end"
          >
            Esqueci minha senha
          </Link>
          <Buttons
            text={loading ? "Entrando..." : "Entrar"}
            type="submit"
            disabled={loading}
          />
        </div>
        <span className="w-full flex items-center justify-center gap-3">
          <p>Não tem uma conta?</p>
          <Link
            to="/autenticacao/cadastro"
            className="text-emerald-600 hover:underline font-semibold"
          >
            Cadastre-se
          </Link>
        </span>
      </Form>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}
