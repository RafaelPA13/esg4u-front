import { LuLockKeyhole } from "react-icons/lu";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Buttons from "../../components/Button";

import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export default function RedefinirSenha() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const toggleAllPasswordsVisibility = () => {
    setShowPasswords(prevShowPasswords => !prevShowPasswords);
  };

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Form
        titulo="Redefinição de senha"
        texto="Defina e confirme a sua nova senha."
      >
        {token ? (
          <div className="flex flex-col gap-3">
            <Input
              label="NOVA SENHA"
              icon={<LuLockKeyhole className="text-slate-400" size={20} />}
              placeholder="Sua nova senha"
              tipo="password"
              required
              externalShowPassword={showPasswords}
              onTogglePasswordVisibility={toggleAllPasswordsVisibility}
            />
            <Input
              label="CONFIRMAR NOVA SENHA"
              icon={<LuLockKeyhole className="text-slate-400" size={20} />}
              placeholder="Confirme sua nova senha"
              tipo="password"
              required
              externalShowPassword={showPasswords}
              onTogglePasswordVisibility={toggleAllPasswordsVisibility}
            />
            <Buttons text="Redefinir senha" />
          </div>
        ) : (
          <p className="text-center text-red-500">Carregando ou token inválido. Por favor, solicite uma nova redefinição de senha.</p>
        )}
      </Form>
    </div>
  );
}