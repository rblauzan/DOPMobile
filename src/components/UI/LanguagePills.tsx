import React from "react";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../../i18n";

export default function LanguagePills() {
  const { i18n } = useTranslation();
  const current: "es" | "en" = i18n.language?.startsWith("es") ? "es" : "en";

  const pillBase =
    "h-10 min-w-[64px] px-5 rounded-full font-semibold tracking-wide " +
    "flex items-center justify-center select-none transition-all duration-200";

  const activePill =
    "text-white bg-gradient-to-b from-orange-400 to-orange-500 " +
    "shadow-[0_6px_16px_rgba(255,140,60,0.45)] ring-1 ring-white/25";

  const inactivePill =
    "text-white/80 bg-white/5 border border-white/10 " +
    "hover:bg-white/10 active:scale-[0.98]";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-pressed={current === "en"}
        onClick={() => setAppLanguage("en")}
        className={`${pillBase} ${current === "en" ? activePill : inactivePill}`}
      >
        EN
      </button>

      <button
        type="button"
        aria-pressed={current === "es"}
        onClick={() => setAppLanguage("es")}
        className={`${pillBase} ${current === "es" ? activePill : inactivePill}`}
      >
        ES
      </button>
    </div>
  );
}
