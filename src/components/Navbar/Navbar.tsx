import React, { useState, useContext, useCallback } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import {
  Menu,
  Calendar,
  Gift,
  MessageSquare,
  Newspaper,
  Home,
} from "lucide-react";

import { AppContext } from "@/context/AppContext";
import TeamLogo from "../../assets/team-logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [localWalletConnected, setLocalWalletConnected] = useState(false);
  const [localUsdValue, setLocalUsdValue] = useState("0.00");
  const [mobileUnreadCount, setMobileUnreadCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

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
    <nav className="bg-[#1C1C27] text-white h-16 px-2 sm:px-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <div className="flex items-center px-1 sm:px-2">
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center"
        >
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl mr-2 sm:mr-3 font-saira-stencil">
            STAKEWISE
          </span>
          <img
            src={TeamLogo}
            alt="Team Logo"
            className="logo-icon w-[28px] h-[22px] sm:w-[35px] sm:h-[28px] md:w-[42px] md:h-[34px]"
          />
        </Link>
      </div>

      <div className="hidden lg:flex items-center space-x-4 xl:space-x-8 mt-2 ml-4 xl:ml-10 text-[12px] xl:text-[13px] font-bold">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) =>
              `flex items-center ${
                isActive ? "text-[#E27625]" : "text-[#8488AC]"
              } hover:text-[#E27625] hover:border-b-[3px] hover:border-[#E27625] transition-color pb-2 ${
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

      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
        {isLoggedin ? (
          <>
            <WalletConnect isLoggedin={isLoggedin} />
            <NotificationsBell />
            <UserProfileDropdown />

            {/* Mobile Menu Button for logged in users */}
            <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-[#ffffff] !w-8 !h-8 !p-1 sm:!p-2 hover:bg-gray-700 transition"
                >
                  <Menu className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 sm:w-56 bg-[#252538] text-white border-gray-700 mr-2"
              >
                {navItems.map((item) => (
                  <DropdownMenuItem key={`mobile-${item.name}`} asChild>
                    <Link
                      to={item.href}
                      className="flex items-center cursor-pointer text-sm"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="hidden sm:flex text-orange-500 hover:text-orange-400 text-sm px-2 py-1"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="hidden sm:flex bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm px-3 py-1"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>

            <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#ffffff] !w-8 !h-8 !p-1 sm:!p-2 hover:bg-gray-700 transition"
                >
                  <Menu className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 sm:w-56 bg-[#252538] text-white border-gray-700 mr-2"
              >
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={`mobile-${item.name}`}
                    asChild
                    className="lg:hidden"
                  >
                    <Link
                      to={item.href}
                      className="flex items-center cursor-pointer text-sm"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="lg:hidden bg-gray-700" />
                <DropdownMenuItem asChild className="sm:hidden">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full mt-2 justify-center text-sm"
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="sm:hidden">
                  <Button
                    variant="outline"
                    className="w-full rounded-full mt-2 justify-center text-orange-500 border border-orange-500 hover:bg-gray-700 text-sm"
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild>
                  <Link
                    to="/contactus"
                    className="flex items-center cursor-pointer text-sm"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setMenuOpen(false);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Us
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <MobileMenu
        isOpen={menuOpen}
        closeMenu={closeMobileMenu}
        navLinks={navItems}
        walletConnected={localWalletConnected}
        usdValue={localUsdValue}
        connectWallet={connectWalletForMobile}
        unreadCount={mobileUnreadCount}
        handleLogout={handleLogoutForMobile}
        handleVerification={handleVerificationForMobile}
      />
    </nav>
  );
};

export default Navbar;
