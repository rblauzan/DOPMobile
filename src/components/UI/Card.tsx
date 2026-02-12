export default function Card({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="rounded-3xl p-4 bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl"
    >
      {children}
    </div>
  );
}
