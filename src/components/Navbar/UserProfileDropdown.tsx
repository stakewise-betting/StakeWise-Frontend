// src/components/navbar/UserProfileDropdown.tsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext"; // Adjust path as needed
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg"; // Adjust path as needed

const UserProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Add real dark mode logic if needed
  const [picture, setPicture] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  if (!context) {
    console.error("AppContext is null in UserProfileDropdown");
    return null;
  }
  const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
    context;

  // Update local picture state when userData changes
  useEffect(() => {
    setPicture(userData?.picture || "");
  }, [userData?.picture]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- User Actions ---
  const handleVerification = async () => {
    setProfileOpen(false);
    const loadingToast = toast.loading("Sending verification email...");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/sendVerifyOtp`,
        {},
        { withCredentials: true }
      );
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Verification email sent! Please check your inbox.");
        navigate("/email-verify");
      } else {
        toast.error(data.message || "Failed to send verification email.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Verification email sending error:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    const loadingToast = toast.loading("Logging out...");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.dismiss(loadingToast);
      if (data.success) {
        setUserData(null);
        setIsLoggedin(false);
        // Wallet and notification state will reset based on isLoggedin changes in their components
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
      // Optional: Force logout locally even if API fails
      // setUserData(null);
      // setIsLoggedin(false);
      // navigate("/");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implement your actual dark mode switching logic here
    // e.g., document.documentElement.classList.toggle('dark');
    // localStorage.setItem('darkMode', !isDarkMode);
    console.log("Dark mode toggled (implement actual logic)");
    setProfileOpen(false);
  };

  // Render nothing if user not logged in
  if (!isLoggedin || !userData) {
    return null;
  }

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        aria-label="Toggle User Menu"
        className="flex items-center space-x-2 group transition duration-200"
      >
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-bold overflow-hidden border-2 border-transparent group-hover:border-accent transition">
          {
            picture ? (
              <img
                key={picture} // Re-render if picture changes
                src={picture}
                alt="User profile"
                className="w-full h-full object-cover"
                // Basic error handling: hide broken image icon
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : null /* Placeholder element needed if image fails/not present */
          }

          {/* Fallbacks shown if `picture` is falsy OR if the img above failed onError */}
          {!picture &&
            (userData.fname ? (
              <span className="text-lg">{userData.fname[0].toUpperCase()}</span>
            ) : userData.walletAddress ? (
              <img
                src={MetamaskLogo}
                alt="MetaMask User"
                className="w-3/4 h-3/4 object-contain p-0.5"
              />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400" /> // Generic fallback
            ))}
        </div>
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          {" "}
          {/* Ensure high z-index */}
          <div className="p-3 border-b border-gray-700">
            <div className="font-semibold text-white truncate">
              {userData.fname ||
                (userData.walletAddress ? "Wallet User" : "User")}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {userData.email ||
                (userData.walletAddress
                  ? `${userData.walletAddress.slice(
                      0,
                      6
                    )}...${userData.walletAddress.slice(-4)}`
                  : "No details")}
            </div>
          </div>
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => {
                window.scrollTo(0, 0);
                setProfileOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors duration-150"
            >
              {" "}
              Profile Settings{" "}
            </Link>
            <Link
              to="/watchlist"
              onClick={() => {
                window.scrollTo(0, 0);
                setProfileOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors duration-150"
            >
              {" "}
              My Watchlist{" "}
            </Link>
            <button
              onClick={toggleDarkMode}
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors duration-150"
            >
              {" "}
              Toggle {isDarkMode ? "Light" : "Dark"} Mode{" "}
            </button>

            {!userData.isAccountVerified && (
              <button
                onClick={handleVerification}
                className="block w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-900/30 transition-colors duration-150"
              >
                {" "}
                Verify Account{" "}
              </button>
            )}

            <div className="my-1 border-t border-gray-700"></div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors duration-150"
            >
              {" "}
              Logout{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
