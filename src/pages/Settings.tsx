import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import "./Tab2.css";
import HeaderLayout from "../components/Layout/HeaderLayout";
import { UserMenu } from "../components/UI/user/UserMenu";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../i18n"; // ajusta path si cambia
import Screen from "../components/Layout/Screen";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();

  const current: "en" | "es" = i18n.language?.startsWith("es") ? "es" : "en";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <HeaderLayout
            rightSlot={
              <UserMenu user={Date} onLogout={() => alert("Logout")} />
            }
          />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("Toolbar.title3")} </IonTitle>
          </IonToolbar>
        </IonHeader>

        <Screen>
          <IonList className="bg-transparent mt-6 px-4">
            <IonItem
              lines="none"
              className="
              rounded-2xl
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              px-3
              min-h-[56px]
            "
            >
              <IonLabel className="text-white/90 font-medium">
                {t("Settings.language")}
              </IonLabel>

              <IonSelect
                value={current}
                interface="popover"
                interfaceOptions={{
                  cssClass: "select-popover-glass",
                }}
                onIonChange={(e) => setAppLanguage(e.detail.value)}
                className="text-white/90"
              >
                <IonSelectOption
                  value="en"
                  className="
              rounded-2xl
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              px-3
              min-h-[56px]
            "
                >
                  🇺🇸 {t("Settings.english")}
                </IonSelectOption>

                <IonSelectOption
                  value="es"
                  className="
              rounded-2xl
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              px-3
              min-h-[56px]
            "
                >
                  🇪🇸 {t("Settings.spanish")}
                </IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
        </Screen>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
