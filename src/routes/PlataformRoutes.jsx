import { MdOutlineBugReport } from "react-icons/md";

import NavbarPlataform from "../components/NavbarPlataform";
import Loading from "../components/Loading";
import Tutorial from "../components/Tutorial";
import ModalForm from "../components/ModalForm";
import Notification from "../components/Notification";  // ← import que faltava
import Input from "../components/Input";
import FileDrop from "../components/FileDrop";

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { bugsService } from "../services/apiService";

export default function PlataformRoutes() {
  const { user, loading } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [modalBug, setModalBug] = useState(false);

  // Notificação
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = "success") =>
    setNotification({ message, type });
  const clearNotification = () => setNotification(null);

  // Campos do Modal de Bug
  const [tituloBug, setTituloBug] = useState("");
  const [descricaoBug, setDescricaoBug] = useState("");
  const [arquivoBug, setArquivoBug] = useState(null);
  const [salvandoBug, setSalvandoBug] = useState(false);

  const handleCloseBug = () => {
    setModalBug(false);
    setTituloBug("");
    setDescricaoBug("");
    setArquivoBug(null);
  };

  const handleSubmitBug = async () => {
    if (!tituloBug || !descricaoBug) {
      showNotification("Preencha o título e a descrição.", "warning");
      return;
    }
    if (!arquivoBug) {
      showNotification("Adicione um print do bug.", "warning");
      return;
    }

    setSalvandoBug(true);
    const result = await bugsService.reportarBug(
      tituloBug,
      descricaoBug,
      arquivoBug,
    );
    setSalvandoBug(false);

    if (result.success) {
      showNotification("Bug reportado com sucesso!", "success");
      handleCloseBug();
    } else {
      showNotification(result.message || "Erro ao reportar bug.", "error");
    }
  };

  useEffect(() => {
    if (!user) return;

    const status = user.status_questionario;
    const jaViu = sessionStorage.getItem("esg4u_tutorial_visto");

    if (!jaViu && (status === "Não Respondido" || status === "Em Andamento")) {
      setShowTutorial(true);
    }
  }, [user]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    sessionStorage.setItem("esg4u_tutorial_visto", "1");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <Loading size={24} borderWidth={2} />
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/autenticacao/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarPlataform />
      <main className="pb-16 px-6 pt-8 flex flex-col gap-6 md:w-[70%] md:mx-auto md:px-0">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-2xl text-slate-800 font-bold">
              Olá, {user ? user.nome : "Usuário"}!
            </h1>
            <p className="text-slate-500">Acompanhe sua jornada ESG hoje.</p>
          </div>
          <button
            className="p-2 rounded-full border border-slate-800 text-slate-800 hover:bg-emerald-500 hover:text-slate-50 hover:border-slate-50 transition-colors duration-300"
            onClick={() => setModalBug(true)}
          >
            <MdOutlineBugReport />
          </button>
        </div>
        <Outlet />
      </main>
      <Tutorial open={showTutorial} onClose={handleCloseTutorial} />
      <ModalForm
        titulo="Reportar Bug"
        onClose={handleCloseBug}
        openModal={modalBug}
        submit={handleSubmitBug}
        submitDisabled={salvandoBug}
      >
        <Input
          label="TÍTULO"
          tipo="text"
          placeholder="Título do bug"
          className="col-span-2"
          required
          value={tituloBug}
          onChange={(e) => setTituloBug(e.target.value)}
        />
        <Input
          label="DESCRIÇÃO"
          tipo="text"
          textarea
          placeholder="Descrição do bug"
          className="col-span-2"
          required
          value={descricaoBug}
          onChange={(e) => setDescricaoBug(e.target.value)}
        />
        <FileDrop
          title="Imagem do Bug"
          file={arquivoBug}
          onChange={setArquivoBug}
        />
      </ModalForm>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </div>
  );
}