import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";

const OTP_LENGTH = 4;
const HARDCODED_OTP = "1290";

const foodImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
];

const OtpLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  // Rotate background images
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % foodImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "");
    if (v.length <= 10) setMobile(v);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "");
    if (v.length <= OTP_LENGTH) setOtp(v);
  };

  const handleSendOtp = () => {
    if (mobile.length !== 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 800);
  };

  const verifyOtp = () => {
    if (otp.length !== OTP_LENGTH) return;
    setIsLoading(true);

    setTimeout(() => {
      if (otp === HARDCODED_OTP) {
        dispatch(loginSuccess());
        navigate("/selectService");
      } else {
        setIsLoading(false);
        setOtp("");
        alert("Invalid OTP (Try 1290)");
      }
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (step === 1) handleSendOtp();
      else verifyOtp();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden bg-white/90 backdrop-blur-lg border border-gray-200/50 shadow-2xl">

        {/* TOP BRAND / FOOD SECTION */}
        <div className="relative p-6 border-b border-gray-200/50 overflow-hidden min-h-[320px] flex flex-col justify-end group">

          {/* Background Slider */}
          <div className="absolute inset-0 z-0 bg-gray-900">
            {foodImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[10000ms] scale-110"
                  style={{ backgroundImage: `url(${img})` }}
                ></div>
              </div>
            ))}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
          </div>

          <div className="relative z-10">
            {/* BRAND */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">H</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/80 font-medium">
                  Welcome to
                </p>
                <p className="text-2xl font-black text-white tracking-tight">
                  Handy
                </p>
              </div>
            </div>

            {/* TAGLINE */}
            <p className="text-white/90 text-sm mb-6 leading-relaxed max-w-xs">
              Fresh food, multiple cuisines & quick service.
              <span className="block text-orange-400 font-bold mt-1">Ready to serve?</span>
            </p>

            {/* FOOD HIGHLIGHTS (Detailed Vertical List) */}
            <div className="space-y-3 mt-6">
              {[
                ["🍕", "Unlimited Choices", "Explore restaurants & cuisines near you"],
                ["⚡", "Fast Delivery", "Lightning-fast doorstep delivery"],
                ["🚴", "Live Order Tracking", "Track your food in real-time"],
                ["💳", "Easy Payments", "UPI, Cards & Cash on Delivery"],
              ].map(([icon, title, desc], i) => (
                <div
                  key={i}
                  className="flex gap-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/5 hover:bg-white/20 transition-colors"
                >
                  <div className="text-2xl">{icon}</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{title}</h4>
                    <p className="text-xs text-white/70">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOGIN SECTION */}
        <div className="p-6">
          <div className="flex justify-center gap-2 mb-6">
            <div className={`h-1 rounded-full ${step === 1 ? "w-8 bg-orange-500" : "w-2 bg-gray-200"}`} />
            <div className={`h-1 rounded-full ${step === 2 ? "w-8 bg-orange-500" : "w-2 bg-gray-200"}`} />
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-lg font-bold text-gray-800 text-center mb-6">
                Enter Mobile Number
              </h2>

              <div className="flex items-center h-14 px-4 mb-6 rounded-xl bg-white border border-gray-300 focus-within:border-orange-500 transition">
                <span className="text-gray-500 mr-2">+91</span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={handleMobileChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="flex-1 outline-none text-gray-800 tracking-widest bg-transparent"
                  placeholder="__________"
                  maxLength={10}
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={mobile.length !== 10 || isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition"
              >
                {isLoading ? "PROCESSING..." : "GET OTP"}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-bold text-gray-800">
                  Verification Code
                </h2>
              </div>

              <p className="text-center text-gray-500 text-sm mb-6">
                Sent to +91 {mobile}
                <button
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="ml-2 text-orange-600 font-semibold hover:text-orange-700"
                >
                  Change
                </button>
              </p>

              {/* OTP INPUT – SIMPLE & RELIABLE */}
              <div className="mb-8">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={otp}
                  onChange={handleOtpChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  maxLength={OTP_LENGTH}
                  placeholder="• • • •"
                  className="
        w-full h-14
        text-center
        text-2xl
        tracking-[0.5em]
        rounded-xl
        border border-gray-300
        focus:border-orange-500
        focus:ring-2 focus:ring-orange-500/20
        outline-none
        text-gray-800
        placeholder:text-gray-300
      "
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={otp.length !== OTP_LENGTH || isLoading}
                className="
    w-full py-3 rounded-xl
    bg-orange-500
    text-white font-bold
    shadow-lg hover:shadow-xl
    disabled:opacity-50
    transition
  "
              >
                {isLoading ? "VERIFYING..." : "UNLOCK TERMINAL"}
              </button>

            </>

          )}
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;
