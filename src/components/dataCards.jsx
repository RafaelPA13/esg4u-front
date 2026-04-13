export default function DataCards({ info, data }) {
    return (
        <li className="text-center">
            <h3 className="text-emerald-600 text-2xl font-bold">{data}</h3>
            <p className="text-slate-500">{info}</p>
        </li>
    );
}