export default function IconSquare({ icon, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
    >
      {icon}
    </button>
  );
}