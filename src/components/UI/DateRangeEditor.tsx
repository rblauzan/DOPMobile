import { useTranslation } from "react-i18next";
export default function DateRangeEditor({ value, onChange, onClear, onApply }) {
  const { t } = useTranslation("");
  return (
    <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs opacity-70">{t("Customers.start")}</label>
          <input
            type="date"
            value={value.start}
            onChange={(e) => onChange((p) => ({ ...p, start: e.target.value }))}
            className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
          />
        </div>
        <div>
          <label className="text-xs opacity-70">{t("Customers.end")}</label>
          <input
            type="date"
            value={value.end}
            onChange={(e) => onChange((p) => ({ ...p, end: e.target.value }))}
            className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="py-3 rounded-2xl bg-white/10 border border-white/20" onClick={onClear}>
          {t("Customers.Clear")}
        </button>
        <button className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold" onClick={onApply}>
          {t("Customers.Apply")}
        </button>
      </div>
    </div>
  );
}