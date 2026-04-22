import { FaBoltLightning } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { PiPlant } from "react-icons/pi";
import { GrFavorite } from "react-icons/gr";
import { GoLaw } from "react-icons/go";
import { FaCircleCheck } from "react-icons/fa6";
import { PiMedal } from "react-icons/pi";
import { LuShieldCheck } from "react-icons/lu";
import { IoMdPeople } from "react-icons/io";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { BsGlobe2 } from "react-icons/bs";

import { NavbarLanding } from "../components/NavbarLending";
import { Link } from "react-router-dom";
import DataCards from "../components/dataCards";
import Card from "../components/Card";
import Buttons from "../components/Button";
import { Link as ScrollLink } from "react-scroll";

export default function LandingPage() {
  const dataCardsInfo = [
    { info: "USUÁRIOS ATIVOS", data: "1.2k+" },
    { info: "EVIDÊNCIAS ENVIADAS", data: "5.8k+" },
    { info: "VALIDAÇÕES REALIZADAS", data: "12k+" },
    { info: "CO2 COMPENSADO", data: "450t" },
  ];

  const beneficios = [
    {
      icon: (
        <PiPlant
          size={45}
          className="bg-emerald-100 p-2 rounded-md text-emerald-600"
        />
      ),
      title: "Consciência Ambiental",
      description:
        "Meça seu impacto no planeta, desde o consumo de energia até a gestão de resíduos.",
    },
    {
      icon: (
        <GrFavorite
          size={45}
          className="bg-emerald-100 p-2 rounded-md text-emerald-600"
        />
      ),
      title: "Impacto Social",
      description:
        "Registre suas ações de voluntariado, doações e apoio à comunidade local.",
    },
    {
      icon: (
        <GoLaw
          size={45}
          className="bg-emerald-100 p-2 rounded-md text-emerald-600"
        />
      ),
      title: "Ética e Governança",
      description:
        "Acompanhe sua integridade em decisões diárias e participação em processos democráticos.",
    },
  ];

  const comoFuncionaSteps = [
    {
      icon: 1,
      title: "Responda o Questionário",
      description:
        "Uma série de perguntas baseadas em padrões ESG adaptadas para o seu dia a dia.",
    },
    {
      icon: 2,
      title: "Descubra seu Score",
      description:
        "Receba uma pontuação demandada por eixo [Ambiental, Social e Governança] e seu nível de maturidade ESG.",
    },
    {
      icon: 3,
      title: "Receba Recomendações",
      description:
        "O app sugere ações práticas para você evoluir seu comportamento e aumentar seu impacto positivo.",
    },
  ];

  const pqValidar = [
    "Gera confiança na sua rede",
    "Aumenta seu Trust Score",
    "Torna a sua jornada ESG auditável",
    "Inspira outros através do exemplo real",
  ];

  const reputacao = [
    {
      icon: <PiMedal size={45} className="text-amber-600" />,
      title: "Pontos de Ação",
      description:
        "Ganhe pontos ao completar desafios e registrar novas evidências de impacto.",
    },
    {
      icon: <LuShieldCheck size={45} className="text-emerald-600" />,
      title: "Trust Score",
      description:
        "Sua confiabilidade aumenta conforme suas evidências são validadas por outros usuários.",
    },
    {
      icon: <IoMdPeople size={45} className="text-blue-600" />,
      title: "Nível de Engajamento",
      description:
        "Suba de nível e torne-se um embaixador da sustentabilidade na sua região.",
    },
  ];

  return (
    <div className="pt-20">
      <NavbarLanding />
      <section className="bg-slate-50 min-h-[calc(100vh-80px)] flex items-center justify-center flex-wrap gap-6 pb-10 md:px-20">
        <div className="w-[75%] flex flex-col gap-6 md:w-[40%] animate-fade-in-left">
          <h5 className="bg-emerald-100 py-1 px-2 flex items-center gap-2 text-xs text-emerald-600 font-semibold rounded-full w-max">
            <FaBoltLightning />
            TRANSFORME SEU DIA A DIA
          </h5>
          <h1 className="text-5xl text-slate-800 font-bold lg:text-6xl">
            Sua jornada <span className="text-emerald-600">ESG</span> começa
            aqui.
          </h1>
          <p className="text-slate-500">
            O ESG4U ajuda você a medir, comprovar e evoluir seu comportamento
            sustentável, social e ético no cotidiano.
          </p>
          <span className="flex items-center gap-6">
            <Link
              to="/autenticacao/cadastro"
              className="bg-emerald-600 px-4 py-2 rounded-xl text-white shadow-lg shadow-emerald-300 transition-colors duration-300 flex items-center gap-3 hover:bg-emerald-700"
            >
              Comece Agora
              <FaArrowRight />
            </Link>
            <Link className="border border-slate-300 px-4 py-2 rounded-xl text-slate-800 transition-colors duration-300 hover:bg-slate-300 hover:text-white">
              Saiba Mais
            </Link>
          </span>
        </div>
        <div className="w-[90%] bg-white border border-slate-200 p-4 shadow-xl rounded-2xl md:w-[40%] animate-zoom-in">
          <img
            className="w-full h-full object-cover rounded-2xl"
            src="/cadeia_de_montanhas.jpg"
            alt="Paisagem com montanhas"
          />
        </div>
      </section>
      <section className="bg-slate-100 min-h-[25vh] flex items-center justify-center py-10 px-20">
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {dataCardsInfo.map((card, index) => (
            <DataCards key={index} info={card.info} data={card.data} />
          ))}
        </ul>
      </section>
      <section className="bg-slate-50 p-10 md:py-10 md:px-20" id="como-funciona">
        <div className="bg-emerald-900 p-10 flex flex-col-reverse items-center justify-between rounded-2xl gap-6 lg:flex-row">
          <div className="w-full flex flex-col gap-4 lg:w-[50%]">
            <h1 className="text-3xl font-bold text-white">
              Como funciona o diagnóstico ESG?
            </h1>
            <ul className="flex flex-col gap-4">
              {comoFuncionaSteps.map((step, index) => (
                <Card key={index} row>
                  <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </span>
                  <div>
                    <h3 className="text-xl text-slate-800 font-semibold">{step.title}</h3>
                    <p className="text-slate-500">{step.description}</p>
                  </div>
                </Card>
              ))}
            </ul>
          </div>
          <div className="w-full shadow-xl rounded-2xl lg:w-[45%]">
            <img
              className="w-full h-full object-cover rounded-2xl"
              src="/mexendo_no_celular.png"
              alt="Mulher mexendo no celular"
            />
          </div>
        </div>
      </section>
      <section
        className="bg-slate-50 flex flex-col items-center gap-6 py-10 px-10 md:px-20"
        id="beneficios"
      >
        <div className="text-center">
          <h1 className="text-4xl text-slate-808 font-bold">Por que usar o ESG4U?</h1>
          <p className="mt-4 text-slate-500">
            Mais do que um app, uma ferramenta para transformar intenção em ação
            concreta e reconhecida.
          </p>
        </div>
        <ul className="w-full grid grid-cols-1 gap-6 md:w-[75%] md:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((beneficio, index) => (
            <Card key={index}>
              {beneficio.icon}
              <h3 className="text-xl text-slate-800 font-semibold">{beneficio.title}</h3>
              <p className="text-slate-500">{beneficio.description}</p>
            </Card>
          ))}
        </ul>
      </section>
      <section className="bg-slate-50 flex flex-wrap items-center justify-center gap-6 py-10 px-10 md:px-20">
        <div className="w-full shadow-xl rounded-2xl lg:size-96">
          <img
            className="w-full h-full object-cover rounded-2xl"
            src="/floresta.jpg"
            alt="Paisagem de floresta"
          />
        </div>
        <div className="w-full flex flex-col gap-4 lg:w-[40%]">
          <h2 className="text-2xl text-slate-800 font-bold">
            Por que validar com envidências?
          </h2>
          <p className="text-slate-500">
            No ESG4U, não basta dizer que você faz. Para garantir a integridade
            do ecossistema, incentivamos o envio de fotos, documentos ou links
            que comprovem suas ações.
          </p>
          <ul className="flex flex-col gap-4">
            {pqValidar.map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <FaCircleCheck />
                </span>
                <p className="text-slate-500">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="bg-slate-100 flex flex-col items-center gap-6 py-10 px-10 md:px-20"
        id="reputacao"
      >
        <div className="text-center">
          <h1 className="text-4xl text-slate-800 font-bold">Como a reputação funciona</h1>
          <p className="mt-4 text-slate-500">
            Sua reputação é construída através da consistência. Quanto mais você
            age, comprova e ajuda a validar a rede, maior seu prestígio.
          </p>
        </div>
        <ul className="w-full grid grid-cols-1 gap-6 md:w-[75%] lg:grid-cols-3">
          {reputacao.map((repo, index) => (
            <Card key={index}>
              {repo.icon}
              <h3 className="text-xl font-semibold">{repo.title}</h3>
              <p className="text-slate-500">{repo.description}</p>
            </Card>
          ))}
        </ul>
      </section>
      <section className="bg-emerald-50 flex items-center justify-center py-10 px-10 md:px-20">
        <div className="w-full bg-slate-50 flex flex-col items-center justify-center gap-6 rounded-2xl p-10 shadow-xl lg:w-[60%]">
          <h1 className="text-4xl text-slate-800 font-bold text-center">
            Convide outras pessoas para validar
          </h1>
          <p className="text-center text-slate-500">
            A força do ESG4U está na comunidade. Convide amigos, colegas e
            familiares para validar suas ações e ajude-os a medir o impacto
            deles também.
          </p>
          <span className="w-full flex flex-wrap items-center justify-center gap-6">
            <Buttons icon={<FiShare2 />} text="Compartilhar convite" />
            <Link
              to={""}
              className="bg-slate-100 flex items-center justify-center gap-2 px-6 py-3 rounded-md text-slate-800 hover:bg-slate-200 transition-colors duration-300"
            >
              <IoMdPeople />
              Ver minha rede
            </Link>
          </span>
        </div>
      </section>
      <footer className="bg-slate-900 flex flex-col items-center justify-center gap-4 py-6 px-20">
        <div className="w-full flex flex-col item-center justify-between gap-6 pb-6 border-b border-white/50 md:flex-row">
          <div className="w-full flex flex-col gap-3 md:w-[50%]">
            <span className="flex items-center gap-1">
              <h1 className="bg-emerald-600 p-2 text-xl text-white font-bold rounded-lg">
                4U
              </h1>
              <h1 className="text-lg font-bold text-white">ESG4U</h1>
            </span>
            <p className="text-white/50">
              Medindo e comprovando o impacto positivo das pessoas fisicas no
              mundo.
            </p>
            <span className="flex gap-3 text-white/50">
              <button>
                <BsGlobe2 size={18} />
              </button>
              <button>
                <FiShare2 size={18} />
              </button>
            </span>
          </div>
          <div className="w-full flex flex-col gap-3 md:w-[25%]">
            <h1 className="text-white">Plataforma</h1>
            <ul className="flex flex-col gap-2">
              <ScrollLink
                to="como-funciona"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-white/50 cursor-pointer"
              >
                Como funciona
              </ScrollLink>
              <ScrollLink
                to="beneficios"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-white/50 cursor-pointer"
              >
                Benefifícios
              </ScrollLink>
              <ScrollLink
                to="reputacao"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-white/50 cursor-pointer"
              >
                Reputação
              </ScrollLink>
            </ul>
          </div>
          <div className="w-full flex flex-col gap-3 w-[25%]">
            <h1 className="text-white">Legal</h1>
            <ul className="flex flex-col gap-2">
              <p className="text-white/50">Privacidades</p>
              <p className="text-white/50">Termos de uso</p>
              <p className="text-white/50">Cookies</p>
            </ul>
          </div>
        </div>
        <p className="w-full text-white/50">
          2026 ESG4U Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
