import { X } from "lucide-react";

export default function SheetTitle({ title, subtitle, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
}