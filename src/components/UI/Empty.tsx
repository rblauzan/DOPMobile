import { CalendarX } from "lucide-react";

export function EmptyWorkersState() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 opacity-90">
      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center mb-3">
        <CalendarX size={26} className="text-white/80" />
      </div>

      <div className="text-base font-medium text-white/90">
        No workers with jobs for this day
      </div>
    </div>
  );
}
