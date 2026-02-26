import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonModal,
  IonButton,
} from "@ionic/react";
import { useState } from "react";
import "./Tab2.css";
import HeaderLayout from "../components/Layout/HeaderLayout";
import { UserMenu } from "../components/UI/user/UserMenu";
import { useTranslation } from "react-i18next";
import Screen from "../components/Layout/Screen";
import LanguagePicker from "../components/UI/LanguagePicker";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const current: "en" | "es" = i18n.language?.startsWith("en") ? "en" : "es";

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
      <IonContent fullscreen scrollEvents={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("Toolbar.title3")} </IonTitle>
          </IonToolbar>
        </IonHeader>
        <Screen>
          <div className="px-10 mt-6">
            <IonButton
              expand="block"
              fill="clear"
              className="
               py-2 rounded-2xl bg-white/10 text-balance shadow-2xl/20 inset-shadow-sm inset-shadow-current/20 backdrop-blur-sm bg-(--glass-bg) inset-shadow-sm text-white cursor-pointer [&:hover]:scale-95 transition duration-300 hover:bg-orange-600/80 disabled:opacity-50 disabled:cursor-not-allowed
              "
              onClick={() => setShowLanguagePicker(true)}
            >
              {current === "en" ? "🇺🇸" : "🇪🇸"} {t("Settings.language")}
            </IonButton>

            <IonModal
              id="modal"
              isOpen={showLanguagePicker}
              onDidDismiss={() => setShowLanguagePicker(false)}
              initialBreakpoint={0.5}
              breakpoints={[0, 0.5, 0.75]}
              
            >
              <IonHeader>
                <IonToolbar className="">
                  <IonTitle>{t("Settings.language")}</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <LanguagePicker
                  value={current}
                  onChange={() => setShowLanguagePicker(false)}
                />
              </IonContent>
            </IonModal>
          </div>
        </Screen>
      </IonContent>
    </IonPage>
  );
};

export default Settings;


{/* <IonList className="bg-transparent mt-6 px-4">
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
          </IonList> */}