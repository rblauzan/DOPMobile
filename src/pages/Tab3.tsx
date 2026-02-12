import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import HeaderLayout from '../components/Layout/HeaderLayout';
import { UserMenu } from '../components/UI/user/UserMenu';

const Tab3: React.FC = () => {
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
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
