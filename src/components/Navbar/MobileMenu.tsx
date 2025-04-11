// src/components/navbar/MobileMenu.tsx
import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaPoll,
  FaUserCircle,
  FaWallet,
  FaBell,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaStar,
  FaCheckCircle, // Added icons
} from "react-icons/fa";
import { ButtonOutline } from "../Buttons/Buttons"; // Adjust path as needed
import { AppContext } from "@/context/AppContext"; // Adjust path as needed

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
  navLinks: { to: string; label: string; icon: React.ReactElement }[];
  // Props derived from WalletConnect state (passed down from Navbar)
  walletConnected: boolean;
  usdValue: string;
  connectWallet: () => Promise<void>;
  // Props derived from NotificationsBell state (passed down from Navbar)
  unreadCount: number;
  // Props derived from UserProfileDropdown state/functions (passed down from Navbar)
  handleLogout: () => Promise<void>;
  handleVerification: () => Promise<void>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  closeMenu,
  navLinks,
  walletConnected,
  usdValue,
  connectWallet,
  unreadCount, // Needed if showing bell count here
  handleLogout,
  handleVerification,
}) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) return null; // Should not happen if Navbar checks context
  const { isLoggedin, userData } = context;

  if (!isOpen) {
    return null;
  }

  const onLinkClick = (action?: () => void) => {
    action?.();
    closeMenu();
    window.scrollTo(0, 0);
  };

  const onButtonClick = (action: () => Promise<void> | void) => {
    action();
    // Don't close menu immediately for actions like connectWallet
    // closeMenu(); // Decide if menu should close after button actions
  };

  return (
    <div className="md:hidden absolute top-full left-0 right-0 w-full bg-primary border-t border-gray-700 shadow-lg z-40">
      {" "}
      {/* Lower z-index than dropdowns */}
      <div className="p-4 space-y-3 flex flex-col">
        {/* Wallet Info & Deposit/Connect (Mobile) */}
        {isLoggedin &&
          (walletConnected ? (
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg mb-2">
              <div className="flex items-center space-x-2">
                <FaWallet className="text-green-400" />
                <div>
                  <div className="text-xs text-gray-400">Balance</div>
                  <div className="font-medium text-green-400">${usdValue}</div>
                </div>
              </div>
              <ButtonOutline
                onClick={() => onLinkClick(() => navigate("/deposit"))}
                small
              >
                Deposit
              </ButtonOutline>
            </div>
          ) : (
            <ButtonOutline
              fullWidth
              onClick={() => onButtonClick(connectWallet)}
              className="mb-2"
            >
              Connect Wallet
            </ButtonOutline>
          ))}

        {/* Mobile Nav Links */}
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={`mobile-${to}`}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 font-medium ${
                isActive
                  ? "bg-secondary/10 text-secondary"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
            onClick={() => onLinkClick()}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Mobile User Actions */}
        {isLoggedin && userData ? (
          <div className="pt-3 border-t border-gray-700 space-y-2">
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
              onClick={() => onLinkClick()}
            >
              <FaUserCircle />
              <span>Profile Settings</span>
            </Link>
            <Link
              to="/watchlist"
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
              onClick={() => onLinkClick()}
            >
              <FaStar /> {/* Changed Icon */}
              <span>My Watchlist</span>
            </Link>
            {/* Mobile Notifications Link - Reconsider if needed as bell is outside */}
            {/* <Link
                            to="/notifications"
                            className="flex items-center justify-between w-full p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                             onClick={() => onLinkClick()}
                        >
                             <div className="flex items-center space-x-3"> <FaBell /> <span>Notifications</span> </div>
                             {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                         </Link> */}

            {!userData.isAccountVerified && (
              <button
                onClick={() => onButtonClick(handleVerification)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-yellow-400 hover:bg-yellow-900/30 transition-colors duration-150 font-medium"
              >
                <FaExclamationTriangle />
                <span>Verify Account</span>
              </button>
            )}
            {userData.isAccountVerified && ( // Show verified status
              <div className="flex items-center space-x-3 w-full p-3 rounded-lg text-green-400 ">
                <FaCheckCircle />
                <span>Account Verified</span>
              </div>
            )}

            <button
              onClick={() => onButtonClick(handleLogout)}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors duration-150 font-medium"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          // Mobile Login/Signup Buttons
          <div className="flex flex-col space-y-3 pt-3 border-t border-gray-700">
            <ButtonOutline
              fullWidth
              onClick={() => onLinkClick(() => navigate("/login"))}
            >
              Login
            </ButtonOutline>
            <ButtonOutline
              fullWidth
              variant="secondary"
              onClick={() => onLinkClick(() => navigate("/signup"))}
            >
              Sign Up
            </ButtonOutline>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
