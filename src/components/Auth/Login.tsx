import { FormEvent, useState } from "react";
import { useHistory } from "react-router";

export default function LoginComponent() {
  // 🔐 Credenciales demo
  const ADMIN_USER = "admin123";
  

  // 🚀 Inputs precargados
  const [username, setUsername] = useState(ADMIN_USER);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useHistory();

  // Validar si el username es válido
  const isUsernameValid = username === ADMIN_USER;

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Limpiar error previo
    
    if (!isUsernameValid) {
      setError("Username incorrecto. Por favor, intenta nuevamente.");
      return;
    }

    if (!code.trim()) {
      setError("Por favor, introduce el código.");
      return;
    }
    // Aquí puedes agregar validación del código si es necesario
    setLoading(true);
    localStorage.setItem('user',username)
    navigate.push("/calendar");
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(""); // Limpiar error cuando el usuario empiece a escribir
    // Si el username cambia y ya no es válido, limpiar el código
    if (e.target.value !== ADMIN_USER) {
      setCode("");
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError(""); // Limpiar error cuando el usuario empiece a escribir el código
  };
  return (
  <>
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      
        <img src="./White-logo.png" className="w-40"></img>
        <h2 className="text-2xl font-semibold text-center">
        OPERATIONS PRO
        </h2>
        <span className="mb-2">Welcome! Sign in to continue.</span>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Usuario precargado */}
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border transition-colors ${
              error && !isUsernameValid
                ? "border-red-500"
                : isUsernameValid
                ? "border-green-500"
                : "border-white/15"
            }`}
            placeholder="Username"
          />
          
          {/* Input del código - solo se muestra si el username es válido */}
          {isUsernameValid && (
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border transition-colors ${
                error && !code.trim() ? "border-red-500" : "border-white/15"
              }`}
              placeholder="Código"
            />
          )}
          
          {/* Mensaje de error */}
          {error && (
            <p className="text-red-400 text-sm text-center mt-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-(--glass-border) px-6 py-3 font-semibold shadow-2xl/20 inset-shadow-sm inset-shadow-current/20 backdrop-blur-sm bg-(--glass-bg) inset-shadow-sm text-white w-fit cursor-pointer [&:hover]:scale-110 transition duration-300 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            // className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 hover:bg-orange-600"
          >
            {loading ? "Cargando..." : "Sign In"}
          </button>
        </form>

        {/* Mensaje claro de DEMO */}
        <p className="text-xs text-slate-400 text-center mt-6">
         © {new Date().getFullYear()} Diamond Operations Pro Inc. 
        </p>
        <span className="text-xs text-slate-400 text-center">- Owner App -</span>

      </div>
  </>
  );
}


// import { useHistory } from 'react-router-dom';
// // import { toast } from 'react-hot-toast';
// import { ACCESS_TOKEN } from '../../constants';
// import { useState } from 'react';
// import { LoadingIndicator } from '../UI/LoadingIndicator';


// export default function LoginComponent() {
//   const [loading, setLoading] = useState(false);
//   const navigate = useHistory();
 

//   const onSubmit = (async (data) => {
//     try {
//       setLoading(true);        
     
//     } catch (error) {
//     //   toast.error('Ocurrió un error durante la autenticación', {
//     //     position: 'top-right',
//     //   });
//     } finally {
//       setLoading(false);
//     }
//   });

//   return (
//     <div className="flex justify-center items-center p-8 h-screen w-screen bg-gray-900">
//       <form
//         onSubmit={onSubmit}
//         className="flex flex-col gap-4 bg-gray-800 p-8 rounded-lg shadow-lg w-96"
//       >
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src=""
//             alt="Logo"
//             className="w-16 h-16"
//           />
//         </div>

//         {/* Campo de usuario */}
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Usuario
//           </label>
//           <input
//             type="text"
//             placeholder="Usuario"
//             className="w-full rounded-md border border-gray-700 bg-gray-700 text-white py-2 px-3 focus:outline-none focus:border-blue-500"
//           />
//         </div>

//         {/* Campo de contraseña */}
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Contraseña
//           </label>
//           <input
//             type="password"
//             placeholder="Contraseña"
//             className="w-full rounded-md border border-gray-700 bg-gray-700 text-white py-2 px-3 focus:outline-none focus:border-blue-500"
//           />
          
//         </div>

//         {/* Botón de inicio de sesión */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={loading}
//         >
//           {loading ? <LoadingIndicator /> : 'Iniciar sesión'}
//         </button>
//       </form>
//     </div>
//   );
// };
