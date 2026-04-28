export default function Buttons({ text, icon, onClick, type = "button", disabled = false, className }) {
  return (
    <button
      onClick={onClick}
      className={`${className} bg-emerald-600 flex items-center justify-center gap-2 shadow-lg shadow-emerald-300 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors duration-300`} 
      type={type}
      disabled={disabled}
    >
      {icon}
      {text}
    </button>
  );
}
