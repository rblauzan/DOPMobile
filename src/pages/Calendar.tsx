import {
  IonContent,
  IonHeader,
  IonPage, 
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ContainerCalendar";
import "./Tab1.css";
import { UserMenu } from "../components/UI/user/UserMenu";
import HeaderLayout from "../components/Layout/HeaderLayout";
import { useTranslation } from "react-i18next";

const Calendar: React.FC = () => {
  const { t } = useTranslation("");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="!overflow-visible relative z-40">         
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
            <IonTitle size="large">{t("Toolbar.title1")}  </IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Calendar page" />
      </IonContent>
    </IonPage>
  );
};

export default Calendar;
