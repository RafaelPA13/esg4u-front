import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";
import Notification from "../../components/Notification";

import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import authService from "../../services/apiService";

export default function RedefinirSenha() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  // Estados para os campos do formulário
  const [token, setToken] = useState(null);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleAllPasswordsVisibility = () => {
    setShowPasswords((prevShowPasswords) => !prevShowPasswords);
  };

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setNotification({
        message: "Token de redefinição de senha não encontrado ou inválido.",
        type: "danger",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    if (!token) {
      setNotification({
        message: "Token de redefinição de senha ausente.",
        type: "danger",
      });
      setLoading(false);
      return;
    }

    const result = await authService.redefinirSenha(
      token,
      novaSenha,
      confirmarNovaSenha,
    );

    if (result.success) {
      setNotification({
        message: "Senha redefinida com sucesso!",
        type: "success",
      });
      setTimeout(() => {
        navigate("/autenticacao/login");
      }, 2000);
    } else {
      setNotification({
        message: result.message,
        type: result.type || "danger",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Redefinição de senha"
        texto="Defina e confirme a sua nova senha."
        onSubmit={handleSubmit}
      >
        {token ? (
          <div className="flex flex-col gap-3">
            <Input
              label="NOVA SENHA"
              icon={<LuLockKeyhole className="text-slate-400" size={20} />}
              placeholder="Sua nova senha"
              tipo="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              externalShowPassword={showPasswords}
              onTogglePasswordVisibility={toggleAllPasswordsVisibility}
            />
            <Input
              label="CONFIRMAR NOVA SENHA"
              icon={<LuLockKeyhole className="text-slate-400" size={20} />}
              placeholder="Confirme sua nova senha"
              tipo="password"
              required
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              externalShowPassword={showPasswords}
              onTogglePasswordVisibility={toggleAllPasswordsVisibility}
            />
            <Buttons
              text={loading ? "Redefinindo..." : "Redefinir senha"}
              type="submit"
              disabled={loading}
            />
          </div>
        ) : (
          <p className="text-center text-red-500">
            Carregando ou token inválido. Por favor, solicite uma nova
            redefinição de senha.
          </p>
        )}
      </Form>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}
