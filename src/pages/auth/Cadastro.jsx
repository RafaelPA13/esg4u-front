import { RxPerson } from "react-icons/rx";
import { IoMailOutline } from "react-icons/io5";
import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";

import { useState } from "react";
import { Link } from "react-router-dom";

export default function Cadastro() {
  const [showPasswords, setShowPasswords] = useState(false);

  const toggleAllPasswordsVisibility = () => {
    setShowPasswords((prevShowPasswords) => !prevShowPasswords);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Crie sua conta"
        texto="Junte-se a milhares de pessoas transformando o mundo."
        voltar
      >
        <div className="flex flex-col gap-3">
          <Input
            label="NOME COMPLETO"
            icon={<RxPerson className="text-slate-400" size={20} />}
            placeholder="Seu nome"
            tipo="text"
            required
          />
          <Input
            label="E-MAIL"
            icon={<IoMailOutline className="text-slate-400" size={20} />}
            placeholder="seu@email.com"
            tipo="email"
            required
          />
          <Input
            label="SENHA"
            icon={<LuLockKeyhole className="text-slate-400" size={20} />}
            placeholder="Sua senha"
            tipo="password"
            required
            externalShowPassword={showPasswords}
            onTogglePasswordVisibility={toggleAllPasswordsVisibility}
          />
          <Input
            label="CONFIRMAR SENHA"
            icon={<LuLockKeyhole className="text-slate-400" size={20} />}
            placeholder="Confirme sua senha"
            tipo="password"
            required
            externalShowPassword={showPasswords}
            onTogglePasswordVisibility={toggleAllPasswordsVisibility}
          />
          <Buttons text="Criar conta" />
          <span className="w-full flex items-center justify-center gap-3">
            <p>Já tem uma conta?</p>
            <Link
              to={"/autenticacao/login"}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Faça Login
            </Link>
          </span>
        </div>
      </Form>
    </div>
  );
}
