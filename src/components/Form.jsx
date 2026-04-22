import { FaArrowLeft } from "react-icons/fa6";

import { Link } from "react-router-dom";

export default function Form({ titulo, texto, voltar = false, children, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-[90%] bg-slate-50 p-10 shadow-lg rounded-4xl flex flex-col gap-6 md:w-[50%] lg:w-[30%]"
    >
      {voltar ? (
        <Link
          to={"/"}
          className="w-20 flex items-center gap-2 text-slate-500 transition-colors duration-300 hover:text-emerald-600 cursor-pointer"
        >
          <FaArrowLeft />
          Voltar
        </Link>
      ) : (
        ""
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl text-slate-800 font-bold">{titulo}</h1>
        <p className="text-slate-500">{texto}</p>
      </div>
      {children}
    </form>
  );
}
