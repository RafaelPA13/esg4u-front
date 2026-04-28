import { MdKeyboardArrowDown } from "react-icons/md";

import { useEffect, useRef, useState } from "react";

export default function Select({ label, placeholder, options = [], value, onChange, required = false, className }) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) return opt;
    return { label: String(opt ?? ""), value: opt };
  });

  const safeInput = String(inputValue ?? "").toLowerCase();
  const filtered = normalizedOptions.filter((opt) =>
    String(opt.label ?? "").toLowerCase().includes(safeInput)
  );

  const handleSelect = (opt) => {
    setInputValue(opt.label);
    onChange?.(opt.value);
    setIsOpen(false);
  };

  return (
    <div className={`${className} flex flex-col gap-2`} ref={containerRef}>
      {label && (
        <label className="text-slate-400 text-sm font-semibold">{label}</label>
      )}

      <div className="relative">
        <div className="bg-slate-100 p-3 flex items-center gap-2 rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/25 transition-all duration-200">
          <input
            className="w-full outline-0 bg-transparent"
            type="text"
            placeholder={placeholder}
            required={required}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange?.(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <button
            type="button"
            className="text-slate-400 hover:text-emerald-600 focus:outline-none"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <MdKeyboardArrowDown size={20} />
          </button>
        </div>
        {isOpen && filtered.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow border border-slate-200 max-h-60 overflow-auto z-20">
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
