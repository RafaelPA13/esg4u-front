import { IoClose } from "react-icons/io5";

import Button from "./Button";
import Loading from "./Loading";

import { useState } from "react";

export default function ModalForm({ titulo, onClose, openModal, submit, children }) {
  const [loading, setLoading] = useState(false);

  if (!openModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await submit();
    setLoading(false);
    onClose();
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
            <Button
              text={loading ? <Loading size={20} borderWidth={2} /> : "Salvar"}
              type="submit"
              className="col-span-2"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
