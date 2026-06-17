import React, { useContext, useState, useEffect } from "react";
import { BookingContext } from "../context/BookingContext";
import AdminDashboard from "./AdminDashboard";
import { toast, Toaster } from "react-hot-toast";

function UserProfile() {
  const { user } = useContext(BookingContext);

  // Role-Based Access Control: If the logged-in user is an admin, redirect immediately to the Admin Console
  if (user && user.role === "admin") {
    return <AdminDashboard />;
  }

  const [userBookings, setUserBookings] = useState([]);

  // States to control custom overlay confirmation modals
  const [modalType, setModalType] = useState(null); // Values: 'cancel' | 'reschedule' | null
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Dynamic state inputs for handling date synchronization shifts
  const [newArrival, setNewArrival] = useState("");
  const [newDeparture, setNewDeparture] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /**
   * Side-effect to fetch current personalized bookings for the authenticated user session
   */
  useEffect(() => {
    if (user && user.email) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/user?email=${encodeURIComponent(user.email)}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUserBookings(data.bookings);
        })
        .catch((err) => console.error("User bookings fetch error:", err));
    }
  }, [user]);

  /**
   * Executes explicit DELETE requests to remove a specified record safely from the server architecture
   */
  const handleCancelBooking = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/${selectedBooking._id}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Stay cancellation executed successfully.");

        // Dynamic audit trail sync: Evaluate if payload requires persistence or immediate array omission
        if (selectedBooking.paymentMethod === "online") {
          setUserBookings(
            userBookings.map((b) =>
              b._id === selectedBooking._id ? { ...b, status: "Cancelled" } : b,
            ),
          );
        } else {
          setUserBookings(
            userBookings.filter((b) => b._id !== selectedBooking._id),
          );
        }
        setModalType(null);
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      toast.error("An error occurred during cancellation routing.");
    }
  };

  /**
   * Processes PUT requests to modify inventory date frames via checking conflict logic blocks on the server
   */
  const handleRescheduleBooking = async (e) => {
    e.preventDefault();
    if (!newDeparture) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/${selectedBooking._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId: selectedBooking.roomId,
            arrivalDate: newArrival,
            departureDate: newDeparture,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Dates rescheduled and verified successfully!");
        setUserBookings(
          userBookings.map((b) =>
            b._id === selectedBooking._id
              ? {
                  ...b,
                  dates: `${newArrival} to ${newDeparture}`,
                  nights: data.booking.nights,
                }
              : b,
          ),
        );
        setModalType(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Reschedule error:", err);
      toast.error("Failed to safely alter timeline values.");
    }
  };

  /**
   * Helper function to automatically lock and calculate Checkout Date based on booked nights
   */
  const handleArrivalChange = (arrivalDateValue) => {
    setNewArrival(arrivalDateValue);

    if (!arrivalDateValue || !selectedBooking) {
      setNewDeparture("");
      return;
    }

    // Pure dynamic calculation logic based on locked fixed paid nights
    const arrivalDateObj = new Date(arrivalDateValue);
    const totalNights = selectedBooking.nights || 1;

    // Add the exact nights to arrival date timestamp
    arrivalDateObj.setDate(arrivalDateObj.getDate() + totalNights);

    // Format back into standard string format YYYY-MM-DD
    const calculatedDeparture = arrivalDateObj.toISOString().split("T")[0];
    setNewDeparture(calculatedDeparture);
  };

  /**
   * Utility interceptor to inject selected context arrays directly into rendering blocks
   */
  const openModal = (type, booking) => {
    setSelectedBooking(booking);
    setModalType(type);
    if (type === "reschedule") {
      // Intelligently parse and extract original arrival date from the raw string "YYYY-MM-DD to YYYY-MM-DD"
      let defaultArrival = today;
      if (booking.dates && booking.dates.includes(" to ")) {
        const extractedDate = booking.dates.split(" to ")[0].trim();
        if (extractedDate) defaultArrival = extractedDate;
      }

      setNewArrival(defaultArrival);

      // Calculate corresponding fixed checkout automatically right on initialization
      const arrivalDateObj = new Date(defaultArrival);
      const totalNights = booking.nights || 1;
      arrivalDateObj.setDate(arrivalDateObj.getDate() + totalNights);
      setNewDeparture(arrivalDateObj.toISOString().split("T")[0]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 pt-28">
      {/* Toast provider container block */}
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Dynamic Client Greeting Block */}
        <div className="w-full text-center border-b border-zinc-800 pb-8 mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Welcome Back,{" "}
            <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.name}
            </span>{" "}
            ✨
          </h1>
          <p className="text-zinc-400 text-sm md:text-base font-medium">
            {user?.email} <span className="text-zinc-600 mx-2">|</span> Manage
            your premium luxury stays
          </p>
        </div>

        {/* Section Segment Descriptor */}
        <div className="w-full flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold tracking-wide text-blue-500 uppercase">
            Your Active Bookings ({userBookings.length})
          </h2>
          <div className="h-px flex-1 bg-zinc-800 ml-4 hidden sm:block"></div>
        </div>

        {/* Master User Bookings Table Interface */}
        {userBookings.length === 0 ? (
          <div className="w-full bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="text-4xl">🧳</div>
            <p className="text-zinc-400 font-medium text-base">
              You don't have any premium bookings active yet.
            </p>
            <p className="text-zinc-600 text-sm max-w-xs">
              Explore our royal suites and treat yourself with an unforgettable
              holiday experience!
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-zinc-900/30 border border-zinc-800 rounded-xl shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider text-[11px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6">Room Type</th>
                  <th className="py-4 px-6">Booked Dates</th>
                  <th className="py-4 px-6">Nights</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {userBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-zinc-900/60 transition-all duration-200"
                  >
                    <td className="py-4 px-6 font-semibold text-zinc-100 text-base">
                      {booking.roomTitle}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md text-xs font-mono text-zinc-300">
                        {booking.dates}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 font-medium">
                      {booking.nights}{" "}
                      {booking.nights === 1 ? "Night" : "Nights"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-emerald-400 font-bold text-base">
                        ₹ {booking.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {booking.status === "Refunded" ? (
                        <span className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm animate-fade-in">
                          Refunded
                        </span>
                      ) : booking.status === "Cancelled" ? (
                        <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm animate-fade-in">
                          Refund Pending
                        </span>
                      ) : (
                        <div className="flex items-center gap-3 justify-center">
                          <div className="flex items-center gap-3 justify-center">
                            {/* 1. RESCHEDULE BUTTON: only work on pending */}
                            <button
                              disabled={booking.status !== "Pending"}
                              onClick={() => openModal("reschedule", booking)}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                                booking.status === "Pending"
                                  ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40 pointer-events-none"
                              }`}
                            >
                              Reschedule Dates
                            </button>

                            {/* 2. CANCEL STAY BUTTON: only work on pending */}
                            <button
                              disabled={booking.status !== "Pending"}
                              onClick={() => openModal("cancel", booking)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm ${
                                booking.status === "Pending"
                                  ? "bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                  : "bg-zinc-800 text-zinc-500 border-zinc-700 opacity-40 cursor-not-allowed pointer-events-none"
                              }`}
                            >
                              Cancel Stay
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================
          LIVE CUSTOM MODALS POPUPS         ========================================================= */}

      {/* A. DESTRUCTIVE DELETION MODAL BLOCK */}
      {modalType === "cancel" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-red-500 mb-2">
              Cancel your booking?
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to cancel your stay for{" "}
              <span className="text-white font-medium">
                {selectedBooking?.roomTitle}
              </span>
              ? This process cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-lg cursor-pointer transition"
              >
                Close
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded-lg font-bold cursor-pointer transition"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. DATE ALTERATION RESCHEDULE MODAL BLOCK */}
      {modalType === "reschedule" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-blue-500 mb-2">
              Change Booking Dates
            </h3>
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 mb-4 text-xs">
              <p className="text-zinc-400">
                Current Booking State:{" "}
                <span className="text-amber-400 font-mono font-bold">
                  {selectedBooking?.nights}{" "}
                  {selectedBooking?.nights === 1 ? "Night" : "Nights"}
                </span>
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 italic">
                *Departure date automatically shifts to match pre-paid stay
                value matrix.
              </p>
            </div>

            <form
              onSubmit={handleRescheduleBooking}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  New Arrival Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={newArrival}
                  onChange={(e) => handleArrivalChange(e.target.value)} // DYNAMIC CAPTURE HANDLER WITH AUTOMATIC SYNCHRONIZATION LOCK
                  className="bg-zinc-950 border border-zinc-800 text-sm p-2 rounded-lg text-white outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1 opacity-80">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  New Departure Date (Locked)
                </label>
                <input
                  type="date"
                  value={newDeparture}
                  className="bg-zinc-900 border border-zinc-800 text-sm p-2 rounded-lg text-zinc-400 outline-none cursor-not-allowed font-mono"
                  disabled // CRITICAL LOCK STATE: Prevent injection tampering or manual price desync bugs
                  required
                />
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-lg cursor-pointer transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded-lg font-bold cursor-pointer transition"
                >
                  Update Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
