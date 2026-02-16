import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../../constants';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Estado para controlar la autorización
const Navigate = useHistory();
  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        setIsAuthorized(false); // No hay token, no autorizado
        return;
      }
      // Token válido
      setIsAuthorized(true);
    };
    auth(); // Ejecutar la validación de autenticación
  }, []);

  if (isAuthorized === null) {
    return <div>Cargando...</div>; // Mostrar un spinner o mensaje de carga mientras se verifica la autenticación
  }

  return isAuthorized ? children : Navigate.push("/login"); // Redirigir al login si no está autorizado
};
