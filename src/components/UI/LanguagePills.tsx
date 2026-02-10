import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  className?: string;
};

export default function LanguagePillToggle({ className = "" }: Props) {
  const { i18n } = useTranslation();

  const current: "es" | "en" = i18n.language?.startsWith("es") ? "es" : "en";

  const setLang = async (lng: "es" | "en") => {
    if (lng === current) return;
    await i18n.changeLanguage(lng);
    localStorage.setItem("app_lang", lng);
  };

  const pillBase =
    "h-8 w-5 px-5 rounded-full font-semibold tracking-wide " +
    "flex items-center justify-center select-none transition-all duration-200";

  const activePill =
    "text-white " +
    "bg-gradient-to-b from-orange-400 to-orange-500 " +
    "shadow-[0_6px_16px_rgba(255,140,60,0.45)] " +
    "ring-1 ring-white/25";

  const inactivePill =
    "text-white/80 " +
    "bg-white/5 " +
    "border border-white/10 " +
    "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] " +
    "hover:bg-white/10 active:scale-[0.98]";

  return (
    <div className={`flex items-center gap-3 m-2 ${className}`}>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`${pillBase} ${current === "en" ? activePill : inactivePill}`}
        aria-pressed={current === "en"}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLang("es")}
        className={`${pillBase} ${current === "es" ? activePill : inactivePill}`}
        aria-pressed={current === "es"}
      >
        ES
      </button>
    </div>
  );
}
