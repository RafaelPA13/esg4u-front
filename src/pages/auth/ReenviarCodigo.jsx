import { IoMailOutline } from "react-icons/io5";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";
import Notification from "../../components/Notification";

import { Link } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/apiService";

export default function ReenviarCodigo() {
  const [notification, setNotification] = useState(null);

  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const result = await authService.reenviarCodigo(email);

    if (result.success) {
      setNotification({ message: result.data, type: "success" });
    } else {
      setNotification({ message: result.message, type: "danger" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Reenvio de código"
        texto="Verifique seu e-mail."
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
          <Buttons
            text={loading ? "Enviando..." : "Reenviar código"}
            type="submit"
            disabled={loading}
          />
        </div>
        <span className="w-full flex items-center justify-center gap-3">
          <p>Seu código chegou?</p>
          <Link
            to="/autenticacao/validar-codigo"
            className="text-emerald-600 hover:underline font-semibold"
          >
            Validar Código
          </Link>
        </span>
      </Form>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}
