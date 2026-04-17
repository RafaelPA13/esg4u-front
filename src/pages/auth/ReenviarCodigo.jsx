import { IoMailOutline } from "react-icons/io5";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";

import { Link } from "react-router-dom";

export default function ReenviarCodigo() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Reenvio de código"
        texto="Verifique seu e-mail."
      >
        <div className="flex flex-col gap-3">
          <Input
            label="E-MAIL"
            icon={<IoMailOutline className="text-slate-400" size={20} />}
            placeholder="seu@email.com"
            tipo="email"
            required
          />
          <Buttons text="Reenviar código" />
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
    </div>
  );
}