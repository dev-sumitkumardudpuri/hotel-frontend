import React, { createContext, useState } from "react";

// Named export for initialization context to be injected via subscriber hooks across child configurations
export const BookingContext = createContext();

function BookingProvider({ children }) {
  // Navigation Routing State: Controls viewports across application layouts ('main' | 'profile' | 'admin')
  const [view, setView] = useState("main");

  // State to hold and manage operational runtime details of a selected room container
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Lazy state initializer block used to securely extract persistent authorization profiles and token roles from storage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      return {
        name: parsedUser.name,
        email: parsedUser.email,
        role: parsedUser.role || "user", // Fallback assignment defaults explicitly to standard 'user' access control
        isLoggedIn: true,
      };
    }
    // Return standard anonymous state signatures if no persistent authorization data tokens exist
    return { name: "", email: "", role: "", isLoggedIn: false };
  });

  // State cache storage to keep records of transaction receipt metadata structures post payment
  const [bookingDetails, setBookingDetails] = useState(null);

  /**
   * Commits successful user registration or login parameters straight into memory stores
   * @param {string} name - Explicit client profile identity value
   * @param {string} email - Verified user network address string
   * @param {string} role - RBAC authorization security privilege indicator level
   */
  const loginUser = (name, email, role) => {
    // Write authorization vectors directly to persistent storage blocks to defend against page-refresh data purging
    localStorage.setItem("user", JSON.stringify({ name, email, role }));

    // Apply immediate data propagation over React virtualDOM structures synchronously
    setUser({ name: name, email: email, role: role, isLoggedIn: true });
  };

  /**
   * Destroys existing token signatures across active cache sectors to isolate and terminate user sessions
   */
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({ name: "", email: "", role: "", isLoggedIn: false });
    setView("main"); // Redirects application runtime flow back onto the root homepage segment safely
  };

  return (
    <BookingContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        user,
        loginUser,
        logoutUser,
        bookingDetails,
        setBookingDetails,
        view,
        setView,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export default BookingProvider;
