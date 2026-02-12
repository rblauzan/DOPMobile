import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import HeaderLayout from '../components/Layout/HeaderLayout';
import { UserMenu } from '../components/UI/user/UserMenu';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation("");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>         
            <HeaderLayout
          title={t("HeaderLayout.title2")}     
          rightSlot={
            <UserMenu user={Date} onLogout={() => alert("Logout")} />
          }          
        />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("Toolbar.title2")}  </IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
