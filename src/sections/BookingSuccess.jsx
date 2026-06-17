import React, { useEffect, useState, useRef } from "react"; // IMPORTED useRef FOR LOCK MECHANISM
import { useSearchParams, useNavigate } from "react-router-dom";

function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);

  // FRONTEND SHIELD: Keeps track of verification state across rapid re-renders
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError("No session code found. Invalid redirection.");
      setLoading(false);
      return;
    }

    // LOCK TRIGGER: If the effect runs a second time concurrently, intercept and kill the process instantly
    if (hasVerified.current) return;
    hasVerified.current = true;

    // Hit the backend stripe verification API endpoint
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/bookings/stripe-success`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          },
        );

        const data = await response.json();

        if (data.success) {
          setBookingDetails(data.booking);
        } else {
          setError(data.message || "Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setError("Network error while validating checkout session.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const handleClose = () => {
    navigate("/"); // Redirect user smoothly back to core website matrix (Home)
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="w-12 h-12 border-4 border-t-emerald-400 border-zinc-800 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-mono text-zinc-400">
          Verifying Safe Transaction State...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
        <div className="bg-zinc-950 border border-red-500/30 w-full max-w-md p-6 rounded-2xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-3xl font-bold">
            ✕
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Verification Failed
          </h3>
          <p className="text-xs text-zinc-400 mb-6">{error}</p>
          <button
            onClick={handleClose}
            className="w-full bg-zinc-800 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Determine standard execution states based on dynamic payment methods
  const isPaidOnline =
    bookingDetails?.paymentStatus === "Paid" ||
    bookingDetails?.paymentMethod === "online";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
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
          Your luxury stay is successfully reserved and verified via Stripe.
        </p>

        {/* --- DIGITAL RECEIPT VIEWPORT --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left flex flex-col gap-3 font-mono text-xs text-zinc-300">
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">GUEST NAME:</span>
            <span className="text-white font-bold">
              {bookingDetails?.guestName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">ROOM TYPE:</span>
            <span className="text-blue-400 font-bold">
              {bookingDetails?.roomTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">DURATION:</span>
            <span>{bookingDetails?.nights} Nights</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">STAY DATES:</span>
            <span className="text-zinc-400">{bookingDetails?.dates}</span>
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
              Rs. {bookingDetails?.amount}
            </span>
          </div>
        </div>

        {/* System Session Closure Interface Trigger */}
        <button
          onClick={handleClose}
          className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer text-xs uppercase tracking-wider"
        >
          Close Receipt & Return Home
        </button>
      </div>
    </div>
  );
}

export default BookingSuccess;
