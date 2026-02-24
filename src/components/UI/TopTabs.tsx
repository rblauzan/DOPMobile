export default function TopTabs({ tabs, active, onChange }) {
  return (
    <div className="px-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-4 py-2 rounded-2xl border whitespace-nowrap ${
              active === t
                ? "bg-white/20 border-white/30"
                : "bg-white/10 border-white/15"
            }`}
          >
            <span className="text-sm">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}