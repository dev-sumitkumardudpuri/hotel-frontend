import React, { useState, useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { toast, Toaster } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

function AuthModal({ isOpen, onClose }) {
  const { loginUser } = useContext(BookingContext);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * HANDLES REAL RUNTIME CLOUD GOOGLE LOGIN INVOCATION INTERFACE
   * Placed at the top level to strictly follow React Hooks lifecycle rules
   */
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        toast.loading("Verifying your Google identity securely...", {
          id: "google-auth",
        });

        // Fetch verified profile metadata directly from Google's resource endpoints using the secure access token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        const userInfo = await userInfoResponse.json();

        // Relay genuine cloud credentials to backend processing endpoints for storage or automatic synchronization
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userInfo.name || "Google Guest",
              email: userInfo.email,
            }),
          },
        );

        const data = await response.json();
        toast.dismiss("google-auth");

        if (data.success) {
          toast.success(data.message);

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          loginUser(data.user.name, data.user.email, data.user.role);

          setEmail("");
          setPassword("");
          onClose();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.dismiss("google-auth");
        console.error("Google Profile Extraction Error:", error);
        toast.error("Failed to collect security info from Google nodes.");
      }
    },
    onError: (error) => {
      console.error("Google Client Trigger Failure:", error);
      toast.error("Google authentication process was rejected or cancelled.");
    },
  });

  // GUARD CLAUSE FOR MODAL DISPLAY STATE
  if (!isOpen) return null;

  /**
   * Submits authentication credentials to backend nodes for token assignment or registration
   * @param {Event} e - Form submission intercept trigger event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && !name) {
      toast.error("Please enter your name");
      return;
    }

    // FRONTEND STRICT REAL LIFE EMAIL DOMAIN CHECK
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const commonFakeDomains = [
      "xyz",
      "test",
      "example",
      "fake",
      "temp",
      "abcd",
    ];

    if (!emailRegex.test(email)) {
      toast.error("Invalid email structure format!");
      return;
    }

    const domain = email.split("@")[1]?.split(".")[0];
    if (commonFakeDomains.includes(domain)) {
      toast.error("Disposable or fake email networks are not allowed!");
      return;
    }

    try {
      const url = isSignup
        ? `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`
        : `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

      const bodyData = isSignup
        ? { name, email, password }
        : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (data.success) {
        if (isSignup) {
          toast.success(data.message);
          setIsSignup(false);
          setName("");
        } else {
          toast.success(data.message);

          // Synchronize authentication tokens and user state details with persistent browser storage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Feed user data context payload containing name, email, and privileges directly to application memory state
          loginUser(data.user.name, data.user.email, data.user.role);

          setEmail("");
          setPassword("");
          onClose();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      // Fallback message triggered if remote network connection layers or server architectures fail
      toast.error(
        "Unable to connect to the authentication server. Please check your backend connection.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      {/* Dynamic injection viewport mount block for notification popups */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-8 rounded-2xl shadow-2xl relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all mt-2 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        {/* VISUAL SPLITTER FOR THIRD PARTY AUTHENTICATION */}
        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-zinc-800/80"></div>
          <span className="shrink mx-4 text-zinc-500 text-xs font-bold uppercase tracking-wider">
            or
          </span>
          <div className="grow border-t border-zinc-800/80"></div>
        </div>

        {/* CLOUD INTEGRATED GOOGLE LOGIN BUTTON */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-zinc-400 text-sm text-center mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline cursor-pointer font-medium"
          >
            {isSignup ? "Log In" : "Register Now"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
