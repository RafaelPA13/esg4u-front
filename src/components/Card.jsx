export default function Card({ children, row = false }) {
  return <li className={`bg-slate-50 border border-slate-200 shadow p-6 rounded-xl flex gap-3 ${row ? "flex-row items-center" : "flex-col"}`}>{children}</li>;
}
