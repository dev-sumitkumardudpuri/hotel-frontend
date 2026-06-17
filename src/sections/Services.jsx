import React from "react";

// Static dataset representing luxury hotel amenities and services
const serviceData = [
  {
    id: 1,
    img: "/Icons/icons8-tableware-100.png",
    title: "Delicious Food",
  },
  {
    id: 2,
    img: "/Icons/icons8-bathrobe-100.png",
    title: "Beauty Spa",
  },
  {
    id: 3,
    img: "/Icons/icons8-meeting-room-100.png",
    title: "Meeting Room",
  },
  {
    id: 4,
    img: "/Icons/icons8-lap-pool-100.png",
    title: "Swimming Pool",
  },
];

/**
 * @component Services
 * @desc Renders the hospitality and premium luxury services portfolio section.
 */
function Services() {
  return (
    <section
      id="services"
      className="bg-zinc-950 min-h-screen border-b border-blue-500/10 text-white py-20 px-6 md:px-20 flex flex-col justify-center"
    >
      {/* SECTION HEADER BLOCK WITH BACKGROUND WATERMARK ELEMENT */}
      <div className="relative mb-16">
        <h1 className="absolute -top-10 left-0 text-7xl md:text-9xl font-bold text-white opacity-[0.2] uppercase pointer-events-none select-none">
          SERVICES
        </h1>
        <div className="relative z-10">
          <br />
          <h3 className="text-5xl font-semibold mb-8">Our Services</h3>
          <p className="text-zinc-400 max-w-2xl">
            Experience world-class hospitality with curated premium amenities
            designed to offer ultimate comfort, seamless corporate execution,
            and deep relaxation.
          </p>
        </div>
      </div>

      {/* INTERACTIVE CONTENT DISPLAY PIPELINE */}
      <div className="flex flex-col lg:flex-row gap-50 items-center">
        {/* GRID INTERFACE FOR AMENITIES LISTING */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 max-w-[100]">
          {serviceData.map((item) => (
            <div
              key={item.id}
              className="group aspect-square flex flex-col items-center justify-center p-4 bg-zinc-900 border-blue-500/30 transition-all duration-300 hover:bg-[#088178] cursor-pointer"
            >
              {/* Asset Graphic Container Element */}
              <div className="w-25 h-25 mb-1 flex">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-contain transition-all group-hover:brightness-0 group-hover:invert"
                />
              </div>

              {/* Text Description Block */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white group-hover:text-black transition-colors tracking-tighter">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* VISUAL SHOWCASE GRAPHIC LAYOUT */}
        <div className="w-full lg:flex-1 h-full flex items-center justify-end">
          <div className="w-full lg:w-200 md:h-150 overflow-hidden rounded-lg shadow-2xl relative lg:-ml-20">
            <img
              src="/conference.jpg"
              alt="Premium conference and corporate event meeting space execution"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
