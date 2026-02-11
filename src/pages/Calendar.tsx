import {
  IonContent,
  IonHeader,
  IonPage, 
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { UserMenu } from "../components/UI/user/UserMenu";
import HeaderLayout from "../components/Layout/HeaderLayout";

const Calendar: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="!overflow-visible relative z-40">         
          <HeaderLayout
          title="Calendar"         
          rightSlot={
            <UserMenu user={Date} onLogout={() => alert("Logout")} />
          }          
        />
        
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Calendar</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Calendar page" />
      </IonContent>
    </IonPage>
  );
};

export default Calendar;
