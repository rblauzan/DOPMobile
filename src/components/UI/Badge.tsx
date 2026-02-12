export default function Badge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-gray-500/10">
      {icon}
      <div className="px-1"> {label}</div>
    </span>
  );
}
