import { Search, CalendarDays, Filter } from "lucide-react";
import Pill from "./Pill";
import { useTranslation } from "react-i18next";

export function FilterRow({ search, setSearch, leftLabel, onOpenDate, onOpenStatus, statusLabel, rightAction }) {
  const { t } = useTranslation("");
  return (
    <div className="px-4">
      <div className="mt-2 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-3 flex items-center gap-2">
        <Search size={40} className="opacity-70" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t("SearchBar.placeholder")} ${leftLabel.toLowerCase()}...`}
          className="w-full bg-transparent outline-none placeholder:text-white/50"
        />

        {rightAction}

        <button
          onClick={onOpenDate}
          className="m-1 w-20 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
          title="Date range"
        >
          <CalendarDays size={16} />
        </button>

        <button
          onClick={onOpenStatus}
          className="m-1 w-24 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
          title={`Status: ${statusLabel}`}
        >
          <Filter size={16} />
        </button>
      </div>

      <div className="mt-2 flex gap-2 flex-wrap">
        <Pill icon={<Filter size={14} />} label={`Status: ${statusLabel}`} />
      </div>
    </div>
  );
}