import React, { useEffect, useState } from "react";
import image1 from "../../assets/chicken-hyderabadi-biryani-01.jpg"
import image2 from "../../assets/chicken.jpg"
import { useNavigate } from "react-router-dom";

const images = [
  image1, image2
];

export default function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
            }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black/30" /> */}

      {/* Button */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <button onClick={() => navigate("/login")} className="px-8 py-4 text-lg font-semibold rounded-full bg-orange-500 text-white active:scale-95 transition">
          Touch to Order
        </button>
      </div>
    </div>
  );
}
