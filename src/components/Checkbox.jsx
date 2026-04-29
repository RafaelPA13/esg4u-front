export default function Checkbox({ label, checked, onChange, className = "" }) {
  return (
    <div className={`${className} flex flex-col gap-2`}>
      {label && (
        <label className="text-slate-400 text-sm font-semibold">{label}</label>
      )}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "w-fit flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer select-none",
          checked
            ? "bg-emerald-50 border-emerald-500 ring-3 ring-emerald-500/25 text-emerald-700"
            : "bg-slate-100 border-slate-200 text-slate-400 hover:border-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0",
            checked
              ? "bg-emerald-500 border-emerald-500"
              : "bg-white border-slate-300",
          ].join(" ")}
        >
          {checked && (
            <svg
              viewBox="0 0 12 10"
              fill="none"
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5L4.5 8.5L11 1.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="text-sm font-semibold">{checked ? "Sim" : "Não"}</span>
      </button>
    </div>
  );
}
