import React, { useContext, useState, useEffect } from "react";
import { BookingContext } from "../context/BookingContext";
import Room from "./Rooms";
import { toast, Toaster } from "react-hot-toast";

function Booking() {
  const { selectedRoom, user, setBookingDetails } = useContext(BookingContext);
  const today = new Date().toISOString().split("T")[0];

  const [arrivalDate, setArrivalDate] = useState(today);
  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [bookedDatesList, setBookedDatesList] = useState([]);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);

  // Payment states for modal and processing spinner loaders
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // EFFECT 1: Fetch booked dates when selectedRoom changes
  useEffect(() => {
    if (!selectedRoom || !selectedRoom.id) {
      setBookedDatesList([]);
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/bookings/booked-dates?roomId=${selectedRoom.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookedDatesList(data.bookedDates);
        }
      })
      .catch((err) => console.error("Booked dates lane me error:", err));
  }, [selectedRoom]);

  // EFFECT 2: Overlap calculation
  useEffect(() => {
    if (!arrivalDate || !departureDate || bookedDatesList.length === 0) {
      setIsAlreadyBooked(false);
      return;
    }

    let start = new Date(arrivalDate);
    let end = new Date(departureDate);
    let hasConflict = false;

    let currentCheck = new Date(start);
    while (currentCheck <= end) {
      const formattedDate = currentCheck.toISOString().split("T")[0];
      if (bookedDatesList.includes(formattedDate)) {
        hasConflict = true;
        break;
      }
      currentCheck.setDate(currentCheck.getDate() + 1);
    }

    setIsAlreadyBooked(hasConflict);
  }, [arrivalDate, departureDate, bookedDatesList]);

  const calculateNights = () => {
    if (!arrivalDate || !departureDate) return 0;
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);
    const timeDiff = end - start;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const totalNights = calculateNights();

  const totalPrice = selectedRoom
    ? totalNights > 0
      ? totalNights * parseInt(selectedRoom.price)
      : parseInt(selectedRoom.price)
    : 0;

  // Intercept standard submission to validate constraints before launching gateway
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!user.isLoggedIn) {
      toast.error("Authentication required: Please login first.");
      return;
    }

    if (!selectedRoom) {
      toast.error(
        "Configuration missing: Please scroll down and select a room option first.",
      );
      return;
    }

    if (!departureDate) {
      toast.error("Schedule conflict: Please select a valid Departure Date.");
      return;
    }

    if (isAlreadyBooked) {
      toast.error(
        "Schedule Unavailable: Selected timeline conflicts with an active reservation. Please choose alternative dates.",
      );
      return;
    }

    // Open payment gateway confirmation modal
    setShowPaymentModal(true);
  };

  // Option A: Pay at Hotel (Save direct offline entry to DB)
  const handlePayAtHotel = async () => {
    setIsProcessing(true);
    const bookingData = {
      roomId: Number(selectedRoom.id),
      guestName: user.name,
      roomTitle: selectedRoom.title,
      nights: totalNights > 0 ? totalNights : 1,
      dates: `${arrivalDate} to ${departureDate}`,
      amount: totalPrice,
      paymentMethod: "hotel",
      paymentStatus: "Unpaid",
    };

    setBookingDetails(bookingData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        },
      );
      const resData = await response.json();
      if (resData.success) {
        setBookedDatesList([
          ...bookedDatesList,
          ...dataDatesRange(arrivalDate, departureDate),
        ]);
        setShowPaymentModal(false);
        setDepartureDate("");
      }
    } catch (err) {
      console.log("Database me save hone me issue:", err);
      alert("Something went wrong while processing your offline reservation.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Option B: Pay Online (Stripe Session Checkout)
  const handlePayOnline = async () => {
    setIsProcessing(true);
    const stripePayload = {
      roomId: Number(selectedRoom.id),
      guestName: user.name,
      roomTitle: selectedRoom.title,
      nights: totalNights > 0 ? totalNights : 1,
      dates: `${arrivalDate} to ${departureDate}`,
      amount: totalPrice,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/stripe-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stripePayload),
        },
      );
      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url; // Dynamic redirect to Stripe live portal
      } else {
        alert(data.message || "Failed to initiate Stripe session.");
      }
    } catch (err) {
      console.error("Stripe network link failure:", err);
      alert("Stripe server connection issue. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const dataDatesRange = (s, e) => {
    let arr = [];
    let start = new Date(s);
    let end = new Date(e);
    while (start <= end) {
      arr.push(start.toISOString().split("T")[0]);
      start.setDate(start.getDate() + 1);
    }
    return arr;
  };

  // Helper function to show date range in error line
  const getBookedRangeString = () => {
    if (bookedDatesList.length === 0) return "";
    const sorted = [...bookedDatesList].sort();
    return `${sorted[0]} to ${sorted[sorted.length - 1]}`;
  };

  return (
    <section
      id="booking"
      className="w-full border-b border-blue-500/10 bg-gray-900 py-10 px-4 md:px-10"
    >
      <div
        className="w-full min-h-64 rounded-2xl bg-cover bg-top bg-no-repeat relative overflow-hidden flex items-center justify-center p-4 md:p-8 shadow-2xl"
        style={{ backgroundImage: `url(/letter.jpg)` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-black/40 pointer-events-none z-0"></div>

        <div className="w-full max-w-6xl bg-[#1a1a1a]/95 backdrop-blur-xs p-5 md:p-6 rounded-xl shadow-2xl border border-gray-800 z-10 mx-auto">
          {/* RED LINE WITH DATES RANGE */}
          {isAlreadyBooked && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold animate-pulse">
              ⚠️ This room is already booked between{" "}
              <span className="text-white underline">
                {getBookedRangeString()}
              </span>
              . Please select other dates.
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] ml-2">
              <span className="text-blue-500">Book </span>Your Room
            </h2>

            {selectedRoom && !isAlreadyBooked && (
              <div className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold px-3 py-1 rounded-md flex gap-2">
                <span>
                  Selected:{" "}
                  <span className="text-white">{selectedRoom.title}</span>
                </span>
                <span>|</span>
                {totalNights > 0 ? (
                  <span className="text-emerald-400">
                    Total ({totalNights} Nights): Rs. {totalPrice}
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    Rs. {selectedRoom.price}/Night
                  </span>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={handleBookingSubmit}
            className="flex flex-col md:flex-row gap-3 items-end"
          >
            <div className="w-full flex-[1.5] flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 uppercase ml-1">
                Arrival Date
              </label>
              <input
                type="date"
                min={today}
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="bg-[#222] text-white text-sm p-3 rounded border border-gray-700 outline-none focus:border-blue-500 w-full h-11"
              />
            </div>

            <div className="w-full flex-[1.5] flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 uppercase ml-1">
                Departure Date
              </label>
              <input
                type="date"
                min={arrivalDate}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="bg-[#222] text-white text-sm p-3 rounded border border-gray-700 outline-none focus:border-blue-500 w-full h-11"
              />
            </div>

            <div className="w-full md:w-24 flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 uppercase ml-1 text-center">
                Adults
              </label>
              <input
                type="number"
                min="1"
                value={adults}
                onChange={(e) =>
                  setAdults(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="bg-[#222] text-white text-sm p-3 rounded border border-gray-700 outline-none focus:border-blue-500 w-full h-11 text-center"
              />
            </div>

            <div className="w-full md:w-24 flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 uppercase ml-1 text-center">
                Childrens
              </label>
              <input
                type="number"
                min="0"
                value={children}
                onChange={(e) =>
                  setChildren(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="bg-[#222] text-white text-sm p-3 rounded border border-gray-700 outline-none focus:border-blue-500 w-full h-11 text-center"
              />
            </div>

            {/* DYNAMIC BUTTON WITH LIVE PRICE RETURNED */}
            <div className="w-full md:flex-1">
              <button
                type="submit"
                disabled={isAlreadyBooked}
                className={`h-11 px-6 rounded font-bold uppercase text-[10px] tracking-widest transition-all w-full whitespace-nowrap cursor-pointer 
                  ${
                    isAlreadyBooked
                      ? "bg-red-600 text-white cursor-not-allowed opacity-80"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  }`}
              >
                {isAlreadyBooked
                  ? "Dates Unavailable"
                  : !user.isLoggedIn
                    ? "Login to Book"
                    : selectedRoom
                      ? `Pay Rs. ${totalPrice}`
                      : "Select a Room"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL DESIGN OVERLAY FOR PAYMENT METHOD CHANNELS */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#141414] border border-zinc-800 w-full max-w-md p-6 rounded-xl shadow-2xl text-center relative">
            <button
              onClick={() => !isProcessing && setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer text-sm"
              disabled={isProcessing}
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Select Payment Method
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Choose how you want to complete your premium reservation.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePayOnline}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {isProcessing
                  ? "Processing Stripe..."
                  : "Pay Securely Online Now"}
              </button>

              <button
                onClick={handlePayAtHotel}
                disabled={isProcessing}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 rounded-lg transition-all text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? "Saving Record..." : "Pay Later At Hotel Desk"}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800/60 flex justify-between items-center text-[11px] font-mono text-zinc-500">
              <span>TOTAL ORDER VALUATION:</span>
              <span className="text-emerald-400 font-bold text-sm">
                Rs. {totalPrice}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Booking;
