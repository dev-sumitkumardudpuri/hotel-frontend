import React from "react";

/**
 * @component About
 * @desc Renders the core brand presentation section featuring premium text compositions, watermarks, and descriptive image components.
 */
function About() {
  return (
    <section
      id="about"
      className="w-full border-b border-blue-500/10 bg-zinc-950 py-24 px-5 md:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* TEXT PRESENTATION WRAPPER WITH TYPOGRAPHIC WATERMARK */}
        <div className="relative w-full md:w-1/2">
          {/* Ambient Aesthetic Backplane Watermark */}
          <h3 className="absolute -top-30 -left-10 text-[100px] md:text-[145px] font-black text-white opacity-[0.2] select-none z-0 tracking-tighter">
            WELCOME
          </h3>

          {/* Core Descriptive Text Interface Layer */}
          <div className="relative z-10">
            <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
              Luxury Living
            </span>

            <h2 className="text-4xl md:text-6xl font-bold text-white uppercase mb-8 leading-tight">
              <span className="text-gray-400">Hotel Zante</span> <br />
            </h2>

            <p className="text-gray-400 text-sm md:text-base leading-loose max-w-lg mb-8 font-light">
              Experience the perfect blend of architectural legacy, tailored
              luxury, and unmatched residential comfort. Hotel Zante offers
              state-of-the-art global facilities engineered precisely to provide
              an elite, unforgettable stay. Every suite encapsulates
              meticulously handpicked interior designs combined with
              high-fidelity automated living systems, ensuring a seamless
              retreat for global professionals and premium vacationers alike.
            </p>

            {/* Navigational Trigger Action Element */}
            <button className="border border-white hover:bg-white hover:text-black text-white px-10 py-4 rounded-sm font-bold uppercase text-[10px] tracking-widest transition-all cursor-pointer">
              Discover More
            </button>
          </div>
        </div>

        {/* BRAND MULTIMEDIA CAPTURE SECTION */}
        <div className="w-full md:w-1/2 flex justify-end">
          <div className="w-full overflow-hidden rounded-sm shadow-2xl border border-gray-800">
            <img
              src="/banner.jpg"
              alt="Hotel Zante Architectural Structural View"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
