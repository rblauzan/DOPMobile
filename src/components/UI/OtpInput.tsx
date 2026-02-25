// components/OtpInput.tsx
import React, { useRef, useState, useEffect, ClipboardEvent, KeyboardEvent } from 'react';

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  autoFocus?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ 
  length = 4, 
  onComplete,
  autoFocus = true 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  }, [otp, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value)) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3 flex-wrap" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          className="w-14 h-16 text-center text-2xl font-semibold 
                     border-2 border-gray-200 rounded-xl
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                     outline-none transition-all duration-200
                     dark:bg-gray-800 dark:border-gray-700 dark:text-white
                     dark:focus:border-blue-400 dark:focus:ring-blue-900"
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;