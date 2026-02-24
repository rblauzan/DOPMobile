// Colors Tones 

export function statusTone(status: string) {
  const s = String(status || "").toLowerCase();
  if (s.includes("completed")) return "bg-emerald-400/20 border-emerald-400/30 text-emerald-100";
  if (s.includes("progress")) return "bg-amber-400/20 border-amber-400/30 text-amber-100";
  if (s.includes("scheduled")) return "bg-sky-400/20 border-sky-400/30 text-sky-100";
  if (s.includes("cancel")) return "bg-rose-400/20 border-rose-400/30 text-rose-100";
  return "bg-white/10 border-white/15 text-white";
}

 export function invoiceTone(status: string) {
  const s = String(status || "").toLowerCase();
  if (s.includes("paid")) return "bg-emerald-400/20 border-emerald-400/30 text-emerald-100";
  if (s.includes("unpaid")) return "bg-rose-400/20 border-rose-400/30 text-rose-100";
  if (s.includes("sent")) return "bg-sky-400/20 border-sky-400/30 text-sky-100";
  if (s.includes("approval")) return "bg-amber-400/20 border-amber-400/30 text-amber-100";
  return "bg-white/10 border-white/15 text-white";
}