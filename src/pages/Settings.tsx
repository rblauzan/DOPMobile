import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import HeaderLayout from '../components/Layout/HeaderLayout';
import { UserMenu } from '../components/UI/user/UserMenu';

const Settings: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>         
            <HeaderLayout
          title="Settings"         
          rightSlot={
            <UserMenu user={Date} onLogout={() => alert("Logout")} />
          }          
        />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
