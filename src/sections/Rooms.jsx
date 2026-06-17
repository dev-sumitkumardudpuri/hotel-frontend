import React, { useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { Link } from "react-scroll";

function Room() {
  // Extract state management handlers from context layer to dynamically lock selected inventory options
  const { setSelectedRoom } = useContext(BookingContext);

  const roomData = [
    {
      id: 1,
      title: "Standard Cozy Room",
      price: "2499",
      image: "/Gallary/4-1170x680.jpg",
      description:
        "Smart space layout featuring high-speed Wi-Fi, premium bedding, and soundproof architectures.",
    },
    {
      id: 2,
      title: "Deluxe Twin Room",
      price: "3899",
      image: "/Gallary/award5.png",
      description:
        "Generous layout equipped with dual bespoke beds, luxury ambient lighting, and dedicated work stations.",
    },
    {
      id: 3,
      title: "Deluxe King Room",
      price: "4599",
      image: "/Gallary/1-1170x680.jpg",
      description:
        "Expansive layouts hosting custom plush King mattresses, elegant lounging spaces, and walk-in showers.",
    },
    {
      id: 4,
      title: "Superior Balcony Room",
      price: "6299",
      image: "/Gallary/9-1.jpg",
      description:
        "Private glass-railed open balconies offering panoramic city skyline horizons and cozy exterior seating.",
    },
    {
      id: 5,
      title: "Superior Ocean View",
      price: "8499",
      image: "/Gallary/award4.png",
      description:
        "Wall-to-wall glass installations facing direct marine shore vistas, complete with luxury mini-bars.",
    },
    {
      id: 6,
      title: "Executive Business Suite",
      price: "12999",
      image: "/Gallary/award6.png",
      description:
        "Corporate spatial luxury including integrated conference setups, smart hubs, and express lounge passes.",
    },
    {
      id: 7,
      title: "Grand Honeymoon Suite",
      price: "18499",
      image: "/Gallary/6.jpg",
      description:
        "Romantic luxury modules presenting private jacuzzis, artisan decor layouts, and bespoke butler services.",
    },
    {
      id: 8,
      title: "Royal Presidential Suite",
      price: "28999",
      image: "/Gallary/family-1170x680.jpg",
      description:
        "The peak of luxury hosting private dining spaces, master vaults, and premium state-of-the-art tech.",
    },
  ];

  return (
    <section
      id="rooms"
      className="bg-zinc-900 min-h-screen border-b border-blue-500/10 text-white py-16 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background Graphic Watermark Elements */}
      <div className="relative mb-12">
        <h2 className="absolute -top-10 left-10 text-7xl md:text-9xl font-bold text-white opacity-[0.2] tracking-tighter pointer-events-none select-none">
          EXPLORE
        </h2>
        <div className="relative z-10 left-10">
          <br />
          <h3 className="text-5xl font-semibold mb-4">Our Rooms</h3>
          <p className="text-zinc-400 max-w-2xl">
            Immerse yourself in our collection of meticulously curated spaces.
            From functional smart layouts to sprawling premium suites, discover
            architectural sanctuaries built around comfort, elegance, and
            dynamic luxury.
          </p>
        </div>
      </div>

      {/* Grid Interface For Interactive Room Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
        {roomData.map((room) => (
          <div
            key={room.id}
            className="bg-zinc-950/40 border border-blue-500/30 rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/20 group"
          >
            {/* Aspect Ratio Cropped Image Section */}
            <div className="h-56 overflow-hidden">
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Typography Content Meta Blocks */}
            <div className="p-5">
              <h4 className="text-xl font-bold mb-2">{room.title}</h4>
              <p className="text-zinc-400 text-sm mb-6 min-h-10">
                {room.description}
              </p>

              {/* Price Indicators & Navigation Button Targets */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    Rs.{room.price}
                  </span>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Per Night
                  </p>
                </div>

                {/* Smooth Scroll Event Wrapper to Mount Payload to Context Layers */}
                <Link to="booking" smooth={true} duration={500} offset={-100}>
                  <button
                    onClick={() => {
                      // Dispatches data packet onto state contexts to dynamically load targeted reservation details
                      setSelectedRoom({
                        id: room.id,
                        title: room.title,
                        price: room.price,
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.8)] text-white px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Room;
