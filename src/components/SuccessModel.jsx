import React, { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

function SuccessModal() {
  // Extract transaction states and clear handlers from the shared global context provider
  const { bookingDetails, setBookingDetails, setSelectedRoom } =
    useContext(BookingContext);

  // Short-circuit render loop if no active booking payload or receipt data exists in the context state
  if (!bookingDetails) return null;

  /**
   * Resets application views by wiping current receipt references and room tokens synchronously
   */
  const handleClose = () => {
    setBookingDetails(null); // Purges runtime receipt data from memory cache to dismiss the overlay modal interface
    setSelectedRoom(null); // Resets interactive room configuration states across the parental selection matrices
  };

  // Determine standard execution states based on dynamic payment methods
  const isPaidOnline =
    bookingDetails.paymentStatus === "Paid" ||
    bookingDetails.paymentMethod === "stripe";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Main Popup Content Card */}
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-6 rounded-2xl shadow-2xl text-center relative animate-fadeIn">
        {/* Success Feedback Vector Icon Container */}
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 text-3xl font-bold">
          ✓
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Booking Confirmed!
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Your luxury stay is successfully reserved.
        </p>

        {/* --- DIGITAL RECEIPT VIEWPORT --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left flex flex-col gap-3 font-mono text-xs text-zinc-300">
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">GUEST NAME:</span>
            <span className="text-white font-bold">
              {bookingDetails.guestName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">ROOM TYPE:</span>
            <span className="text-blue-400 font-bold">
              {bookingDetails.roomTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">DURATION:</span>
            <span>{bookingDetails.nights} Nights</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">STAY DATES:</span>
            <span className="text-zinc-400">{bookingDetails.dates}</span>
          </div>

          {/* DYNAMIC INJECTION: HYBRID PAYMENT METHOD LABEL OVERVIEW */}
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">PAYMENT METHOD:</span>
            <span
              className={`font-bold ${isPaidOnline ? "text-blue-400" : "text-amber-400"}`}
            >
              {isPaidOnline ? "ONLINE STRIPE" : "HOTEL DESK"}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 text-sm">
            <span className="text-zinc-400 font-sans font-semibold">
              {isPaidOnline ? "TOTAL PAID:" : "AMOUNT DUE AT HOTEL:"}
            </span>
            <span
              className={`${isPaidOnline ? "text-emerald-400" : "text-amber-400"} font-bold text-base`}
            >
              Rs. {bookingDetails.amount}
            </span>
          </div>
        </div>

        {/* System Session Closure Interface Trigger */}
        <button
          onClick={handleClose}
          className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer text-xs uppercase tracking-wider"
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
