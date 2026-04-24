import { IoReloadCircle } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { VscGraph } from "react-icons/vsc";
import { RxPeople } from "react-icons/rx";
import { LuTable } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { IoMailOutline } from "react-icons/io5";
import { LuShieldAlert } from "react-icons/lu";
import { RxMagnifyingGlass } from "react-icons/rx";

import Titulo from "../../components/Titulo";
import Tabs from "../../components/Tabs";
import DataTable from "../../components/DataTable";
import Input from "../../components/Input";
import Select from "../../components/Select";

import { useState } from "react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("visao");
  const [estado, setEstado] = useState("");

  const tabs = [
    { key: "visao", label: "Visão Geral", icon: <VscGraph /> },
    { key: "usuarios", label: "Usuários", icon: <RxPeople /> },
    { key: "diagnostico", label: "Diagnóstico", icon: <LuTable /> },
    { key: "validacao", label: "Validações", icon: <LuShieldCheck /> },
    { key: "convites", label: "Convites", icon: <IoMailOutline /> },
    { key: "seguranca", label: "Segurança", icon: <LuShieldAlert /> },
  ];

  const columns = [
    { key: "nome", label: "Usuário" },
    { key: "localizacao", label: "Localização", mobileVisible: false },
    { key: "scoreEsg", label: "Score ESG" },
    { key: "trustScore", label: "Trust Score", mobileVisible: false },
  ];

  const data = [
    {
      id: 1,
      nome: "Marcio Outlook",
      localizacao: "São Paulo, SP",
      scoreEsg: "0.00",
      trustScore: "50%",
    },
  ];

  const handleEdit = (row) => {
    console.log("Editar", row);
  };

  const handleDelete = (row) => {
    console.log("Deletar", row);
  };

  const estados = ["Todos os Estados", "SP", "RJ", "MG", "RS"];

  return (
    <>
      <Titulo
        titulo="Painel Administrativo"
        subtitulo="Gestão centralizada do ecossistema ESG4U."
      >
        <span className="flex items-center gap-6">
          <button className="w-14 h-14 flex items-center justify-center bg-slate-50 p-2 rounded-2xl shadow text-slate-400 transition-colors duration-200 hover:text-emerald-600">
            <IoReloadCircle size={32} />
          </button>
          <button className="bg-slate-900 px-6 py-3 rounded-2xl text-lg text-slate-50 font-black shadow-xl shadow-slate-300/50 flex items-center gap-2 transition-colors duration-300 hover:bg-slate-800">
            <LuDownload /> Exportar Dados
          </button>
        </span>
      </Titulo>
      <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === "visao" && <div>Conteúdo da visão geral</div>}
        {activeTab === "usuarios" && (
          <DataTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          >
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <span className="flex flex-wrap items-center gap-6 md:w-[75%]">
                <Input
                  width="w-full md:w-[60%]"
                  icon={<RxMagnifyingGlass />}
                  placeholder="Buscar usuário por nome ou e-mail..."
                />
                <Select
                width="w-full md:w-[30%]"
                  placeholder="Selecione um estado"
                  options={estados}
                  value={estado}
                  onChange={setEstado}
                />
              </span>
              <span className="text-xs font-bold text-slate-400">
                {data.length} USUÁRIOS
              </span>
            </div>
          </DataTable>
        )}
        {activeTab === "diagnostico" && <div>Conteúdo de diagnóstico</div>}
        {activeTab === "validacao" && <div>Conteúdo de validacao</div>}
        {activeTab === "convites" && <div>Conteúdo de convites</div>}
        {activeTab === "seguranca" && <div>Conteúdo de seguranca</div>}
      </div>
    </>
  );
}
