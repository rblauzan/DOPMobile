import { FormEvent, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { sileo } from "sileo";

export default function LoginComponent() {
  // 🔐 Credenciales demo
  const ADMIN_USER = "admin123";
  const VALID_CODE = "1234";

  // 🚀 Inputs precargados
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  // Solo mostrar código después de que el usuario hizo click en Sign In y el username es correcto
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useHistory();
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);

  // Limpiar formulario al llegar a Login (p. ej. después de logout)
  useEffect(() => {
    const current = location.pathname;
    const prev = prevPathRef.current;
    prevPathRef.current = current;
    if (current === "/Login" && prev !== "/Login") {
      setUsername("");
      setCode("");
      setShowCodeInput(false);
      setError("");
    }
  }, [location.pathname]);

  // Verificar si el usuario ya tiene sesión activa al cargar el componente
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      // Si ya hay un usuario en localStorage, redirigir a Calendar
      navigate.replace("/Calendar");
    }
  }, [navigate]);

  // Detectar cuando el teclado se muestra/oculta
  useEffect(() => {
    let listeners: Awaited<ReturnType<typeof Keyboard.addListener>>[] = [];

    const setupListeners = async () => {
      const keyboardWillShowListener = await Keyboard.addListener("keyboardWillShow", () => {
        setIsKeyboardVisible(true);
      });

      const keyboardWillHideListener = await Keyboard.addListener("keyboardWillHide", () => {
        setIsKeyboardVisible(false);
      });

      const keyboardDidShowListener = await Keyboard.addListener("keyboardDidShow", () => {
        setIsKeyboardVisible(true);
      });

      const keyboardDidHideListener = await Keyboard.addListener("keyboardDidHide", () => {
        setIsKeyboardVisible(false);
      });

      listeners = [
        keyboardWillShowListener,
        keyboardWillHideListener,
        keyboardDidShowListener,
        keyboardDidHideListener,
      ];
    };

    setupListeners();

    // Cleanup listeners al desmontar el componente
    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, []);

  // Validar si el username es válido (para borde verde)
  const isUsernameValid = username === ADMIN_USER;

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Primera etapa: validar username al hacer click en Sign In
    if (!showCodeInput) {
      if (username !== ADMIN_USER) {
        sileo.error({
          fill: "white",
          title: "Username incorrecto.",   
        });
         setError("");
        return;
      }
      // Usuario correcto → mostrar input del código
      setShowCodeInput(true);
      return;
    }

    // Segunda etapa: validar código
    // if (!code.trim()) {
    //    sileo.error({
    //       fill: "white",  
    //       title: "Debe introducir un código",
          
    //     });
    //   //setError("Por favor, introduce el código.");
    //   return;
    // }
    if (code.trim() !== VALID_CODE) {
      sileo.error({
          fill: "white",
          title: "Código incorrecto."          
        });
      setError("");
      return;
    }

    setLoading(true);
    localStorage.setItem("user", username);
    sileo.success({ title: "Sesión Iniciada" });
    navigate.push("/Calendar");
    setLoading(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError("");
    // Si cambia el username, ocultar el código y limpiarlo para que tenga que validar de nuevo
    if (showCodeInput) {
      setShowCodeInput(false);
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
      
        {!isKeyboardVisible && (
            <img src="./White-logo.png" className="w-40"></img>
        )}
            
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
          
          {/* Input del código - solo se muestra después de Sign In con username correcto */}
          {showCodeInput && (
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border transition-colors ${
                error && (code.trim() !== VALID_CODE || !code.trim())
                  ? "border-red-500"
                  : code.trim() === VALID_CODE
                  ? "border-green-500"
                  : "border-white/15"
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
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-(--glass-border) font-semibold shadow-2xl/20 inset-shadow-sm inset-shadow-current/20 backdrop-blur-sm bg-(--glass-bg) inset-shadow-sm text-white cursor-pointer [&:hover]:scale-110 transition duration-300 hover:bg-orange-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
            // className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 hover:bg-orange-600"
          >
            {loading ? "Cargando.....": "Sign In"}
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
