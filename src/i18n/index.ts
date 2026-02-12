import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";

const STORAGE_KEY = "app_lang";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: localStorage.getItem(STORAGE_KEY) || "en",
  fallbackLng: "en",
  supportedLngs: ["es", "en"],
  interpolation: { escapeValue: false },
});

export const setAppLanguage = async (lng: "es" | "en") => {
  localStorage.setItem(STORAGE_KEY, lng);
  await i18n.changeLanguage(lng);
};

export default i18n;
