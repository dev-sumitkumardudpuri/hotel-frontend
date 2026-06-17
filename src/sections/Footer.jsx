import React from "react";
import { Link } from "react-scroll";

/**
 * @component Footer
 * @desc Renders the global application footer containing corporate metadata, quick navigation matrices, and localized branding certifications.
 */
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-blue-500/10 py-12 px-6 md:px-16 lg:px-24 font-sans w-full">
      {/* COMPREHENSIVE DATA LAYOUT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
        {/* COLUMN 1: CORPORATE IDENTIFIER & CHANNELS */}
        <div className="flex flex-col gap-4">
          <div className="w-44">
            <img
              className="w-full h-auto object-contain"
              src="/logo_footer-2.png"
              alt="Hotel Zante Luxury Branding Identifier"
            />
          </div>

          <h4 className="text-white text-lg font-semibold mt-2">Contact</h4>
          <div className="text-sm space-y-2 text-gray-400">
            <p>
              <strong className="text-gray-200">Address: </strong>S45 Tokyo
              Road, Street 99, New Delhi
            </p>
            <p>
              <strong className="text-gray-200">Phone: </strong> +01 555 2222 /
              (+91) 9876543210
            </p>
            <p>
              <strong className="text-gray-200">Hours: </strong>24/7 Operations
              Support, Mon - Sat
            </p>
          </div>

          <div className="mt-2">
            <h4 className="text-white text-md font-semibold">Follow Us</h4>
            <p className="text-xs text-gray-500 italic mt-1">
              Social platforms integration coming soon
            </p>
          </div>
        </div>

        {/* COLUMN 2: OPERATIONS AND POLICIES */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4 border-b border-gray-800 pb-2">
            About
          </h4>
          <ul className="space-y-2 text-sm flex flex-col">
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                About Us
              </button>
            </li>
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                Company History
              </button>
            </li>
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                Privacy Policy
              </button>
            </li>
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                Terms & Conditions
              </button>
            </li>
            <li>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block cursor-pointer"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: ACCOUNT & INVENTORY LEDGERS */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4 border-b border-gray-800 pb-2">
            My Account
          </h4>
          <ul className="space-y-2 text-sm flex flex-col">
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                Sign In
              </button>
            </li>
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                My Wallet
              </button>
            </li>
            <li>
              <Link
                to="rooms"
                smooth={true}
                duration={500}
                offset={-80}
                className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block cursor-pointer"
              >
                View Rooms
              </Link>
            </li>
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                My Booking
              </button>
            </li>
            <li>
              <button className="hover:text-blue-500 hover:pl-1 transition-all duration-300 inline-block bg-transparent border-none text-left cursor-pointer">
                Help Desk
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: CERTIFICATIONS & INDUSTRY ACCREDITATIONS */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4 border-b border-gray-800 pb-2">
            Our Awards
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            Recognized globally for elite hospitality and service architecture.
          </p>

          {/* Upscaled Asset Badges Grid Block (Dimension profile mapped to 92px x 100px scaling framework) */}
          <div className="flex flex-wrap gap-4 items-center">
            <img
              className="w-23 h-25 object-contain bg-gray-800 p-2 rounded transform hover:scale-105 transition-transform"
              src="/Rewards/award3.png"
              alt="Global Hospitality Accreditation Medal"
            />
            <img
              className="w-23 h-25 object-contain bg-gray-800 p-2 rounded transform hover:scale-105 transition-transform"
              src="/Rewards/award2.png"
              alt="Elite Service Framework Excellence Award"
            />
            <img
              className="w-23 h-25 object-contain bg-gray-800 p-2 rounded transform hover:scale-105 transition-transform"
              src="/Rewards/award1-1.png"
              alt="Customer Choice Luxury Stay Certification"
            />
          </div>
        </div>
      </div>

      {/* COPYRIGHT COMPLIANCE INTERFACE */}
      <div className="pt-6 flex justify-center items-center">
        <div className="text-sm text-gray-500 text-center">
          <p>
            &copy; {new Date().getFullYear()} Hotel Zante. All rights reserved
            globally.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
