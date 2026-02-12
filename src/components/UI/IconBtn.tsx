export default function IconBtn({ icon, id, onClick }: { icon: React.ReactNode, id: string, onClick: () => void }) {
  return (
    <button
      id={id}
      onClick={onClick}
      type="button"
      className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center"
      aria-label="User menu"
    >
      {icon}
    </button>
  );
}