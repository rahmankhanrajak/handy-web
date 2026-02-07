import  { useEffect, useState } from "react";
import image1 from "../../assets/chicken-hyderabadi-biryani-01.jpg";
import image2 from "../../assets/chicken.jpg";
import { useNavigate } from "react-router-dom";

const images = [image1, image2];

export default function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black font-sans selection:bg-orange-500/30">
      {/* Dynamic Background */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${i === current ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${i === current ? "scale-110" : "scale-100"
              }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        </div>
      ))}

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10" />

      {/* Texture Overlay (Noise) */}
      <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Main Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">

        {/* Brand Identity */}
        <div className="mb-12 relative">
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text  bg-orange-500 tracking-tighter animate-fade-in-up">
            HANDY
          </h1>
          <div className="absolute -inset-4 blur-3xl bg-orange-500/20 rounded-full opacity-50 animate-pulse-slow -z-10"></div>
          <p className="text-lg md:text-lg font-bold tracking-[0.5em] text-orange-500 uppercase mt-4 animate-fade-in-up delay-100">
            Smart Restaurant 
          </p>
        </div>

        {/* Tagline */}
        <p className="text-white/70 max-w-md text-lg leading-relaxed mb-16 animate-fade-in-up delay-200">
          Experience the future of dining with seamless ordering and lightning-fast service.
        </p>

        {/* Premium CTA Button */}
        <button
          onClick={() => navigate("/login")}
          className="group relative px-12 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden transition-all duration-300 hover:hover:bg-orange-500  hover:scale-105 active:scale-95 animate-fade-in-up delay-300 ring-1 ring-white/20 shadow-2xl hover:shadow-orange-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          <span className="relative cursor-pointer  flex items-center justify-center gap-3 text-white font-bold tracking-wide text-lg">
            Touch to Order
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 w-full text-center z-20 animate-fade-in delay-500">
        <p className="text-white/20 text-xs tracking-wider">
          FAST • RELIABLE • PREMIUM
        </p>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.3s; }
        .delay-300 { animation-delay: 0.5s; }
        .delay-500 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
