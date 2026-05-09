import { MdCalendarToday } from "react-icons/md";
import { MdClose } from "react-icons/md";

import { useState, useRef, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import DatePicker from "react-datepicker";

export default function CustomDatePicker({
  label,
  placeholder,
  value, // Espera uma string ISO (YYYY-MM-DD) ou objeto Date
  onChange, // Retorna uma string ISO (YYYY-MM-DD) ou null
  required = false,
  className,
  disabled = false,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const parsedDate = typeof value === "string" ? parseISO(value) : value;
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      } else {
        setSelectedDate(null);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date ? format(date, "yyyy-MM-dd") : null);
    }
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={`${className} flex flex-col gap-2`}>
      {label && (
        <label className="text-slate-400 text-sm font-semibold">{label}</label>
      )}
      <div
        className={`
          bg-slate-100 p-3 flex items-center gap-2 rounded-xl border transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isFocused ? "border-emerald-500 ring-3 ring-emerald-500/25" : "border-slate-200"}
        `}
      >
        <MdCalendarToday className="text-slate-400" size={20} />
        <DatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          locale={ptBR}
          placeholderText={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full outline-0 bg-transparent cursor-pointer"
          popperPlacement="bottom-start"
          showPopperArrow={false}
          customInput={
            <input
              type="text"
              className="w-full outline-0 bg-transparent cursor-pointer"
              readOnly // Para evitar digitação direta
            />
          }
        />
        {selectedDate && !disabled && (
          <button
            type="button"
            onClick={handleClearDate}
            className="text-slate-400 hover:text-red-600 focus:outline-none"
            aria-label="Limpar data"
          >
            <MdClose size={20} />
          </button>
        )}
      </div>
    </div>
  );
}