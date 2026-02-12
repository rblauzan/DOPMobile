export default function BottomSheet({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-3xl bg-[#062874]/95 border-t border-white/20 backdrop-blur-2xl p-6"
      >
        {children}
      </div>
    </div>
  );
}
