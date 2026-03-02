
import { useTranslation } from "react-i18next";
interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleRole({ value, onChange }: Props) {
  const { t } = useTranslation("");
  return (
    <div className="flex items-center justify-center gap-3">
      {/* Label dinámico */}
      <span
        className={`text-sm font-semibold transition-colors duration-300 ${
          value ? "text-orange-400" : "text-gray-400"
        }`}
      >
        {value ? t("Login.Owner") : t("Login.toggle")}
      </span>

      {/* Toggle */}
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`
          relative w-14 h-7 rounded-full transition-all duration-300
          ${value ? "bg-orange-500" : "bg-gray-500"}
        `}
      >
        <div
          className={`
            absolute top-1 w-5 h-5 bg-white rounded-full shadow-md
            transition-transform duration-300
            ${value ? "translate-x-8" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
