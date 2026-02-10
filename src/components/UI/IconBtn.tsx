export default function IconBtn({ icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center"
      aria-label="Contact"
    >
      {icon}
    </button>
  );
}
