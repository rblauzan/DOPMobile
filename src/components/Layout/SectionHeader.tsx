export default function SectionHeader({ title, subtitle, right } : {title : string , subtitle : string , right : React.ReactNode  }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}