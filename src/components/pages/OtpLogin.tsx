import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";

const OTP_LENGTH = 4;
const HARDCODED_OTP = "1290";

const OtpLogin: React.FC = () => {
  const dispatch = useDispatch();
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
      dispatch(loginSuccess());
      alert("OTP verified successfully ✅");
      navigate("/products");
    } else {
      alert("Invalid OTP ❌");
    }
  };

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
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-slideDown">
            OTP sent to +91 {mobile}
          </div>
        </div>
      )}

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL – FOOD APP CONTENT */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 text-white
            bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-3 rounded-xl text-2xl">
                🍔
              </div>
              <div>
                <h1 className="text-3xl font-bold">Handy</h1>
                <p className="text-sm opacity-90">
                  Food Delivery App
                </p>
              </div>
            </div>

            <p className="max-w-md text-lg opacity-95">
              Order your favourite food from nearby restaurants and
              get it delivered hot & fresh to your doorstep.
            </p>
          </div>

          <div className="space-y-4">
            {[
              ["🍕", "Unlimited Choices", "Explore restaurants & cuisines near you"],
              ["⚡", "Fast Delivery", "Lightning-fast doorstep delivery"],
              ["🚴", "Live Order Tracking", "Track your food in real-time"],
              ["💳", "Easy Payments", "UPI, Cards & Cash on Delivery"],
            ].map(([icon, title, desc], i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl bg-white/15 backdrop-blur"
              >
                <div className="text-2xl">{icon}</div>
                <div>
                  <h4 className="font-semibold">{title}</h4>
                  <p className="text-sm opacity-90">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs opacity-80">
            © 2026 Handy Food Services Pvt Ltd
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center bg-gradient-to-br from-white to-green-50 px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">

            <div className="flex justify-center mb-6">
              <div className="bg-orange-600 text-white p-3 rounded-2xl">
                🛡️
              </div>
            </div>

            {step === 1 ? (
              <>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Welcome Back 👋
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  Login to continue your journey
                </p>

                <label className="text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={handleMobileChange}
                  placeholder="Enter mobile number"
                  className="mt-2 w-full border rounded-xl px-4 py-3 text-lg
                focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  onClick={() => setStep(2)}
                  disabled={mobile.length !== 10}
                  className="mt-6 w-full py-3 rounded-xl
                bg-orange-600 hover:bg-orange-700 transition
                text-white font-semibold disabled:opacity-40"
                >
                  Send OTP →
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Verify OTP 
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  Enter the code sent to +91 {mobile}
                </p>

                <div className="flex justify-between mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      className="w-14 h-14 border rounded-xl text-center text-xl
                    focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ))}
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={!otp.every((d) => d !== "")}
                  className="w-full py-3 rounded-xl
                bg-orange-600 hover:bg-orange-700 transition
                text-white font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Verify & Continue →
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-sm text-orange-600 w-full"
                >
                  Change mobile number
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
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
