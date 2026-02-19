export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[radial-gradient(800px_500px_at_80%_20%,rgba(56,189,248,.35),transparent_70%),linear-gradient(135deg,#020617,#062874)">
      {children}
    </div>
  );
}

