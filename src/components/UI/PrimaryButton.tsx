export default function PrimaryButton({ icon, label, onClick } : {icon: React.ReactNode, label: string,onClick: () => void}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-2xl bg-[#e76509] shadow-lg flex items-center gap-2"
    >
      <div>{icon}</div>      
      <div className="">
      {label}
      </div>
    </button>
  );
}