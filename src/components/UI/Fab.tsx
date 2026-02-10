import { CalendarDays, ClipboardList } from "lucide-react";

export default function Fab({ open, onToggle, onToday, onSelectDate, onUnassigned }) {
  return (
    <div className="fixed bottom-6 right-6">
      {open && (
        <div className="mb-3 space-y-2">
          <button
            onClick={onToday}
            className="px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow text-sm"
          >
            Today
          </button>
          <button
            onClick={onSelectDate}
            className="px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow text-sm flex items-center gap-2"
          >
            <CalendarDays size={14} /> Select date
          </button>
          <button
            onClick={onUnassigned}
            className="px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow text-sm flex items-center gap-2"
          >
            <ClipboardList size={14} /> Unassigned jobs
          </button>
        </div>
      )}
      <button
        onClick={onToggle}
        className="w-14 h-14 rounded-full bg-[#ff6d00] shadow-2xl flex items-center justify-center"
        aria-label="Actions"
      >
        <CalendarDays size={20} />
      </button>
    </div>
  );
}