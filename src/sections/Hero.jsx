import React from "react";
import { useState, useEffect } from "react";

function Hero() {
  // Images array
  const Images = [
    "/full-slider-1.jpg",
    "/full-slider-2.jpg",
    "/full-slider-3.jpg",
    "/full-slider-4.jpg",
  ];

  const [currentIndex, setcurrentIndex] = useState(0);
  // Autochange image in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setcurrentIndex((prevIndex) =>
        prevIndex === Images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative h-[calc(100vh-80px)] w-full border-b border-blue-500/10 overflow-hidden"
    >
      {/* Background sliding images */}

      {Images.map((img, index) => (
        <img
          src={img}
          alt={`Slide ${index}`}
          key={index}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Black overlay */}

      <div className="absolute inset-0 bg-black/50">
        {/* Content area */}

        <div className="relative z-10 w-full flex items-end justify-start h-full md:p-20 p-10">
          <div className="max-w-3xl animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-wider">
              Spend Your <span className="text-blue-500">Holidays</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl drop-shadow-md max-w-xl mb-10 font-light">
              Experience the ultimate luxury in our star hotels. Book your dream
              room today and make your vocation memorable.
            </p>

            {/* Buttons */}
            <div className="flex gap-5 p-5">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-md font-bold transition-all uppercase text-sm">
                Read More
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-black px-10 py-4 rounded-md font-bold transition-all uppercase text-sm">
                Contac Us
              </button>
            </div>
          </div>
        </div>

        {/* Slide indicators  */}

        <div className="absolute bottom-10 right-10 flex gap-3">
          {Images.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 transition-all duration-500 ${i === currentIndex ? "bg-blue-500" : "bg-white/30"}`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
