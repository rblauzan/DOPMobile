import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";

const STORAGE_KEY = "app_lang";

const detectDeviceLanguage = (): "es" | "en" => {
  try {
    const nav = navigator as any;
    const lang: string | undefined =
      (nav?.languages && nav.languages[0]) || nav?.language || nav?.userLanguage;

    if (!lang) return "en";

    const lower = lang.toLowerCase();
    if (lower.startsWith("es")) return "es";
    if (lower.startsWith("en")) return "en";

    return "en";
  } catch {
    // En caso de que navigator no exista (ej. entorno no navegador)
    return "en";
  }
};

let initialLanguage: "es" | "en" = "en";

try {
  const saved = localStorage.getItem(STORAGE_KEY) as "es" | "en" | null;
  if (saved === "es" || saved === "en") {
    initialLanguage = saved;
  } else {
    initialLanguage = detectDeviceLanguage();
    // Guardamos el idioma detectado para siguientes aperturas
    localStorage.setItem(STORAGE_KEY, initialLanguage);
  }
} catch {
  // Si localStorage no está disponible, usamos solo la detección
  initialLanguage = detectDeviceLanguage();
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: ["es", "en"],
  interpolation: { escapeValue: false },
});

export const setAppLanguage = async (lng: "es" | "en") => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Ignorar errores de almacenamiento
  }
  await i18n.changeLanguage(lng);
};

export default i18n;
