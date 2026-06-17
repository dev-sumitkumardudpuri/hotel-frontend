import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeGuests: 0,
    availableRooms: 8,
  });

  // Navigation state management to swap viewports fluidly between tables
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "inquiries"

  // Dedicated data pipeline container tracking remote user contact queries
  const [inquiries, setInquiries] = useState([]);

  // State to manage the custom professional confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // STATE: Stores the precise active booking ID instead of a generic boolean to localize indicators
  const [isRefunding, setIsRefunding] = useState(null);

  // STATE: Stores the precise active inquiry object instead of a generic boolean to localize indicators
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // STATE: Tracks the specific inquiry targeted for permanent purging to drive the custom confirmation modal
  const [inquiryToDelete, setInquiryToDelete] = useState(null);

  // States for offline booking creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roomBookedDates, setRoomBookedDates] = useState([]); // NEW STATE FOR LIVE BLOCKED DATES TRACKING
  const [newBooking, setNewBooking] = useState({
    guestName: "",
    roomTitle: "",
    roomId: "",
    arrivalDate: "",
    departureDate: "",
    nights: 0,
    amount: 0,
    status: "Checked In", // Standard fallback default for manager-initiated offline bookings
  });

  // Static premium system inventory allocation for automated mapping routines with added Base Prices
  const hotelRooms = [
    { id: 1, title: "Standard Cozy Room", price: 2499 },
    { id: 2, title: "Deluxe Twin Room", price: 3899 },
    { id: 3, title: "Deluxe King Room", price: 4599 },
    { id: 4, title: "Superior Balcony Room", price: 6299 },
    { id: 5, title: "Superior Ocean View", price: 8499 },
    { id: 6, title: "Executive Business Suite", price: 12999 },
    { id: 7, title: "Grand Honeymoon Suite", price: 18499 },
    { id: 8, title: "Royal Presidential Suite", price: 28999 },
  ];

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchAdminData();
    fetchInquiries();
  }, []);

  // Helper logic to auto-calculate nights and cost inside useEffect whenever dates or room changes
  useEffect(() => {
    if (newBooking.arrivalDate && newBooking.departureDate) {
      const checkIn = new Date(newBooking.arrivalDate);
      const checkOut = new Date(newBooking.departureDate);

      // Calculate variance in days
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (calculatedNights > 0) {
        // Find current room price
        const targetRoom = hotelRooms.find(
          (r) => r.id === Number(newBooking.roomId),
        );
        const roomPricePerNight = targetRoom ? targetRoom.price : 0;
        const totalCalculatedAmount = calculatedNights * roomPricePerNight;

        setNewBooking((prev) => ({
          ...prev,
          nights: calculatedNights,
          amount: totalCalculatedAmount,
        }));
      } else {
        // Safe reset if checkout is set before checkin mistakenly
        setNewBooking((prev) => ({
          ...prev,
          nights: 0,
          amount: 0,
        }));
      }
    }
  }, [newBooking.arrivalDate, newBooking.departureDate, newBooking.roomId]);

  /**
   * Fetches real-time analytics data and comprehensive booking lists from the server
   * Updated: Injected JWT authorization bearer header token securely.
   */
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");

      const statsRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      const bookingsRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/bookings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) setBookings(bookingsData.bookings);
    } catch (err) {
      console.error("Admin data synchronization exception:", err);
      toast.error(
        "Failed to synchronize records with the centralized database.",
      );
    }
  };

  // ==========================================================
  // CONTACT MANAGEMENT FUNCTIONS
  // ==========================================================

  /**
   * Fetches asynchronously archived client queries from backend endpoints to synchronize structural views
   */
  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setInquiries(data.inquiries || data.data || []);
      }
    } catch (err) {
      console.error(
        "Inquiries asynchronous collection failure exception:",
        err,
      );
    }
  };

  /**
   * Modifies communication records read tracking metadata configurations instantly across structural elements
   */
  const handleToggleReadStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const targetNextStatus = currentStatus === "read" ? "unread" : "read";

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: targetNextStatus }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Inquiry status updated successfully.");
        fetchInquiries();
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(
        "Read toggle lifecycle status interaction mutation fault:",
        err,
      );
      toast.error("Network error while altering status criteria.");
    }
  };

  /**
   * Initializes structural overlay components by tracking target inquiry instances and enforcing unread-to-read mutations
   */
  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);

    if (inquiry.status === "unread") {
      handleToggleReadStatus(inquiry._id, "unread");
    }
  };

  /**
   * Executes structural purging criteria targeting individual customer query records permanently
   */
  const handleDeleteInquiry = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Inquiry successfully deleted.");
        fetchInquiries();
      } else {
        toast.error(
          data.message || "Backend schemas dropped the delete routine.",
        );
      }
    } catch (err) {
      console.error(
        "Critical error encountered during data purge lifecycle:",
        err,
      );
      toast.error("Internal failure executing inquiry data cleanup.");
    }
  };

  /**
   * Dispatches direct automated Stripe gateway actions to the backend controller layer
   * Updated: Added Authorization Headers for system safety checkpoints.
   */
  const handleIssueStripeRefund = async (id) => {
    if (isRefunding) return;
    setIsRefunding(id); // LOCK INDIVIDUAL BUTTON SYSTEM: Set state to current row's ID

    const loadingToast = toast.loading(
      "Processing automated Stripe financial reversal...",
    );

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/bookings/${id}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Protect entry pipeline
          },
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success(
          "Stripe balance reversed successfully! Record state updated.",
          {
            id: loadingToast,
          },
        );
        fetchAdminData();
      } else {
        toast.error(
          data.message ||
            "The connected Stripe payment gateway rejected the refund execution pipeline.",
          { id: loadingToast },
        );
      }
    } catch (err) {
      console.error("Stripe automated pipeline exception:", err);
      toast.error(
        "Network communication failure detected with the Stripe API endpoint.",
        {
          id: loadingToast,
        },
      );
    } finally {
      setIsRefunding(null); // RESET SAFELY ON FINISH
    }
  };

  /**
   * Dispatches updates regarding the booking lifecycle
   * Updated: Added Authorization headers block to verify privileged manager status.
   */
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enforce secure verification
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking state successfully modified to: ${newStatus}`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Booking workflow state mutation error:", err);
      toast.error(
        "Failed to commit operational status updates to server architecture.",
      );
    }
  };

  const openDeleteConfirmation = (id) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  /**
   * Triggers continuous structural state purging securely from backends
   * Updated: Appended token headers validation checks.
   */
  const handleConfirmDelete = async () => {
    if (!selectedBookingId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/bookings/${selectedBookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authenticate critical destructive requests
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Booking data registry safely delete from database indexes.",
        );
        fetchAdminData();
      }
    } catch (err) {
      console.error("Database hard deletion fault:", err);
      toast.error("Critical error encountered during dataset purge pipelines.");
    } finally {
      setIsModalOpen(false);
      setSelectedBookingId(null);
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSelectChange = async (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setNewBooking((prev) => ({ ...prev, roomId: "", roomTitle: "" }));
      setRoomBookedDates([]); // Clear dates if no room is selected
      return;
    }
    const targetRoom = hotelRooms.find((r) => r.id === Number(selectedId));
    if (targetRoom) {
      setNewBooking((prev) => ({
        ...prev,
        roomId: targetRoom.id,
        roomTitle: targetRoom.title,
      }));

      // FETCH EXISTING LIVE BOOKED DATES DIRECTLY ON ROOM SELECTION
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/bookings/booked-dates?roomId=${selectedId}`,
        );
        const data = await res.json();
        if (data.success) {
          setRoomBookedDates(data.bookedDates);
        } else {
          setRoomBookedDates([]);
        }
      } catch (err) {
        console.error("Error fetching room booked dates matrix:", err);
        setRoomBookedDates([]);
      }
    }
  };

  /**
   * Persists direct manual client records cleanly to system endpoints
   * Updated: Passed admin credentials token to safely execute offline creation tasks.
   */
  const handleCreateBookingSubmit = async (e) => {
    e.preventDefault();

    const formattedDates = `${newBooking.arrivalDate} to ${newBooking.departureDate}`;
    const payload = {
      guestName: newBooking.guestName,
      roomTitle: newBooking.roomTitle,
      roomId: Number(newBooking.roomId),
      dates: formattedDates,
      nights: Number(newBooking.nights),
      amount: Number(newBooking.amount),
      status: newBooking.status,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/bookings/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Validate offline entity creation permission
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success(
          "Offline transaction logged and synchronized successfully.",
        );
        setIsCreateModalOpen(false);
        setRoomBookedDates([]); // Reset dates tracker matrix
        setNewBooking({
          guestName: "",
          roomTitle: "",
          roomId: "",
          arrivalDate: "",
          departureDate: "",
          nights: 0,
          amount: 0,
          status: "Checked In",
        });
        fetchAdminData();
      } else {
        toast.error(
          data.message || "Form validation rejected by remote instance.",
        );
      }
    } catch (err) {
      console.error("Offline entity pipeline injection error:", err);
      toast.error("Connection drops detected during record submission loops.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 pt-28">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Dashboard Control Panel Header */}
        <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Admin <span className="text-blue-500">Live Console</span> ⚙️
            </h1>
            <p className="text-zinc-400 text-sm">
              Real-time status tracking for all premium rooms.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Switching Tab Controls */}
            <button
              onClick={() => setActiveTab("bookings")}
              className={`font-bold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-zinc-800 text-white border border-zinc-700 shadow-inner"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Bookings Registry
            </button>
            <button
              onClick={() => {
                setActiveTab("inquiries");
                fetchInquiries(); // Auto update data array elements when opening workspace
              }}
              className={`font-bold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer relative ${
                activeTab === "inquiries"
                  ? "bg-zinc-800 text-white border border-zinc-700 shadow-inner"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              View Inquiries / Messages
              {inquiries.filter((i) => i.status !== "read").length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              )}
            </button>

            <span className="w-px h-6 bg-zinc-800 mx-1 hidden sm:inline-block"></span>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/10 cursor-pointer"
            >
              + Add Offline Booking
            </button>
          </div>
        </div>

        {/* Real-time Analytics Dashboard Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-zinc-500 text-xs font-bold uppercase">
              Total Bookings
            </p>
            <p className="text-2xl font-black text-blue-400 mt-1">
              {stats.totalBookings}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-zinc-500 text-xs font-bold uppercase">
              Total Earnings
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-zinc-500 text-xs font-bold uppercase">
              Live Checked In
            </p>
            <p className="text-2xl font-black text-indigo-400 mt-1">
              {stats.activeGuests} Guests
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-zinc-500 text-xs font-bold uppercase">
              Available Rooms
            </p>
            <p className="text-2xl font-black text-cyan-400 mt-1">
              {stats.availableRooms} / 8
            </p>
          </div>
        </div>

        {/* Dynamic Display Router Layer depending on Active Tab Selection */}
        {activeTab === "bookings" ? (
          /* Master Management Table Structure */
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[11px] font-bold border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">Guest Name</th>
                    <th className="py-4 px-6">Room Title (ID)</th>
                    <th className="py-4 px-6">Dates Blocked</th>
                    <th className="py-4 px-6">Payment</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Current Status</th>
                    <th className="py-4 px-6 text-center">Lifecycle Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-4 px-6 font-semibold text-zinc-200">
                        {b.guestName}
                      </td>
                      <td className="py-4 px-6 text-sm text-zinc-400">
                        {b.roomTitle}{" "}
                        <span className="text-xs text-zinc-600">
                          ({b.roomId})
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-zinc-300">
                        {b.dates}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                            b.paymentMethod === "online" ||
                            b.status === "Checked Out"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {b.paymentMethod === "online" ||
                          b.status === "Checked Out"
                            ? "Paid"
                            : "Unpaid"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-emerald-400 font-bold">
                        ₹{b.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            b.status === "Checked In"
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : b.status === "Checked Out"
                                ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                : b.status === "Cancelled"
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                  : b.status === "Refunded"
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 justify-center">
                          {b.status === "Cancelled" &&
                          b.paymentMethod === "online" ? (
                            <button
                              disabled={isRefunding !== null} // Freeze target system interface dynamically during processing loop
                              onClick={() => handleIssueStripeRefund(b._id)}
                              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 px-4 py-1.5 rounded text-xs font-black tracking-tight cursor-pointer transition shadow-md shadow-emerald-500/10 min-w-35"
                            >
                              {isRefunding === b._id
                                ? "Processing..." // LOCAL INDICATOR TARGET SUCCESSFUL LOCK
                                : "Issue Stripe Refund"}
                            </button>
                          ) : (
                            <>
                              <select
                                value={b.status}
                                disabled={b.status === "Refunded"}
                                onChange={(e) =>
                                  handleStatusChange(b._id, e.target.value)
                                }
                                className="bg-zinc-950 border border-zinc-800 text-xs p-1.5 rounded text-zinc-300 outline-none cursor-pointer disabled:opacity-50"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Checked In">Check In</option>
                                <option value="Checked Out">Check Out</option>
                                <option value="Cancelled">Cancel</option>
                                {b.status === "Refunded" && (
                                  <option value="Refunded">Refunded</option>
                                )}
                              </select>

                              <button
                                disabled={(() => {
                                  // 1. Open button if status is cancelled or refunded.
                                  if (
                                    b.status === "Cancelled" ||
                                    b.status === "Refunded"
                                  )
                                    return false;

                                  if (b.dates && b.dates.includes(" to ")) {
                                    const checkoutStr =
                                      b.dates.split(" to ")[1];
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0); // Clean today date and time

                                    const checkoutDate = new Date(checkoutStr);
                                    checkoutDate.setDate(
                                      checkoutDate.getDate() + 1,
                                    );
                                    checkoutDate.setHours(0, 0, 0, 0);

                                    if (today < checkoutDate) return true;
                                  }

                                  return b.status !== "Checked Out";
                                })()}
                                onClick={() => openDeleteConfirmation(b._id)}
                                className={`px-2 py-1.5 rounded text-xs transition border ${
                                  b.status === "Cancelled" ||
                                  b.status === "Refunded" ||
                                  (() => {
                                    if (b.dates && b.dates.includes(" to ")) {
                                      const cDate = new Date(
                                        b.dates.split(" to ")[1],
                                      );
                                      cDate.setDate(cDate.getDate() + 1);
                                      return (
                                        new Date().setHours(0, 0, 0, 0) >=
                                        cDate.setHours(0, 0, 0, 0)
                                      );
                                    }
                                    return false;
                                  })()
                                    ? "bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border-red-500/20 cursor-pointer"
                                    : "bg-zinc-800 text-zinc-600 border-zinc-700 opacity-30 cursor-not-allowed pointer-events-none"
                                }`}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Central Customer Contact Us Inquiries Sheet Panel Workspace Layout */
          <>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden shadow-xl animate-fadeIn">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[11px] font-bold border-b border-zinc-800">
                    <tr>
                      <th className="py-4 px-6">Sender Details</th>
                      <th className="py-4 px-6">Contact Channels</th>
                      <th className="py-4 px-6">Message Description Payload</th>
                      <th className="py-4 px-6">Timestamp</th>
                      <th className="py-4 px-6 text-center">Status Control</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-12 text-center text-zinc-500 text-sm font-medium"
                        >
                          Operational database indexes clear. No contact form
                          records available.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((item) => (
                        <tr
                          key={item._id}
                          className={`transition ${
                            item.status === "read"
                              ? "bg-transparent hover:bg-zinc-900/20 opacity-75"
                              : "bg-blue-500/2 hover:bg-zinc-900/40"
                          }`}
                        >
                          <td className="py-4 px-6 font-semibold text-zinc-200 text-sm">
                            <div className="flex items-center gap-2">
                              {item.status !== "read" && (
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                              )}
                              {item.name}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-zinc-400 space-y-0.5">
                            <div className="text-zinc-300 font-mono">
                              {item.email}
                            </div>
                            <div className="text-zinc-500 font-mono">
                              {item.phone || "N/A"}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-zinc-300 max-w-xs md:max-w-md leading-relaxed whitespace-pre-wrap wrap-break-word">
                            {item.message}
                          </td>
                          <td className="py-4 px-6 font-mono text-[11px] text-zinc-400">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString(
                                  "en-IN",
                                  {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  },
                                )
                              : today}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() =>
                                handleToggleReadStatus(item._id, item.status)
                              }
                              className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                                item.status === "read"
                                  ? "bg-zinc-800 text-zinc-500 border border-zinc-700/50 hover:text-zinc-300"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white"
                              }`}
                            >
                              {item.status === "read"
                                ? "Mark Unread"
                                : "Mark Read"}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => setInquiryToDelete(item)}
                              className="bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 px-2 py-1 rounded text-xs transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* NEW CUSTOM POPUP MODAL FOR DELETE CONFIRMATION */}
            {inquiryToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className="w-full max-w-md p-6 mx-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl transform transition-all">
                  {/* Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-lg">
                      ⚠️
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                      Confirm Delete
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="mt-4 text-xs text-zinc-400 leading-relaxed">
                    Are you absolutely sure you want to permanently delete the
                    inquiry from{" "}
                    <span className="text-zinc-200 font-semibold">
                      {inquiryToDelete.name}
                    </span>
                    ? This will cannot be undone.
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setInquiryToDelete(null)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors font-semibold text-xs uppercase tracking-wider border border-zinc-700/50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteInquiry(inquiryToDelete._id);
                        setInquiryToDelete(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-red-900/20"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================================================
          CREATE OFFLINE BOOKING MODAL OVERLAY
          ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl max-w-md w-full text-left">
            <h3 className="text-xl font-black text-blue-500 mb-1">
              Add Offline Booking
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Directly persist walked-in customer details to core records.
            </p>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={newBooking.guestName}
                  onChange={handleCreateInputChange}
                  required
                  placeholder="e.g. Jhon cena"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Assign Premium Luxury Room
                </label>
                <select
                  name="roomId"
                  value={newBooking.roomId}
                  onChange={handleRoomSelectChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:border-blue-500 outline-none cursor-pointer transition"
                >
                  <option value="">-- Choose Active Suite Layout --</option>
                  {hotelRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.title} (₹{room.price}/night)
                    </option>
                  ))}
                </select>

                {/* REAL-TIME ALREADY BOOKED DATES ALERT MATRIX DISPLAY */}
                {newBooking.roomId && (
                  <>
                    {roomBookedDates.length > 0 ? (
                      <div className="mt-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg max-h-28 overflow-y-auto">
                        <p className="text-[11px] font-black text-amber-500 uppercase tracking-wider mb-1">
                          ⚠️ Already Blocked Dates for this Room:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {roomBookedDates.map((date, idx) => (
                            <span
                              key={idx}
                              className="bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-[10px] px-1.5 py-0.5 rounded"
                            >
                              {date}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                        <p className="text-[11px] text-emerald-400 font-medium">
                          100% Available! No active bookings found for this
                          room.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Check In Date
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    min={today}
                    value={newBooking.arrivalDate}
                    onChange={handleCreateInputChange}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Check Out Date
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    min={newBooking.arrivalDate || today}
                    value={newBooking.departureDate}
                    onChange={handleCreateInputChange}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Total Nights (Auto)
                  </label>
                  <input
                    type="number"
                    name="nights"
                    value={newBooking.nights}
                    readOnly
                    disabled
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-500 outline-none cursor-not-allowed transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Total Amount (₹ Editable)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newBooking.amount}
                    onChange={handleCreateInputChange}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-emerald-400 font-bold focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Initial Booking Status
                </label>
                <select
                  name="status"
                  value={newBooking.status}
                  onChange={handleCreateInputChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:border-blue-500 outline-none cursor-pointer transition"
                >
                  <option value="Pending">Pending</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Checked Out">Check Out</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setRoomBookedDates([]); // Safe reset array on close
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-lg cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded-lg font-bold cursor-pointer transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          CRITICAL REGISTRY HARD DELETION CONFIRMATION INTERFACE
          ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-lg font-bold text-red-500 mb-2">
              Confirm Permanent Deletion
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to permanently delete this booking record
              from the database? This action is irreversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBookingId(null);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-lg cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded-lg font-bold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
