import React from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../../i18n"; // ajusta path

type Language = "en" | "es";

type Props = {
  value: Language;
  onChange?: (lng: Language) => void; // opcional, por si quieres reaccionar en Settings
  className?: string;
};

const LANGS: Array<{ value: Language; labelKey: string; flag: string }> = [
  { value: "en", labelKey: "Settings.english", flag: "🇺🇸" },
  { value: "es", labelKey: "Settings.spanish", flag: "🇪🇸" },
];

export default function LanguagePicker({ value, onChange, className = "" }: Props) {
  const { t } = useTranslation();

  const handleChange = async (lng: Language) => {
    await setAppLanguage(lng);
    onChange?.(lng);
  };

  return (
    <IonRadioGroup
      value={value}
      onIonChange={(e) => handleChange(e.detail.value)}
      className={className}
    >
      <IonList className="bg-transparent px-4 mt-6 space-y-3">
        {LANGS.map((lang) => (
          <IonItem
            key={lang.value}
            lines="none"
            className="
              rounded-2xl
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              overflow-hidden
              min-h-[60px]
            "
            style={
              {
                "--background": "transparent",
                "--inner-padding-end": "14px",
                "--inner-padding-start": "14px",
                "--padding-start": "14px",
              } as React.CSSProperties
            }
          >
            <IonLabel className="m-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className="text-white/90 font-medium">
                  {t(lang.labelKey)}
                </span>
              </div>
            </IonLabel>

            {/* Radio a la derecha */}
            <IonRadio
              slot="end"
              value={lang.value}
              className="lang-radio"
            />
          </IonItem>
        ))}
      </IonList>
    </IonRadioGroup>
  );
}