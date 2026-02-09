import { useNavigate } from "react-router-dom";

const TransactionSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-slate-50 to-emerald-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-green-200 p-6 text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl ring-4 ring-green-200">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-5 text-2xl font-extrabold text-slate-800">
          Payment Successful 
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Your transaction has been completed successfully.
        </p>

        {/* Receipt Box */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 text-left">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Transaction ID</span>
            <span className="font-bold text-slate-800">TXN-234567</span>
          </div>

       

          <div className="flex justify-between text-sm text-slate-600 mt-2">
            <span>Amount Paid</span>
            <span className="font-bold text-green-600">₹ 499</span>
          </div>

         
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 cursor-pointer py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
          >
            Back to Home
          </button>

          
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 mt-6">
          Thank you for choosing Handy ❤️
        </p>
      </div>
    </div>
  );
};

export default TransactionSuccess;
