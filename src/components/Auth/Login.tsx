import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { sileo } from "sileo";
import { useTranslation } from "react-i18next";
import ToggleRole from "../UI/Toggle";
import { ADMIN_USER, DEMO_TOKEN, REGISTER, VALID_CODE } from "../../constants";
import { Step, Role, Company } from "../../models/Login";
import VerificationPanel from "./VerificacionPanel";
import { useCompanies } from "../../services/apicompanies";

export default function LoginComponent() {
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

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Hook para obtener compañías del JSON
  const { companies: allCompanies, loading: companiesLoading, error: companiesError } = useCompanies();

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

  const keyboardOffset =
    isKeyboardVisible && keyboardHeight ? keyboardHeight * 0.4 : isKeyboardVisible ? 60 : 0;

  const demoLoginGetCompanies = async (userEmail: string) => {
    if (userEmail.trim() !== ADMIN_USER) {
      throw new Error(t("Login.notificacion1"));
    }

    // Usar las compañías del JSON cargadas por el hook
    return allCompanies;
  };

  const demoSendCompanyCode = async (userEmail: string, _company: Company) => {
    if (userEmail.trim() !== ADMIN_USER) {
      throw new Error(t("Login.notificacion1"));
    }
    return true;
  };

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

  const onSelectCompany = async (company: Company) => {
    try {
      setLoading(true);
      setSelectedCompany(company);

      await demoSendCompanyCode(email, company);

      setCode("");
      sileo.success({ title: t("Login.resendCode1") });
    } catch (err: any) {
      setSelectedCompany(null);
      sileo.error({ fill: "white", title: err?.message || t("Login.resendCode2") });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCompany) return;

    if (!code.trim()) {
      sileo.error({ fill: "white", title: t("Login.resendCodePlaceholder") });
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
      sileo.error({ fill: "white", title: err?.message || t("Login.resendCode3") });
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!selectedCompany) return;

    try {
      setLoading(true);
      await demoSendCompanyCode(email, selectedCompany);
      sileo.success({ title: t("Login.resendCode4") });
    } catch (err: any) {
      sileo.error({ fill: "white", title: err?.message || t("Login.resendCode5") });
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
      {!isKeyboardVisible && step === "LOGIN" && (
        <img src="./White-logo.png" className="w-40" alt="logo" />
      )}
      <h2 className="text-2xl font-semibold text-center">OPERATIONS PRO</h2>

      {step === "LOGIN" && (
        <>
          <span className="mb-2">{t("Login.welcome")}</span>

          <div className="m-4">
            <ToggleRole value={isOwner} onChange={setIsOwner} />
          </div>

          <form onSubmit={onSubmitLogin} className="space-y-4 w-full max-w-md">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 outline-none"
              placeholder={t("Login.placeholder")}
            />

            <button
              type="submit"
              disabled={loading || companiesLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 font-semibold shadow-2xl/20 backdrop-blur-sm text-white cursor-pointer [&:hover]:scale-95 transition duration-300 hover:bg-orange-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || companiesLoading ? t("Login.loading") : t(`Login.button${role}`)}
            </button>
          </form>

          {companiesError && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
              {companiesError}
            </div>
          )}

          <div className="mt-5 w-full max-w-md flex flex-col items-center">
            <div className="w-full flex items-center justify-center gap-3">
              <div className="w-16 border-t border-gray-200/50 border-[0.5px]" />
              <span className="text-sm font-medium leading-6 text-gray-400 shrink-0">Or</span>
              <div className="w-16 border-t border-gray-200/50 border-[0.5px]" />
            </div>

            <div className="mt-6 w-full">
              <a
                href={REGISTER}
                className="flex justify-center items-center w-full px-4 py-2 rounded-xl bg-white/10 border border-white/15 font-semibold shadow-2xl/20 backdrop-blur-sm text-white cursor-pointer [&:hover]:scale-95 transition duration-300 hover:bg-orange-600/80"
              >
                <span className="text-md font-semibold leading-6">{t("Login.button1")}</span>
              </a>
            </div>
          </div>
        </>
      )}

      {step === "COMPANY" && (
        <div className="w-full max-w-xl">
          <div className="w-full rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-center text-white">
              {t("Login.welcome1")} {email.split("@")[0] || "👋"} <span className="inline-block">👋</span>
            </h3>
            <p className="text-center text-sm text-white/70 mt-1">
              {t("Login.selectCompany")}
            </p>

            {companies.length > 5 && (
              <div className="mt-5">
                <input
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder={t("Login.searchCompany")}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 outline-none"
                />
              </div>
            )}

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
                        ? "bg-orange-400/30 border-orange-400/30"
                        : "bg-white/10 border-white/15 hover:bg-orange-400/20"
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
                        <div className="text-white/60 text-xs">{c.subtitle ?? t("Login.enter")}</div>
                      </div>
                    </div>

                    <span className="text-white/70 text-xl">→</span>
                  </button>
                );
              })}

              {filteredCompanies.length === 0 && (
                <div className="text-center text-white/70 text-sm py-6"> {t("Login.noCompanies")} </div>
              )}
            </div>

            {selectedCompany && (
              <VerificationPanel
                email={email}
                company={selectedCompany}
                code={code}
                onCodeChange={setCode}
                onSubmitCode={onSubmitCode}
                onResendCode={onResendCode}
                loading={loading}
              />
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
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
                {t("Login.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center mt-6">
        © {new Date().getFullYear()} Diamond Operations Pro Inc.
      </p>
      <span className="text-xs text-slate-400 text-center block">- Owner App -</span>
    </div>
  );
}