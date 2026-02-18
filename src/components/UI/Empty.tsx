import { CalendarX, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EmptyWorkersState() {
  const { t } = useTranslation("");
  return (
    <div className="flex flex-col items-center justify-center mt-12 opacity-90">
      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center mb-3">
        <CalendarX size={26} className="text-white/80" />
      </div>

      <div className="text-base font-medium text-white/90">
        {t("Empty.title1")}
      </div>
    </div>
  );
}

export function EmptySearchResults() {
  const { t } = useTranslation("");
  return (
    <div className="flex flex-col items-center justify-center mt-12 opacity-90">
      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center mb-3">
        <SearchX size={26} className="text-white/80" />
      </div>

      <div className="text-base font-medium text-white/90">
        {t("Empty.searchNoResults")}
      </div>
    </div>
  );
}
