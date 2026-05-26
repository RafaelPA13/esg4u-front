import { IoClose } from "react-icons/io5";

import Button from "./Button";
import Loading from "./Loading";

// Remova o useState para loading aqui, pois ele será gerenciado externamente
// import { useState } from "react"; // Não é mais necessário aqui

export default function ModalForm({
  titulo,
  onClose,
  openModal,
  submit,
  children,
  hideSubmit = false,
  submitLabel = "Salvar", // Nova prop: label customizável para o botão de submit
  submitDisabled = false, // Nova prop: para desabilitar o botão de submit externamente
}) {

  if (!openModal) return null;

  // A função handleSubmit agora não gerencia o loading interno nem fecha o modal
  // Ela apenas chama a prop `submit` que deve ser assíncrona e gerenciar o loading e o fechamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    // O loading e o fechamento do modal agora são responsabilidade da função `submit` passada via props
    await submit();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex md:items-center justify-center bg-slate-800/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full md:w-auto md:min-w-[520px] md:max-w-2xl bg-white md:rounded-2xl shadow-xl flex flex-col max-h-screen md:max-h-[80dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-800">{titulo}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-150"
          >
            <IoClose size={20} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-5 flex-1"
        >
          <div className="grid grid-cols-2 gap-4">
            {children}
            {!hideSubmit && (
              <Button
                // O texto do botão agora vem de submitLabel
                text={submitDisabled ? <Loading size={20} borderWidth={2} /> : submitLabel}
                type="submit"
                className="col-span-2"
                // O estado de disabled agora vem de submitDisabled
                disabled={submitDisabled}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}