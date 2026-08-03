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

            {/* Social Icons Container */}
            <div className="flex items-center gap-4 mt-3 text-gray-400">
              {/* Facebook */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#088178] dark:hover:text-[#0bd1c3] transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#088178] dark:hover:text-[#0bd1c3] transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#088178] dark:hover:text-[#0bd1c3] transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg
                  className="w-5.5 h-5.5 stroke-current fill-none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#088178] dark:hover:text-[#0bd1c3] transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
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
      <div className="pt-6 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left Side: Copyright Text */}
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} Hotel{" "}
          <span className="text-[#088178] dark:text-[#0bd1c3]">Zante.</span> All
          rights reserved globally.
        </p>

        {/* <p className="text-xm text-gray-400">
          Available on{" "}
          <a
            href="https://www.codester.com/items/66735/mern-stack-hotel-booking-and-reservation-system?ref=wad10"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#088178] dark:text-[#0bd1c3] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Codester
          </a>
        </p> */}
      </div>
    </footer>
  );
}

export default Footer;
