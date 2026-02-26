import { IonContent, IonPage } from '@ionic/react';
import './Tab2.css';
import LoginComponent from '../components/Auth/Login';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>       
        <LoginComponent/>
      </IonContent>
    </IonPage>
  );
};

export default Login;
