export default function SecondaryButton({ icon, label, onClick } : {icon: React.ReactNode, label: string,onClick: () => void}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-2xl text-sm bg-[#ff6a00e6] shadow-lg flex items-center gap-2"
    >
      <div>{icon}</div>      
      <div className="">
      {label}
      </div>
    </button>
  );
}