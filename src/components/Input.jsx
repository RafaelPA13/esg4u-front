import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

import { useState } from "react";

export default function Input({
  label,
  icon,
  placeholder,
  tipo,
  required = false,
  value,
  onChange,
  externalShowPassword,
  onTogglePasswordVisibility,
  className,
  disabled = false,
}) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  const isControlled = externalShowPassword !== undefined;
  const showPassword = isControlled
    ? externalShowPassword
    : internalShowPassword;

  const inputType = tipo === "password" && showPassword ? "text" : tipo;

  const togglePasswordVisibility = () => {
    if (isControlled && onTogglePasswordVisibility) {
      onTogglePasswordVisibility();
    } else {
      setInternalShowPassword((prevShowPassword) => !prevShowPassword);
    }
  };

  return (
    <div className={`${className} flex flex-col gap-2`}>
      {label && (
        <label className="text-slate-400 text-sm font-semibold">{label}</label>
      )}
      <div className="bg-slate-100 p-3 flex items-center gap-2 rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/25 transition-all duration-200">
        {icon}
        <input
          className="w-full outline-0 bg-transparent"
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {tipo === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-slate-400 hover:text-emerald-600 focus:outline-none"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
