import { IonContent, IonHeader, IonPage } from '@ionic/react';
import './Tab2.css';
// import { useTranslation } from 'react-i18next';
import LoginComponent from '../components/Auth/Login';

const Login: React.FC = () => {
  // const { t } = useTranslation("");
  return (
    <IonPage>
      <IonHeader>
       
      </IonHeader>
      <IonContent fullscreen>       
        <LoginComponent/>
      </IonContent>
    </IonPage>
  );
};

export default Login;
