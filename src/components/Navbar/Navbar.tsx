// src/components/navbar/Navbar.tsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaHome, FaCalendarAlt, FaPoll, FaBars, FaBell } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import logo from "../../assets/images/logo.png"; // Adjust path as needed
import { ButtonOutline } from "../Buttons/Buttons"; // Adjust path as needed
import Web3 from "web3"; // Keep Web3 import if needed for connectWallet logic passing

// Import the partitioned components
import WalletConnect from "./WalletConnect";
import NotificationsBell from "./NotificationsBell";
import UserProfileDropdown from "./UserProfileDropdown";
import MobileMenu from "./MobileMenu";
import { toast } from "react-toastify"; // Keep for connectWallet/auth actions if passed down

// Import shared types/utils if needed directly here (though mostly used in sub-components)
// import { Notification } from "./navbar.types";
// import { formatTimestamp } from "./navbar.utils";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // State/Functions needed by MobileMenu (can be lifted or re-implemented if simpler)
  // We'll lift the connectWallet logic here to pass down to both WalletConnect (internal use)
  // and MobileMenu (button trigger)
  const [localWalletConnected, setLocalWalletConnected] = useState(false);
  const [localUsdValue, setLocalUsdValue] = useState("0.00");
  // We could lift more state (notifications, profile) but it increases complexity here.
  // Instead, we'll pass down necessary *functions* from UserProfileDropdown if needed in MobileMenu.

  // Re-implement connectWallet here to pass down to MobileMenu
  // WalletConnect component handles its own internal connection display/logic
  const connectWalletForMobile = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // We don't *need* to update local state here, as WalletConnect will detect
        // the change via its own effect and display the updated info.
        // However, the button in MobileMenu might want visual feedback.
        toast.success("Wallet connected successfully!");
        // Optionally force close mobile menu on connect?
        // setMenuOpen(false);
      } catch (error: any) {
        console.error("Error connecting to wallet (from Navbar):", error);
        if (error.code === 4001) {
          toast.info("Wallet connection request rejected.");
        } else {
          toast.error("Failed to connect wallet.");
        }
      }
    } else {
      toast.error("MetaMask is not installed.");
    }
  };

  // Need to get unreadCount for mobile bell icon / mobile menu link
  // This requires lifting state or passing a callback. Lifting state is complex.
  // Let's just fetch it again here or pass a callback to NotificationsBell (simpler).
  // For simplicity, let's assume the mobile bell icon outside the menu is sufficient for now.
  // We will pass dummy values or simplified logic for MobileMenu props initially.
  // TODO: Properly wire up shared state if MobileMenu *needs* live data from siblings.
  const [mobileUnreadCount, setMobileUnreadCount] = useState(0); // Placeholder

  if (!context) {
    console.error("AppContext is null in Navbar");
    return null; // Or some fallback UI
  }
  const { userData, isLoggedin, backendUrl, setUserData, setIsLoggedin } =
    context; // Destructure all needed context
  // Re-implement logout/verify here to pass down to MobileMenu
  // UserProfileDropdown handles its own internal actions
  const handleLogoutForMobile = useCallback(async () => {
    // Duplicating logic - Better approach: Lift logout logic to context or a hook
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
        toast.success("Logged out successfully!");
        navigate("/");
        setMenuOpen(false); // Close menu on mobile logout
      } else {
        toast.error(data.message || "Logout failed.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  }, [backendUrl, navigate, setIsLoggedin, setUserData]);

  const handleVerificationForMobile = useCallback(async () => {
    // Duplicating logic - Better approach: Lift verification logic to context or a hook
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
        setMenuOpen(false); // Close menu
      } else {
        toast.error(data.message || "Failed to send verification email.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  }, [backendUrl, navigate]);

  // Define NavLinks (could be moved to constants file)
  const navLinks = [
    { to: "/home", label: "Home", icon: <FaHome /> },
    { to: "/upcoming", label: "Upcoming Events", icon: <FaCalendarAlt /> },
    { to: "/results", label: "Results", icon: <FaPoll /> },
    ...(isLoggedin
      ? [{ to: "/dashboard", label: "Dashboard", icon: <FaPoll /> }]
      : []),
  ];

  const closeMobileMenu = () => setMenuOpen(false);

  // --- Render ---
  return (
    <nav className="bg-primary px-4 py-3 sticky top-0 z-50 shadow-lg text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Branding */}
        <div className="flex items-center space-x-3">
          {logo && <img src={logo} alt="Logo" className="h-9 w-auto" />}
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="text-2xl font-bold text-accent hover:text-secondary transition duration-200"
          >
            STAKEWISE
          </Link>
        </div>

        {/* Desktop Navigation & User Area */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Main Links */}
          <div className="flex space-x-6">
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => window.scrollTo(0, 0)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                    isActive
                      ? "text-secondary bg-secondary/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {icon} <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Section (Logged In) - Using partitioned components */}
          {isLoggedin && userData ? (
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Pass necessary props */}
              <WalletConnect isLoggedin={isLoggedin} />
              <NotificationsBell /> {/* Context provides necessary data */}
              <UserProfileDropdown /> {/* Context provides necessary data */}
            </div>
          ) : (
            // User Section (Logged Out)
            <div className="flex items-center space-x-3">
              {/* Login/Signup Buttons */}
              <ButtonOutline
                onClick={() => navigate("/login")}
                small
                className="text-sm"
              >
                Login
              </ButtonOutline>
              <ButtonOutline
                onClick={() => navigate("/signup")}
                variant="secondary"
                small
                className="text-sm"
              >
                Sign Up
              </ButtonOutline>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Notification Icon (Simplified - relies on NotificationsBell for actual count/dropdown) */}
          {isLoggedin && (
            <Link
              to="/notifications" // Link to a dedicated notifications page on mobile?
              className="text-2xl text-gray-300 hover:text-white transition duration-200 relative"
              aria-label="View Notifications"
            >
              <FaBell />
              {/* We don't have easy access to unreadCount here without lifting state */}
              {/* Showing a simple dot might be easier if count > 0 */}
              {/* {mobileUnreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 border border-primary"></span>} */}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className="text-2xl text-gray-300 hover:text-white transition duration-200"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Menu Content - Using partitioned component */}
      <MobileMenu
        isOpen={menuOpen}
        closeMenu={closeMobileMenu}
        navLinks={navLinks}
        // Pass necessary state/functions down
        walletConnected={localWalletConnected} // Use local/lifted state if needed by MobileMenu display
        usdValue={localUsdValue} // Use local/lifted state if needed by MobileMenu display
        connectWallet={connectWalletForMobile}
        unreadCount={mobileUnreadCount} // Pass placeholder or lifted state
        handleLogout={handleLogoutForMobile}
        handleVerification={handleVerificationForMobile}
      />
    </nav>
  );
};

// Need axios for mobile actions if implemented directly here
import axios from "axios";

export default Navbar;
