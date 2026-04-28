import { IoClose } from "react-icons/io5";

import Button from "./Button";
import Loading from "./Loading";

import { useState } from "react";

export default function ModalDelete({
  titulo,
  onClose,
  openModal,
  handleDelete,
}) {
  const [loading, setLoading] = useState(false);

  if (!openModal) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await handleDelete();
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center bg-slate-800/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full md:w-auto md:min-w-[400px] md:max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90dvh] md:max-h-[80dvh]"
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
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 flex-1">
          <p className="text-sm text-slate-500 text-center">
            Esta ação não poderá ser desfeita. Deseja continuar?
          </p>
          <Button
            text={
              loading ? (
                <Loading size={20} borderWidth={2} />
              ) : (
                "Confirmar Exclusão"
              )
            }
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 shadow-red-200"
          />
        </div>
      </div>
    </div>
  );
}
