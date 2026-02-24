
export default function StatusPill({ status, accent = false }: { status: string, accent: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${
        accent
          ? "bg-orange-500/20 border-orange-400/30"
          : "bg-white/10 border-white/20"
      }`}
    >
      {status}
    </span>
  );
}
