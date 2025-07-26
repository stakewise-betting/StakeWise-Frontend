import React, { useState, useContext, useCallback } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { Menu, Calendar, Gift, Newspaper, Home, Trophy } from "lucide-react";

import { AppContext } from "@/context/AppContext";
import TeamLogo from "../../assets/team-logo.svg";
import { Button } from "@/components/ui/button";

import WalletConnect from "./WalletConnect";
import NotificationsBell from "./NotificationsBell";
import UserProfileDropdown from "./UserProfileDropdown";
import MobileMenu from "./MobileMenu";
import { toast } from "react-toastify";
import axios from "axios";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  breakpoint: "always" | "xl" | "lg" | "md" | "sm";
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null; // Safeguard if context is unavailable
  }

  const { backendUrl, isLoggedin, setUserData, setIsLoggedin } = appContext;

  const [menuOpen, setMenuOpen] = useState(false);

  const connectWalletForMobile = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        toast.success("Wallet connected successfully!");
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

  const handleLogoutForMobile = useCallback(async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      if (!backendUrl) {
        toast.error("Backend URL is not configured.");
        return;
      }
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
        setMenuOpen(false);
      } else {
        toast.error(data.message || "Logout failed.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  }, [backendUrl, navigate, setUserData, setIsLoggedin]);

  const handleVerificationForMobile = useCallback(async () => {
    const loadingToast = toast.loading("Sending verification email...");
    try {
      if (!backendUrl) {
        toast.error("Backend URL is not configured.");
        return;
      }
      const { data } = await axios.post(
        `${backendUrl}/api/auth/sendVerifyOtp`,
        {},
        { withCredentials: true }
      );
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Verification email sent! Please check your inbox.");
        navigate("/email-verify");
        setMenuOpen(false);
      } else {
        toast.error(data.message || "Failed to send verification email.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  }, [backendUrl, navigate]);

  const closeMobileMenu = () => setMenuOpen(false);

  const navItems: NavItem[] = [
    {
      name: "HOME",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      breakpoint: "always",
    },
    {
      name: "UPCOMING EVENTS",
      href: "/upcoming",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      breakpoint: "lg",
    },
    {
      name: "LEADERBOARD",
      href: "/leaderboard",
      icon: <Trophy className="h-4 w-4 mr-2" />,
      breakpoint: "lg",
    },
    {
      name: "NEWS",
      href: "/news",
      icon: <Newspaper className="h-4 w-4 mr-2" />,
      breakpoint: "xl",
    },
    ...(isLoggedin
      ? [
          {
            name: "REWARDS",
            href: "/reward",
            icon: <Gift className="h-4 w-4 mr-2" />,
            breakpoint: "xl" as const,
          },
        ]
      : []),
  ];

  return (
    <nav className="bg-[#1C1C27] border-b border-gray-700/60 text-white h-16 px-2 sm:px-4 flex items-center justify-between sticky top-0 z-50 shadow-lg backdrop-blur-sm">
      <div className="flex items-center px-1 sm:px-2">
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center hover:opacity-80 transition-opacity duration-300"
        >
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mr-1 sm:mr-2 lg:mr-3 font-saira-stencil text-secondary font-bold">
            STAKEWISE
          </span>
          <img
            src={TeamLogo}
            alt="Team Logo"
            className="logo-icon w-[24px] h-[20px] sm:w-[28px] sm:h-[22px] md:w-[32px] md:h-[26px] lg:w-[38px] lg:h-[30px] xl:w-[42px] xl:h-[34px] drop-shadow-lg"
          />
        </Link>
      </div>

      <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 text-[10px] lg:text-[11px] xl:text-[12px] font-semibold">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) =>
              `flex items-center px-2 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 rounded-lg transition-all duration-300 hover:bg-secondary/10 hover:shadow-lg ${
                isActive
                  ? "text-secondary bg-secondary/20 border border-secondary/30 shadow-md"
                  : "text-[#8488AC] hover:text-secondary"
              } ${
                item.breakpoint === "xl"
                  ? "hidden xl:flex"
                  : item.breakpoint === "lg"
                  ? "hidden lg:flex"
                  : ""
              }`
            }
          >
            {item.icon}
            <span className="ml-1 xl:ml-2">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        {isLoggedin ? (
          <>
            <div className="hidden lg:flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <WalletConnect isLoggedin={isLoggedin} />
            </div>
            <NotificationsBell />
            <UserProfileDropdown />

            {/* Mobile Menu Button for logged in users */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white !w-8 !h-8 !p-1 sm:!p-2 hover:bg-gray-700 hover:text-secondary transition-all duration-300 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="hidden sm:flex text-secondary hover:text-secondary/80 hover:bg-secondary/10 text-sm px-3 py-1 font-semibold rounded-lg transition-all duration-300"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="hidden sm:flex bg-secondary hover:bg-secondary/80 text-white rounded-lg text-sm px-3 py-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>

            {/* Mobile Menu Button for non-logged in users */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-white !w-8 !h-8 !p-1 sm:!p-2 hover:bg-gray-700 hover:text-secondary transition-all duration-300 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
            </Button>
          </>
        )}
      </div>

      <MobileMenu
        isOpen={menuOpen}
        closeMenu={closeMobileMenu}
        navLinks={navItems}
        walletConnected={false} // You'll need to pass the actual wallet connection status
        usdValue="0.00" // You'll need to pass the actual USD value
        connectWallet={connectWalletForMobile}
        handleLogout={handleLogoutForMobile}
        handleVerification={handleVerificationForMobile}
      />
    </nav>
  );
};

export default Navbar;
