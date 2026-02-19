import { Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { USER_STORAGE_KEY } from '../../constants';
import { Loader } from 'lucide-react';



export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Estado para controlar la autorización

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem(USER_STORAGE_KEY);

      if (!user) {
        setIsAuthorized(false); // No hay usuario, no autorizado
        return;
      }
      // Usuario existe en localStorage, sesión válida
      setIsAuthorized(true);
    };
    checkAuth(); // Ejecutar la validación de autenticación
  }, []);

  if (isAuthorized === null) {
    return(     
      <><Loader/></> 
    )
    ; // Mostrar un spinner o mensaje de carga mientras se verifica la autenticación
  }

  if (!isAuthorized) {
    return <Redirect to="/Login" />; // Redirigir al login si no está autorizado
  }

  return <>{children}</>; // Renderizar el contenido protegido si está autorizado
};
