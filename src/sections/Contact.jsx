import React, { useState, useContext, useEffect } from "react";
import { BookingContext } from "../context/BookingContext";
import { toast, Toaster } from "react-hot-toast";

function Contact() {
  const { user } = useContext(BookingContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  /**
   * Synchronizes internal form state inputs with hot-reloaded user authentication contexts
   */
  useEffect(() => {
    if (user.isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email || "user@example.com",
      }));
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  }, [user]);

  /**
   * Intercepts input mutations and applies inline schema criteria for numerical strings
   * @param {Event} e - Input element change event payload
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Inline regex verification constraint to enforce numeric string bounds of up to 10 indices
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  /**
   * Processes asynchronous submission routes to deliver user queries safely to backend tables
   * @param {Event} e - Form element submit event trigger block
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      // Dispatches full form payload structures directly onto remote endpoints via POST methods
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success(`Thank you, ${formData.name}! ${data.message}`);

        // Reinitializes the state model values back to baseline parameters post transmission success
        setFormData({
          name: user.isLoggedIn ? user.name : "",
          email: user.isLoggedIn ? user.email || "user@example.com" : "",
          phone: "",
          message: "",
        });
      } else {
        toast.error(`Submission processing failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      toast.error(
        "Unable to establish contact with the backend. Please verify your server architecture routing status.",
      );
    }
  };

  return (
    <section
      id="contact"
      className="bg-zinc-900 border-b border-blue-500/10 text-white py-16 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Dynamic Toast Mount Container Context Injector */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Contact{" "}
          <span className="text-blue-500 shadow-blue-500/20 drop-shadow">
            Us!
          </span>
        </h2>

        <p className="text-zinc-400 mb-8 text-sm md:text-base leading-relaxed">
          If you have any questions or suggestions. Feel free to get in touch
          with me using the contact information below:
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              NAME:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={user.isLoggedIn}
              className={`w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300 ${
                user.isLoggedIn
                  ? "opacity-60 cursor-not-allowed bg-zinc-900"
                  : ""
              }`}
              placeholder="Your Name"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              EMAIL:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={user.isLoggedIn}
              className={`w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300 ${
                user.isLoggedIn
                  ? "opacity-60 cursor-not-allowed bg-zinc-900"
                  : ""
              }`}
              placeholder="Your Email Address"
            />
          </div>

          {/* Phone Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              PHONE:
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
              placeholder="10-Digit Mobile Number"
            />
          </div>

          {/* Message Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              MESSAGE:
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300 resize-none"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-2 flex justify-stretch md:justify-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-transparent font-bold border border-blue-500 text-blue-500 px-10 py-3 rounded-full hover:bg-blue-500 hover:text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;
