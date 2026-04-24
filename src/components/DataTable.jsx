import { SlOptionsVertical } from "react-icons/sl";

import { useState, useEffect } from "react";

export default function DataTable({ columns, data, children, onEdit, onDelete }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId((current) => (current === id ? null : id));
  };

  const closeMenu = () => setOpenMenuId(null);

  // fecha menu ao clicar fora (opcional: simples)
  useEffect(() => {
    const handleClick = () => closeMenu();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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
      </div>
    </div>
  );
}
