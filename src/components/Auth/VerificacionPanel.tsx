import React from "react";
import { useTranslation } from "react-i18next";
import { Company, VerificationPanelProps } from "../../models/Login";
import OTPInput from "../Auth/OtpInput";



export default function VerificationPanel({
  email,
  company,
  code,
  onCodeChange,
  onSubmitCode,
  onResendCode,
  loading,
}: VerificationPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-8 rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-3">
          <span className="text-lg">✓</span>
        </div>
        <h3 className="text-xl font-bold text-white">{t("Login.verificationCode")}</h3>
        <p className="text-white/60 text-sm mt-2 leading-relaxed">
          {t("Login.verificationCode1")} <span className="text-white/90 font-semibold">{email}</span>
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          {t("Login.verificationCode2")} <span className="text-white/90 font-semibold">{company.name}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="mt-6">
        <OTPInput
          code={code}
          onCodeChange={onCodeChange}
          onSubmit={onSubmitCode}
          onResend={onResendCode}
          loading={loading}
        />
      </div>
    </div>
  );
}