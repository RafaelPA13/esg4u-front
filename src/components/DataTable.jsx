import { SlOptionsVertical } from "react-icons/sl";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import { useState, useEffect } from "react";

export default function DataTable({
  columns,
  data,
  children,
  onEdit,
  onDelete,

  // Props de paginação
  pagination = false,
  page = 1,
  pages = 1,
  perPage = 10,
  proxPage = false,
  prevPage = false,
  onPageChange,
  onPerPageChange,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId((current) => (current === id ? null : id));
  };

  const closeMenu = () => setOpenMenuId(null);

  useEffect(() => {
    const handleClick = () => closeMenu();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Classes reutilizáveis para os botões de paginação
  const paginationBtnBase =
    "inline-flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150 text-slate-500";
  const paginationBtnEnabled =
    "hover:bg-slate-200 hover:text-slate-800 cursor-pointer";
  const paginationBtnDisabled = "opacity-30 cursor-not-allowed";

  return (
    <div className="w-full space-y-4">
      <div className="w-full bg-slate-50 rounded-2xl shadow p-4">
        {children}
      </div>
      <div className="w-full bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-200">
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    "px-4 py-3",
                    col.mobileVisible === false ? "hidden md:table-cell" : "",
                  ].join(" ")}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-6 text-center text-slate-400"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {data.map((row) => {
              const rowId = row.id ?? row.uuid ?? JSON.stringify(row);
              return (
                <tr
                  key={rowId}
                  className="bg-slate-50 text-slate-800 text-sm border-t border-slate-200"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        "px-4 py-3 align-middle",
                        col.mobileVisible === false
                          ? "hidden md:table-cell"
                          : "",
                      ].join(" ")}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(rowId);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500"
                    >
                      <SlOptionsVertical size={16} />
                    </button>
                    {openMenuId === rowId && (
                      <div
                        className="absolute right-4 mt-2 w-32 bg-white rounded-xl shadow z-20 border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {onEdit && (
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-t-xl"
                            onClick={() => {
                              onEdit(row);
                              closeMenu();
                            }}
                          >
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                            onClick={() => {
                              onDelete(row);
                              closeMenu();
                            }}
                          >
                            Deletar
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50">
            {/* Itens por página */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Itens por página</span>
              <select
                value={perPage}
                onChange={(e) => onPerPageChange?.(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 transition-all duration-200 cursor-pointer"
              >
                {[5, 10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={!prevPage}
                onClick={() => onPageChange?.(1)}
                className={[
                  paginationBtnBase,
                  prevPage ? paginationBtnEnabled : paginationBtnDisabled,
                ].join(" ")}
                title="Primeira página"
              >
                <MdKeyboardDoubleArrowLeft size={20} />
              </button>
              <button
                type="button"
                disabled={!prevPage}
                onClick={() => onPageChange?.(page - 1)}
                className={[
                  paginationBtnBase,
                  prevPage ? paginationBtnEnabled : paginationBtnDisabled,
                ].join(" ")}
                title="Página anterior"
              >
                <MdKeyboardArrowLeft size={20} />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl min-w-[90px] text-center">
                {page} de {pages}
              </span>
              <button
                type="button"
                disabled={!proxPage}
                onClick={() => onPageChange?.(page + 1)}
                className={[
                  paginationBtnBase,
                  proxPage ? paginationBtnEnabled : paginationBtnDisabled,
                ].join(" ")}
                title="Próxima página"
              >
                <MdKeyboardArrowRight size={20} />
              </button>
              <button
                type="button"
                disabled={!proxPage}
                onClick={() => onPageChange?.(pages)}
                className={[
                  paginationBtnBase,
                  proxPage ? paginationBtnEnabled : paginationBtnDisabled,
                ].join(" ")}
                title="Última página"
              >
                <MdKeyboardDoubleArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
