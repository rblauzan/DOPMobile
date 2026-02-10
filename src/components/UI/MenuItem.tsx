

export default function MenuItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3
                  w-full
                  px-3 py-2
                  rounded-xl
                  text-white
                  hover:bg-white/10
                  transition ${danger ? "text-red-400" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}
