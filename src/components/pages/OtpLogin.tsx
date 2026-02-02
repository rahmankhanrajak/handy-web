import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const OTP_LENGTH = 4;
const HARDCODED_OTP = "1290";

const OtpLogin: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const verifyOtp = () => {
  const enteredOtp = otp.join("");

  if (enteredOtp === HARDCODED_OTP) {
    alert("OTP verified successfully ✅");
     navigate("/products");
  } else {
    alert("Invalid OTP ❌");
  }
};

  // 🔔 Trigger alert when OTP screen opens
  useEffect(() => {
    if (step === 2) {
      setShowAlert(true);

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setMobile(value);
  };

 const handleOtpChange = (
  e: ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const value = e.target.value.slice(-1).replace(/\D/g, "");

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < OTP_LENGTH - 1) {
    (
      document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null
    )?.focus();
  }
};


  return (
    <>
      {showAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slideDown">
            OTP sent to +91 {mobile}
          </div>
        </div>
      )}

      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-md">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Login</h2>
              <p className="text-gray-500 mb-6">
                Enter your mobile number to continue
              </p>

              <input
                type="tel"
                value={mobile}
                onChange={handleMobileChange}
                placeholder="Enter mobile number"
                className="w-full border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                onClick={() => setStep(2)}
                disabled={mobile.length !== 10}
                className="mt-6 w-full py-3 rounded-lg bg-orange-500 text-white text-lg font-semibold disabled:opacity-40"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
              <p className="text-gray-500 mb-6">
                Enter the OTP to continue
              </p>

              <div className="flex justify-between mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="w-12 h-12 border rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={!otp.every((d) => d !== "")}
                className="w-full py-3 rounded-lg bg-orange-500 text-white text-lg font-semibold disabled:opacity-40"
              >
                Verify OTP
              </button>

              <button
                onClick={() => setStep(1)}
                className="mt-4 text-sm text-orange-500 w-full"
              >
                Change mobile number
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translate(-50%, -20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.4s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default OtpLogin;
