import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./sections/About";
import Booking from "./sections/Booking";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import Room from "./sections/Rooms";
import Services from "./sections/Services";
import BookingProvider, { BookingContext } from "./context/BookingContext";
import SuccessModal from "./components/SuccessModel";
import UserProfile from "./components/UserProfile";
import BookingSuccess from "./sections/BookingSuccess";
import React, { useContext } from "react";

/**
 * MainLayout Component
 * Evaluates core layout states dynamically based on standard execution architectures
 */
function MainLayout() {
  const { view } = useContext(BookingContext);

  return (
    <div className="w-full">
      <Navbar />

      {/* Conditionally switches between primary single-page matrix and historical profile views */}
      {view === "main" ? (
        <>
          <Hero />
          <Booking />
          <About />
          <Room />
          <Services />
          <Contact />
          <Footer />
        </>
      ) : (
        <UserProfile />
      )}

      {/* Global runtime overlay interfaces */}
      <SuccessModal />
    </div>
  );
}

/**
 * Root App Component
 * Wraps structural views inside OAuth parameters, routing instances, and global context providers
 */
function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            {/* Primary index route capturing standard application operations */}
            <Route path="/" element={<MainLayout />} />

            {/* Dedicated callback target endpoint verifying electronic transaction payloads from Stripe */}
            <Route path="/booking-success" element={<BookingSuccess />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
