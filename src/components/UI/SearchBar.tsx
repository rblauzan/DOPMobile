import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  value: string;
  onChange: (v: string) => void;
  entity?: string; // empleado / cliente
};

export default function SearchBar({ value, onChange, entity }: Props) {
  const { t } = useTranslation("");
  const placeholder = entity
    ? `${t("SearchBar.placeholder")} ${entity}`
    : t("SearchBar.placeholder");
  return (
    <div className="px-4">
      <div className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-3 flex items-center gap-2">
        <Search size={16} className="opacity-70" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-white/50"
        />
      </div>
    </div>
  );
}
