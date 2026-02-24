export default function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl p-4 bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs opacity-70">{label}</p>
          <h3 className="text-xl font-semibold mt-1 truncate">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#148dcd]/25 border border-white/15 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}