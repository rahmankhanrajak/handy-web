import { useNavigate } from "react-router-dom";

const SelectService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 px-4">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-wide">
            <span className="text-orange-500">Handy</span>{" "}
          </h1>
        </div>

        {/* Illustration */}
        <div className="mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="Burger"
            className="w-44 mx-auto drop-shadow-md"
          />
        </div>

        {/* Title */}
        <h2 className="text-gray-700 font-semibold tracking-widest mb-8">
          SELECT SERVICE
        </h2>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-5">
          
          {/* Dine In */}
          <button
            onClick={() => navigate("/dashboard")}
            className="group h-36 cursor-pointer rounded-2xl border-2 border-orange-500
                       flex flex-col items-center justify-center
                       bg-white hover:bg-orange-500
                       transition-all duration-300
                       shadow-sm hover:shadow-lg active:scale-95"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
              alt="Dine In"
              className="w-12 mb-3 group-hover:invert transition"
            />
            <span className="font-semibold text-gray-700 group-hover:text-white">
              Dine In
            </span>
          </button>

          {/* Takeaway */}
          <button
            onClick={() => navigate("/dashboard")}
            className="group h-36 cursor-pointer rounded-2xl border-2 border-orange-500
                       flex flex-col items-center justify-center
                       bg-white hover:bg-orange-500
                       transition-all duration-300
                       shadow-sm hover:shadow-lg active:scale-95"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="Takeaway"
              className="w-12 mb-3 group-hover:invert transition"
            />
            <span className="font-semibold text-gray-700 group-hover:text-white">
              Takeaway
            </span>
          </button>
        </div>

        {/* Footer Hint */}
        <p className="mt-8 text-xs text-gray-400">
          Touch a service to continue
        </p>
      </div>
    </div>
  );
};

export default SelectService;
