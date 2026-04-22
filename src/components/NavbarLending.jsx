import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

export function NavbarLanding() {
  const landingPageLinks = [
    { text: "Como Funciona", path: "como-funciona" },
    { text: "Benefícios", path: "beneficios" },
    { text: "Reputação", path: "reputacao" },
  ];

  return (
    <header className="bg-white/50 backdrop-blur-sm z-50 fixed top-0 left-0 w-full flex items-center justify-between p-4 md:px-20">
      <span className="flex items-center gap-1">
        <h1 className="bg-emerald-600 p-2 text-2xl text-white font-bold rounded-lg">
          4U
        </h1>
        <h1 className="text-xl text-slate-800 font-bold">ESG4U</h1>
      </span>
      <nav className="hidden lg:flex gap-6 text-slate-500 font-medium">
        {landingPageLinks.map((link, index) => (
          <ScrollLink
            key={index}
            to={link.path}
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="transition-colors duration-300 hover:text-emerald-600 cursor-pointer"
          >
            {link.text}
          </ScrollLink>
        ))}
      </nav>
      <ul className="flex items-center gap-6">
        <li className="px-4 py-2 rounded-full transition-all duration-300 text-slate-800 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-300">
          <Link to="/autenticacao/login">Entrar</Link>
        </li>
        <li className="bg-emerald-600 px-4 py-2 rounded-full text-white shadow-lg shadow-emerald-300 transition-colors duration-300 hover:bg-emerald-700">
          <Link to="/autenticacao/cadastro">Criar Conta</Link>
        </li>
      </ul>
    </header>
  );
}
