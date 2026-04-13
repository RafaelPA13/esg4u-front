export default function Buttons({ text, icon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-emerald-600 flex items-center justify-center gap-2 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors duration-300 lg:w-[45%] ${className}`}
    >
      {icon}
      {text}
    </button>
  );
}
