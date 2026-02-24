import { X } from "lucide-react";


export default function Header({ title, subtitle, onBack , right }: { title: string , subtitle: string ,right : React.ReactNode, onBack: () => void }) {
  return (
    <div className="px-4 pt-6 pb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
      </div>
      {right}
      {onBack && (
        <button
          onClick={onBack}
          className="w-12 h-10 m-2 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
          aria-label="Back"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
