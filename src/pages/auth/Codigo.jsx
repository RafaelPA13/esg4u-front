import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";
import Notification from "../../components/Notification";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/apiService";

export default function Codigo() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  // Estados para os campos do formulário
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const result = await authService.validarCodigo(codigo);

    if (result.success) {
      navigate("/autenticacao/login");
    } else {
      setNotification({ message: result.message, type: "danger" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Envie o código"
        texto="Só mais uma passo para iniciar sua jornada ESG (Verifique seu e-mail)."
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <Input
            label="CÓDIGO"
            icon={<LuLockKeyhole className="text-slate-400" size={20} />}
            placeholder="Seu código de 6 dígitos"
            tipo="text"
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <Buttons
            text={loading ? "Validando..." : "Validar código"}
            type="submit"
            disabled={loading}
          />
        </div>
        <span className="w-full flex items-center justify-center gap-3">
          <p>Seu código não chegou?</p>
          <Link
            to="/autenticacao/reenviar-codigo"
            className="text-emerald-600 hover:underline font-semibold"
          >
            Reenviar Código
          </Link>
        </span>
      </Form>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}
