import React from "react";
import { useNavigate } from "react-router-dom";

const SelectService = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      
      {/* Logo */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-red-600">
          BURGER <span className="text-orange-500">KING</span>
        </h1>
      </div>

      {/* Food Illustration (placeholder image) */}
      <div className="mb-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
          alt="Burger Meal"
          className="w-48 mx-auto"
        />
      </div>

      {/* Title */}
      <h2 className="text-gray-700 font-semibold tracking-wide mb-6">
        SELECT SERVICE
      </h2>

      {/* Service Buttons */}
      <div className="flex gap-6">
        
        {/* Dine In */}
        <button onClick={()=>navigate("/products")}
          className="w-40 h-32 border-2 border-red-500 rounded-xl
                     flex flex-col items-center justify-center
                     hover:bg-red-50 transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
            alt="Dine In"
            className="w-12 mb-2"
          />
          <span className="font-semibold text-gray-700">Dine In</span>
        </button>

        {/* Takeaway */}
        <button onClick={()=>navigate("/products")}
          className="w-40 h-32 border-2 border-orange-500 rounded-xl
                     flex flex-col items-center justify-center
                     hover:bg-orange-50 transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="Takeaway"
            className="w-12 mb-2"
          />
          <span className="font-semibold text-gray-700">Takeaway</span>
        </button>

      </div>
    </div>
  );
};

export default SelectService;
