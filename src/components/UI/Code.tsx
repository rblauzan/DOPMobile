// components/OtpVerification.tsx
import React, { useState, useEffect } from 'react';
import OtpInput from './OtpInput';

interface OtpVerificationProps {
  phoneNumber?: string;
  onVerify?: (otp: string) => Promise<boolean>;
  onResend?: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  phoneNumber = '+34 612 345 678',
  onVerify,
  onResend
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleComplete = async (code: string) => {
    setOtp(code);
    
    if (onVerify) {
      setIsVerifying(true);
      setError('');
      
      try {
        const isValid = await onVerify(code);
        if (isValid) {
          setIsSuccess(true);
          setError('');
        } else {
          setError('Código incorrecto. Intenta de nuevo.');
        }
      } catch (err) {
        setError('Error al verificar. Intenta de nuevo.');
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setOtp('');
    setError('');
    onResend?.();
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="bg-green-100 text-green-700 p-4 rounded-lg">
          <span className="text-2xl mr-2">✅</span>
          ¡Código verificado correctamente!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-4 bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Verifica tu teléfono
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Hemos enviado un código de 4 dígitos a
      </p>
      
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-8">
        {phoneNumber}
      </p>

      <OtpInput length={4} onComplete={handleComplete} />

      {isVerifying && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-blue-600">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Verificando...
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center">
          ❌ {error}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleResend}
          disabled={timeLeft > 0}
          className={`
            text-sm font-medium transition-colors
            ${timeLeft > 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            }
          `}
        >
          {timeLeft > 0 
            ? `Reenviar código en ${timeLeft}s` 
            : '¿No recibiste el código? Reenviar'
          }
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;