import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";

import { Link } from "react-router-dom";

export default function Codigo() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Envie o código"
        texto="Só mais uma passo para iniciar sua jornada ESG (Verifique seu e-mail)."
      >
        <div className="flex flex-col gap-3">
          <Input
            label="CÓDIGO"
            icon={<LuLockKeyhole className="text-slate-400" size={20} />}
            placeholder="Seu código de 6 dígitos"
            tipo="text"
            required
          />
          <Buttons text="Validar código" />
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
    </div>
  );
}
