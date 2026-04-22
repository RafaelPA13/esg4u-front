import Titulo from "../../components/Titulo";
import Card from "../../components/Card";

export default function Convites() {
  const cards = [
    { label: "TOTAL ENVIADOS", value: 0 },
    { label: "CONVERTIDOS", value: 0 },
    { label: "PENDENTES", value: 0 },
  ];

  return (
    <>
      <Titulo
        titulo="Gestão de Convites"
        subtitulo="Acompanhe e gerencie as solicitações de validação enviadas."
      >
        <ul className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {cards.map((card, index) => (
            <Card key={index}>
              <p className="text-[10px] text-slate-400 font-bold">
                {card.label}
              </p>
              <h3 className="text-3xl font-black -mt-2">{card.value}</h3>
            </Card>
          ))}
        </ul>
      </Titulo>
    </>
  );
}
