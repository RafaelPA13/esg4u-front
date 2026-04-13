import { Link } from "react-router-dom";

export function Navbar() {
  const landingPageLinks = [
    { text: "Como Funciona", path: "#como-funciona" },
    { text: "Benefícios", path: "#beneficios" },
    { text: "Reputação", path: "#reputacao" },
];

  return (
    <header className="bg-white/50 z-50 fixed top-0 left-0 w-full flex items-center justify-between p-4 px-20">
        <span className="flex items-center gap-1">
            <h1 className="bg-emerald-600 p-2 text-2xl text-white font-bold rounded-lg">4U</h1>
            <h1 className="text-xl font-bold">ESG4U</h1>
        </span>
      <nav className="flex gap-6 text-slate-500 font-medium">
        {landingPageLinks.map((link, index) => (
          <Link key={index} to={link.path} className="transition-colors duration-300 hover:text-emerald-600">
            {link.text}
          </Link>
        ))}
      </nav>
      <ul className="flex items-center gap-6">
        <li className="px-4 py-2 rounded-full transition-all duration-300 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-300">
          <Link to="/autenticacao/login">Entrar</Link>
        </li>
        <li className="bg-emerald-600 px-4 py-2 rounded-full text-white shadow-lg shadow-emerald-300 transition-colors duration-300 hover:bg-emerald-700">
          <Link to="/autenticacao/cadastro">Criar Conta</Link>
        </li>
      </ul>
    </header>
  );
}
