// import { FormEvent, useState, useEffect, useRef } from "react";
// import { useHistory } from "react-router";
// import { useLocation } from "react-router-dom";
// import { Keyboard } from "@capacitor/keyboard";
// import { sileo } from "sileo";
// import { useTranslation } from "react-i18next";
// import ToggleRole from "../UI/Toggle";
// import { REGISTER } from "../../constants";

// export default function LoginComponent() {
//   // 🔐 Credenciales demo
//   const ADMIN_USER = "admin@gmail.com";
//   const VALID_CODE = "1234";
//   const { t } = useTranslation();
//   // 🚀 Inputs precargados
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isOwner,setisOwner]= useState(false)
//   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   // Solo mostrar código después de que el usuario hizo click en Sign In y el username es correcto
//   const [showCodeInput, setShowCodeInput] = useState(false);
//   const navigate = useHistory();
//   const location = useLocation();
//   const prevPathRef = useRef<string | null>(null);
//   const role = isOwner ? "Owner" : "User";
//   // Limpiar formulario al llegar a Login (p. ej. después de logout)
//   useEffect(() => {
//     const current = location.pathname;
//     const prev = prevPathRef.current;
//     prevPathRef.current = current;
//     if (current === "/Login" && prev !== "/Login") {
//       setEmail("");
//       setCode("");
//       setShowCodeInput(false);
//       setError("");
//     }
//   }, [location.pathname]);

//   // Verificar si el usuario ya tiene sesión activa al cargar el componente
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (user) {
//       // Si ya hay un usuario en localStorage, redirigir a Calendar
//       navigate.replace("/Calendar");
//     } 
//   }, [navigate]);

//   // Detectar cuando el teclado se muestra/oculta
//   useEffect(() => {
//     let listeners: Awaited<ReturnType<typeof Keyboard.addListener>>[] = [];

//     const setupListeners = async () => {
//       const keyboardWillShowListener = await Keyboard.addListener(
//         "keyboardWillShow",
//         (info) => {
//           setIsKeyboardVisible(true);
//           // Altura del teclado en píxeles para poder empujar el contenido hacia arriba
//           setKeyboardHeight(info.keyboardHeight ?? 0);
//         },
//       );

//       const keyboardWillHideListener = await Keyboard.addListener(
//         "keyboardWillHide",
//         () => {
//           setIsKeyboardVisible(false);
//           setKeyboardHeight(0);
//         },
//       );

//       const keyboardDidShowListener = await Keyboard.addListener(
//         "keyboardDidShow",
//         (info) => {
//           setIsKeyboardVisible(true);
//           setKeyboardHeight(info.keyboardHeight ?? 0);
//         },
//       );

//       const keyboardDidHideListener = await Keyboard.addListener(
//         "keyboardDidHide",
//         () => {
//           setIsKeyboardVisible(false);
//           setKeyboardHeight(0);
//         },
//       );

//       listeners = [
//         keyboardWillShowListener,
//         keyboardWillHideListener,
//         keyboardDidShowListener,
//         keyboardDidHideListener,
//       ];
//     };

//     setupListeners();

//     // Cleanup listeners al desmontar el componente
//     return () => {
//       listeners.forEach((listener) => listener.remove());
//     };
//   }, []);

//   // Validar si el username es válido
//   const isUsernameValid = email === ADMIN_USER;

//   const handleLogin = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");

//     // Primera etapa: validar username al hacer click en Sign In
//     if (!showCodeInput) {
//       if (email !== ADMIN_USER) {
//         sileo.error({
//           fill: "white",
//           title: t("Login.notificacion1"),
//         });
//         setError("");
//         return;
//       }
//       // Email correcto → mostrar input del código
//       setShowCodeInput(true);
//       return;
//     }

//     // Segunda etapa: validar código
//     // if (!code.trim()) {
//     //    sileo.error({
//     //       fill: "white",
//     //       title: "Debe introducir un código",

//     //     });
//     //   //setError("Por favor, introduce el código.");
//     //   return;
//     // }
//     if (code.trim() !== VALID_CODE) {
//       sileo.error({
//         fill: "white",
//         title: t("Login.notificacion2"),
//       });
//       setError("");
//       return;
//     }

//     setLoading(true);
//     localStorage.setItem("user", email);
//     sileo.success({ title: t("Login.notificacion3") });
//     navigate.push("/Calendar");
//     setLoading(false);
//   };

//   const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//     setError("");
//     // Si cambia el username, ocultar el código y limpiarlo para que tenga que validar de nuevo
//     if (showCodeInput) {
//       setShowCodeInput(false);
//       setCode("");
//     }
//   };

//   const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCode(e.target.value);
//     setError(""); // Limpiar error cuando el usuario empiece a escribir el código
//   };

//   // Desplazamiento más suave cuando aparece el teclado
//   const keyboardOffset =
//     isKeyboardVisible && keyboardHeight
//       ? keyboardHeight * 0.4 // solo un porcentaje de la altura del teclado
//       : isKeyboardVisible
//         ? 60 // fallback en caso de no tener altura
//         : 0;

//   return (
//     <>
//       <div
//         className="min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-300"
//         style={{
//           // Cuando el teclado está visible, movemos el contenido hacia arriba pero menos
//           transform: `translateY(-${keyboardOffset}px)`,
//         }}
//       >
//         {!isKeyboardVisible && <img src="./White-logo.png" className="w-40" />}
//         <h2 className="text-2xl font-semibold text-center">OPERATIONS PRO</h2>
//         <span className="mb-2">{t("Login.welcome")}</span>
//         <div className="m-4">
//           <ToggleRole value={isOwner} onChange={setisOwner} />
//         </div>
//         <form onSubmit={handleLogin} className="space-y-4 w-full">
//           {/* Usuario precargado */}
//           <input
//             type="email"
//             value={email}
//             onChange={handleUsernameChange}
//             className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border transition-colors ${
//               error && !isUsernameValid
//                 ? "border-red-500"
//                 : isUsernameValid
//                   ? "border-green-500"
//                   : "border-white/15"
//             }`}
//             placeholder={t("Login.placeholder")}
//           />

//           {/* Input del código - solo se muestra después de Sign In con username correcto */}
//           {showCodeInput && (
//             <input
//               type="text"
//               value={code}
//               onChange={handleCodeChange}
//               className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border transition-colors ${
//                 error && (code.trim() !== VALID_CODE || !code.trim())
//                   ? "border-red-500"
//                   : code.trim() === VALID_CODE
//                     ? "border-green-500"
//                     : "border-white/15"
//               }`}
//               placeholder={t("Login.placeholderCode")}
//             />
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full px-4 py-3 rounded-xl bg-white/10 border border-(--glass-border) font-semibold shadow-2xl/20 inset-shadow-sm inset-shadow-current/20 backdrop-blur-sm bg-(--glass-bg) inset-shadow-sm text-white cursor-pointer [&:hover]:scale-95 transition duration-300 hover:bg-orange-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? t("Login.loading") : t(`Login.button${role}`)}
//           </button>
//         </form>
//         <div className="mt-5 w-full flex flex-col items-center">
//           <div className="w-full flex items-center justify-center gap-3">
//             <div className="w-16 border-t border-gray-200/50 border-[0.5px]" />
//             <span className="text-sm font-medium leading-6 text-gray-400 shrink-0">
//               Or
//             </span>
//             <div className="w-16 border-t border-gray-200/50 border-[0.5px]" />
//           </div>

//           <div className="mt-6 w-full">
//             <a
//               href={REGISTER}
//               className="flex justify-center items-center w-full px-4 py-2 rounded-xl bg-white/10 border-(--glass-border) font-semibold shadow-2xl/20 inset-shadow-sm inset-shadow-current/20 backdrop-blur-sm bg-(--glass-bg) inset-shadow-sm text-white cursor-pointer [&:hover]:scale-95 transition duration-300 hover:bg-orange-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="text-md font-semibold leading-6">
//                 {t("Login.button1")}
//               </span>
//             </a>
//           </div>
//         </div>
//         {/* Mensaje claro de DEMO */}
//         <p className="text-xs text-slate-400 text-center mt-6">
//           © {new Date().getFullYear()} Diamond Operations Pro Inc.
//         </p>
//         <span className="text-xs text-slate-400 text-center">
//           - Owner App -
//         </span>
//       </div>
//     </>
//   );
// }

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { sileo } from "sileo";
import { useTranslation } from "react-i18next";
import ToggleRole from "../UI/Toggle";
import { REGISTER } from "../../constants";

type Role = "Owner" | "User";
type Step = "LOGIN" | "COMPANY";

type Company = {
  id: string;
  name: string;
  subtitle?: string;
  logoUrl?: string;
};

export default function LoginComponent() {
  // ✅ DEMO
  const ADMIN_USER = "admin@gmail.com";
  const VALID_CODE = "123456"; // 6 dígitos
  const DEMO_TOKEN = "demo-token-123";

  const { t } = useTranslation();
  const navigate = useHistory();
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);

  const [step, setStep] = useState<Step>("LOGIN");

  const [email, setEmail] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const role: Role = isOwner ? "Owner" : "User";

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [companySearch, setCompanySearch] = useState("");

  // Capacitor keyboard
  const [isKeyboardVisible, setIsKeyboardVisible,] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Reset al entrar a /Login
  useEffect(() => {
    const current = location.pathname;
    const prev = prevPathRef.current;
    prevPathRef.current = current;

    if (current === "/Login" && prev !== "/Login") {
      setEmail("");
      setIsOwner(false);
      setCompanies([]);
      setSelectedCompany(null);
      setCode("");
      setCompanySearch("");
      setStep("LOGIN");
      setLoading(false);
    }
  }, [location.pathname]);

  // Si ya hay sesión, redirigir
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedCompany = localStorage.getItem("company");

    if (storedUser && storedToken && storedCompany) {
      navigate.replace("/Calendar");
    }
  }, [navigate]);

  // Listeners teclado
  useEffect(() => {
    let listeners: Awaited<ReturnType<typeof Keyboard.addListener>>[] = [];

    const setupListeners = async () => {
      const keyboardWillShowListener = await Keyboard.addListener(
        "keyboardWillShow",
        (info) => {
          setIsKeyboardVisible(true);
          setKeyboardHeight(info.keyboardHeight ?? 0);
        },
      );

      const keyboardWillHideListener = await Keyboard.addListener(
        "keyboardWillHide",
        () => {
          setIsKeyboardVisible(false);
          setKeyboardHeight(0);
        },
      );

      const keyboardDidShowListener = await Keyboard.addListener(
        "keyboardDidShow",
        (info) => {
          setIsKeyboardVisible(true);
          setKeyboardHeight(info.keyboardHeight ?? 0);
        },
      );

      const keyboardDidHideListener = await Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setIsKeyboardVisible(false);
          setKeyboardHeight(0);
        },
      );

      listeners = [
        keyboardWillShowListener,
        keyboardWillHideListener,
        keyboardDidShowListener,
        keyboardDidHideListener,
      ];
    };

    setupListeners();

    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, []);

  // Offset teclado: solo cuando hay input (LOGIN y el panel de CODE)
  const keyboardOffset =
    isKeyboardVisible && keyboardHeight ? keyboardHeight * 0.4 : isKeyboardVisible ? 60 : 0;

  // ✅ DEMO: login devuelve companies si el email es válido
  const demoLoginGetCompanies = async (userEmail: string) => {
    if (userEmail.trim() !== ADMIN_USER) {
      throw new Error(t("Login.notificacion1"));
    }

    const list: Company[] = [
      {
        id: "c1",
        name: "Diamond Shine Cleaning Enterprises LL",
        subtitle: "Enter Dashboard",
      },
      { id: "c2", name: "Luxstays", subtitle: "Enter Dashboard" },
      { id: "c3", name: "DOP", subtitle: "Enter Dashboard" },
    ];

    return list;
  };

  // ✅ DEMO: seleccionar company => “envía” código
  const demoSendCompanyCode = async (userEmail: string, _company: Company) => {
    if (userEmail.trim() !== ADMIN_USER) {
      throw new Error(t("Login.notificacion1"));
    }
    return true;
  };

  // ✅ DEMO: verificar código
  const demoVerifyCode = async (input: string) => {
    if (input.trim() !== VALID_CODE) {
      throw new Error(t("Login.notificacion2"));
    }
    return DEMO_TOKEN;
  };

  const onSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);

      const list = await demoLoginGetCompanies(email);

      localStorage.setItem("user", email);
      localStorage.setItem("role", role);

      setCompanies(list);
      setStep("COMPANY");
    } catch (err: any) {
      sileo.error({ fill: "white", title: err?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPORTANT: ya NO cambiamos de pantalla, mostramos el panel debajo
  const onSelectCompany = async (company: Company) => {
    try {
      setLoading(true);
      setSelectedCompany(company);

      await demoSendCompanyCode(email, company);

      setCode("");
      sileo.success({ title: "Access code sent" });
      // step sigue siendo "COMPANY"
    } catch (err: any) {
      setSelectedCompany(null);
      sileo.error({ fill: "white", title: err?.message || "Failed to send code" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCompany) return;

    if (!code.trim()) {
      sileo.error({ fill: "white", title: "Enter the 6-digit code" });
      return;
    }

    try {
      setLoading(true);

      const token = await demoVerifyCode(code);

      localStorage.setItem("token", token);
      localStorage.setItem("company", JSON.stringify(selectedCompany));

      sileo.success({ title: t("Login.notificacion3") });
      navigate.push("/Calendar");
    } catch (err: any) {
      sileo.error({ fill: "white", title: err?.message || "Invalid code" });
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!selectedCompany) return;

    try {
      setLoading(true);
      await demoSendCompanyCode(email, selectedCompany);
      sileo.success({ title: "Code resent" });
    } catch (err: any) {
      sileo.error({ fill: "white", title: err?.message || "Failed to resend" });
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    (c.name || "").toLowerCase().includes(companySearch.toLowerCase().trim()),
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-300"
      style={{ transform: `translateY(-${keyboardOffset}px)` }}
    >
      {/* BRAND */}
      {!isKeyboardVisible && step === "LOGIN" && (
        <img src="./White-logo.png" className="w-40" alt="logo" />
      )}
      <h2 className="text-2xl font-semibold text-center">OPERATIONS PRO</h2>

      {/* ================= STEP: LOGIN ================= */}
      {step === "LOGIN" && (
        <>
          <span className="mb-2">{t("Login.welcome")}</span>

          <div className="m-4">
            <ToggleRole value={isOwner} onChange={setIsOwner} />
          </div>

          <form onSubmit={onSubmitLogin} className="space-y-4 w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 outline-none"
              placeholder={t("Login.placeholder")}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 font-semibold shadow-2xl/20 backdrop-blur-sm text-white cursor-pointer [&:hover]:scale-95 transition duration-300 hover:bg-orange-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("Login.loading") : t(`Login.button${role}`)}
            </button>
          </form>

          <div className="mt-5 w-full max-w-md flex flex-col items-center">
            <div className="w-full flex items-center justify-center gap-3">
              <div className="w-16 border-t border-gray-200/50 border-[0.5px]" />
              <span className="text-sm font-medium leading-6 text-gray-400 shrink-0">Or</span>
              <div className="w-16 border-t border-gray-200/50 border-[0.5px]" />
            </div>

            <div className="mt-6 w-full">
              <a
                href={`https://saasapp.diamondoperationspro.com/#/subscription/wizard/7,2`}
                className="flex justify-center items-center w-full px-4 py-2 rounded-xl bg-white/10 border border-white/15 font-semibold shadow-2xl/20 backdrop-blur-sm text-white cursor-pointer [&:hover]:scale-95 transition duration-300 hover:bg-orange-600/80"
              >
                <span className="text-md font-semibold leading-6">{t("Login.button1")}</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* ================= STEP: COMPANY (lista + panel debajo) ================= */}
      {step === "COMPANY" && (
        <div className="w-full max-w-xl">
          <div className="w-full rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-center text-white">
              Welcome back {email.split("@")[0] || "👋"} <span className="inline-block">👋</span>
            </h3>
            <p className="text-center text-sm text-white/70 mt-1">
              Select the company you want to access
            </p>

            <div className="mt-5">
              <input
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Search company..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 outline-none"
              />
            </div>

            <div className="mt-5 space-y-3 max-h-[260px] overflow-auto pr-1">
              {filteredCompanies.map((c) => {
                const active = selectedCompany?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={loading}
                    onClick={() => onSelectCompany(c)}
                    className={`w-full flex items-center justify-between gap-4 px-4 py-4 rounded-2xl border transition disabled:opacity-60 ${
                      active
                        ? "bg-white/15 border-white/30"
                        : "bg-white/10 border-white/15 hover:bg-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden">
                        {c.logoUrl ? (
                          <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white/80 text-sm">🏢</span>
                        )}
                      </div>

                      <div className="text-left">
                        <div className="text-white font-semibold leading-5">{c.name}</div>
                        <div className="text-white/60 text-xs">{c.subtitle ?? "Enter Dashboard"}</div>
                      </div>
                    </div>

                    <span className="text-white/70 text-xl">→</span>
                  </button>
                );
              })}

              {filteredCompanies.length === 0 && (
                <div className="text-center text-white/70 text-sm py-6">No companies found.</div>
              )}
            </div>

            {/* ✅ PANEL DE CÓDIGO DEBAJO (como imagen) */}
            {selectedCompany && (
              <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5">
                <div className="text-white font-semibold">Verification code required</div>

                <p className="text-white/70 text-sm mt-2">
                  A verification code has been sent to{" "}
                  <span className="text-white font-semibold">{email}</span>. Enter it below
                  to securely access{" "}
                  <span className="text-white font-semibold">{selectedCompany.name}</span>.
                </p>

                <form onSubmit={onSubmitCode} className="mt-4 flex items-center gap-3">
                  <input
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 outline-none"
                  />

                  
                </form>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onResendCode}
                    disabled={loading}
                    className="text-sm text-white/80 hover:text-white underline underline-offset-4 disabled:opacity-60"
                  >
                    Resend code
                  </button>

                  <button
                    type="button"
                    onClick={onSubmitCode}
                    disabled={loading}
                    className="px-6 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition disabled:opacity-60"
                  >
                    {loading ? "..." : "Continue"}
                  </button>
                </div>
                
                {/* DEMO hint opcional */}
                <p className="text-xs text-white/40 mt-4">
                  Demo code: <span className="font-semibold">{VALID_CODE}</span>
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  // volver al login
                  setStep("LOGIN");
                  setCompanies([]);
                  setSelectedCompany(null);
                  setCode("");
                  setCompanySearch("");
                  localStorage.removeItem("token");
                  localStorage.removeItem("company");
                }}
                className="px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-slate-400 text-center mt-6">
        © {new Date().getFullYear()} Diamond Operations Pro Inc.
      </p>
      <span className="text-xs text-slate-400 text-center block">- Owner App -</span>
    </div>
  );
}