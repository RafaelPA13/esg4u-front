export default function Titulo ({ titulo, subtitulo, children }) {
    return (
        <span className="flex flex-wrap items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-black text-slate-800">{titulo}</h1>
                <p className="text-lg text-slate-500">{subtitulo}</p>
            </div>
            {children}
        </span>
    );
}