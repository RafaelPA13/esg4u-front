import { LuUpload } from "react-icons/lu";
import { useRef, useState } from "react";

export default function FileDrop({ title, file, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) onChange(dropped);
  };

  return (
    <div className="col-span-2 flex flex-col gap-2">
      <span className="text-xs font-semibold text-slate-500 uppercase">
        {title}
      </span>
      <div
        className={`relative w-full rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
          dragging
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-200 bg-slate-50 hover:border-emerald-400"
        }`}
        style={{ minHeight: "160px" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-72 object-contain rounded-2xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
            <LuUpload size={28} />
            <span className="text-sm font-semibold">
              Arraste uma imagem ou clique para selecionar
            </span>
            <span className="text-xs">PNG, JPG, WEBP até 10MB</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files[0] || null)}
        />
      </div>
      {file && (
        <span className="text-xs text-slate-400">{file.name}</span>
      )}
    </div>
  );
}