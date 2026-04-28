export default function Loading({ size = 32, borderWidth = 3 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth,
      }}
      className="rounded-full border-slate-200 border-t-emerald-600 animate-spin"
    />
  );
}