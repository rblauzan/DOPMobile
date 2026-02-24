export default function List({ children } : {children: React.ReactNode}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {children}
    </div>
  );
}