import React, { FormEvent, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { VALID_CODE } from "../../constants";

interface OTPInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
  loading: boolean;
}

export default function OTPInput({
  code,
  onCodeChange,
  onSubmit,
  onResend,
  loading,
}: OTPInputProps) {
  const { t } = useTranslation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (code.length <= 6) {
      const nextInput = inputRefs.current[code.length];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [code.length]);

  const handleInputChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue.length > 1) {
      return;
    }

    const newCode = code.split("");
    newCode[index] = numericValue;
    const updatedCode = newCode.slice(0, 6).join("");

    onCodeChange(updatedCode);

    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = code.split("");
        newCode[index] = "";
        onCodeChange(newCode.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (pastedText.length > 0) {
      const newCode = (pastedText + code).slice(0, 6);
      onCodeChange(newCode);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Inputs OTP - 6 dígitos - Responsive */}
      <div className="flex justify-center gap-1.5 sm:gap-2.5">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            className="w-11 h-11 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl sm:rounded-2xl bg-white/10 border-2 border-white/30 text-white placeholder:text-white/30 outline-none focus:border-white/60 focus:bg-white/20 focus:shadow-lg focus:shadow-white/10 transition-all duration-200 backdrop-blur-md disabled:opacity-50 flex items-center justify-center"
            placeholder="•"
          />
        ))}
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Botón Resend Code */}
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-400/40 text-blue-300 text-xs sm:text-sm font-semibold hover:from-blue-500/30 hover:to-blue-400/20 hover:border-blue-400/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
        >
          🔄 {t("Login.resendCode")}
        </button>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/40 text-white text-sm sm:text-base font-semibold hover:from-white/30 hover:to-white/20 hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-xl shadow-lg hover:shadow-xl w-full sm:w-auto"
        >
          {loading ? "..." : t("Login.continue")}
        </button>
      </div>

      {/* DEMO hint */}
      <p className="text-xs text-white/40 text-center pt-1">
        {t("Login.demoCode")}: <span className="font-semibold text-white/60">{VALID_CODE}</span>
      </p>
    </form>
  );
}
