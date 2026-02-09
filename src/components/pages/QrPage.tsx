import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrcode from "../../assets/QR1.jpg"
const QrPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/transaction"); // your success route
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-orange-100 p-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-slate-800">
            Scan to Pay / Order
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Redirecting to success page...
          </p>
        </div>

        {/* QR Box */}
        <div className="flex justify-center mt-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className="w-[220px] h-[220px] bg-slate-100 rounded-xl flex items-center justify-center">
              {/* <p className="text-slate-500 font-semibold">QR CODE</p>
               */}
               <img src={qrcode}  className="h-full w-full"/>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          

          <div className="mt-3 flex justify-center gap-6 text-sm text-slate-600">
            
            <span>
              Order: <b className="text-slate-800">#12345</b>
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 animate-pulse w-full"></div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">
            Please wait...
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Powered by Food Handy ⚡
        </p>
      </div>
    </div>
  );
};

export default QrPage;
