import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendar, settings, people } from "ionicons/icons";
import CalendarTab from "./pages/Calendar";
import SettingsTab from "./pages/Settings";
import CustomersTab from "./pages/Customers";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/Guard/ProtectedRoute";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { useTranslation } from "react-i18next";
import { Toaster } from "sileo";

setupIonicReact();

const MainTabs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  return (
    // @ts-expect-error - Ionic React types incompatible with React 19, but works at runtime
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/Calendar">
          <ProtectedRoute>
            <CalendarTab />
          </ProtectedRoute>
        </Route>
        <Route exact path="/Customers">
          <ProtectedRoute>
            <CustomersTab />
          </ProtectedRoute>
        </Route>
        <Route path="/Settings">
          <ProtectedRoute>
            <SettingsTab />
          </ProtectedRoute>
        </Route>
        <Route path="/Login">
          <Login />
        </Route>
        <Route exact path="/">
          <Redirect to="/Login" />
        </Route>
      </IonRouterOutlet>

      {/* key fuerza re-render cuando cambia el idioma */}
      <IonTabBar
        slot="bottom"
        key={i18n.resolvedLanguage}
        style={{
          display: location.pathname.toLowerCase() === "/login" ? "none" : "flex",
        }}
      >
        {/* @ts-expect-error - Ionic React types incompatible with React 19, but works at runtime */}
        <IonTabButton tab="Calendar" href="/Calendar">
          <IonIcon aria-hidden="true" icon={calendar} />
          <IonLabel>{t("Toolbar.title1")}</IonLabel>
        </IonTabButton>

        {/* @ts-expect-error - Ionic React types incompatible with React 19, but works at runtime */}
        <IonTabButton tab="Customers" href="/Customers">
          <IonIcon aria-hidden="true" icon={people} />
          <IonLabel>{t("Toolbar.title3")}</IonLabel>
        </IonTabButton>

        {/* @ts-expect-error - Ionic React types incompatible with React 19, but works at runtime */}
        <IonTabButton tab="Settings" href="/Settings">
          <IonIcon aria-hidden="true" icon={settings} />
          <IonLabel>{t("Toolbar.title2")}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App: React.FC = () => {
  return (
    // @ts-expect-error - Ionic React types incompatible with React 19, but works at runtime
    <IonApp>
      <IonReactRouter>
        <Toaster position="top-center" offset={{ top: 40 }} />
        <MainTabs />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

