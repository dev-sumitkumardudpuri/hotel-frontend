import React, { useContext, useState } from "react";
import { Link } from "react-scroll";
import { BookingContext } from "../context/BookingContext";
import AuthModal from "./AuthModel";

function Navbar() {
  const { user, logoutUser, view, setView } = useContext(BookingContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { name: "Home", target: "home" },
    { name: "About", target: "about" },
    { name: "Rooms", target: "rooms" },
    { name: "Services", target: "services" },
    { name: "Contact", target: "contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 shadow-md bg-mist-300 border-b border-gray-800">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setView("main")}
      >
        <img
          src="/logo_footer-2.png"
          alt="Hotel logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      <div className="flex items-center gap-10">
        {view === "main" && (
          <ul className="hidden md:flex gap-8 font-medium text-black">
            {navItems.map((item) => (
              <li key={item.target}>
                <Link
                  to={item.target}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  activeClass="text-blue-700 font-bold border-b-2 border-blue-700"
                  className="hover:text-blue-700 cursor-pointer transition pb-1 duration-300 block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {(view === "profile" || view === "admin") && (
          <button
            onClick={() => setView("main")}
            className="text-sm font-bold text-blue-700 hover:underline cursor-pointer"
          >
            ← Back to Home
          </button>
        )}

        <div className="flex items-center gap-4">
          {user.isLoggedIn && (
            <span
              /* SMART ROUTING: Admin */
              onClick={() =>
                setView(user.role === "admin" ? "admin" : "profile")
              }
              className="text-black font-semibold text-sm cursor-pointer hover:text-blue-700 hover:underline transition-all"
              title={
                user.role === "admin"
                  ? "Open Admin Control Panel"
                  : "View your bookings"
              }
            >
              Hi, {user.name} {user.role === "admin" ? " (Admin)" : "👤"}
            </span>
          )}

          <button
            onClick={() => {
              if (user.isLoggedIn) {
                logoutUser();
                setView("main");
              } else {
                setIsModalOpen(true);
              }
            }}
            className="bg-transparent font-bold border border-blue-500 text-blue-500 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-300"
          >
            {user.isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
}

export default Navbar;
