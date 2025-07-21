// src/components/navbar/UserProfileDropdown.tsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  ChevronDown,
  LogOut,
  Eye,
  BarChart3,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react"; // Using lucide-react icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext"; // Adjust path as needed
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg"; // Adjust path as needed

const UserProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [profileOpen, setProfileOpen] = useState(false);
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

  // Render nothing if user not logged in
  if (!isLoggedin || !userData) {
    return null;
  }

  return (
    <DropdownMenu onOpenChange={setProfileOpen} open={profileOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 rounded-xl p-2 hover:bg-secondary/20 transition-all duration-300 border border-transparent hover:border-secondary/30 hover:shadow-lg">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-dark-primary font-bold border-2 border-gray-700/60 hover:border-secondary/50 transition-colors duration-300">
            {userData?.picture ? (
              <img
                key={picture}
                src={picture}
                alt="User profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : userData?.fname ? (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-secondary/20 text-secondary text-sm font-bold">
                {userData.fname[0].toUpperCase()}
              </div>
            ) : userData?.walletAddress ? (
              <img
                src={MetamaskLogo}
                alt="MetaMask Logo"
                className="w-6 h-6 object-contain rounded-full"
              />
            ) : (
              <User className="h-5 w-5 text-secondary" />
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-dark-primary transition-all duration-300 ${
              profileOpen ? "rotate-180 text-secondary" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#1C1C27] text-dark-primary border border-gray-700/60 mt-2 mr-2 shadow-2xl shadow-black/50 rounded-xl overflow-hidden"
      >
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-sm hover:bg-secondary/10 hover:text-secondary transition-colors duration-200 py-3 px-4 rounded-lg mx-2 mb-1"
          onClick={() => {
            navigate("/profile");
            setProfileOpen(false);
          }}
        >
          <User className="h-4 w-4 mr-3 text-secondary" />
          <span className="font-medium">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-sm hover:bg-secondary/10 hover:text-secondary transition-colors duration-200 py-3 px-4 rounded-lg mx-2 mb-1"
          onClick={() => {
            navigate("/watchlist");
            setProfileOpen(false);
          }}
        >
          <Eye className="h-4 w-4 mr-3 text-secondary" />
          <span className="font-medium">Watch List</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-sm hover:bg-secondary/10 hover:text-secondary transition-colors duration-200 py-3 px-4 rounded-lg mx-2 mb-1"
          onClick={() => {
            navigate("/dashboard");
            setProfileOpen(false);
          }}
        >
          <LayoutDashboard className="h-4 w-4 mr-3 text-secondary" />
          <span className="font-medium">Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-sm hover:bg-secondary/10 hover:text-secondary transition-colors duration-200 py-3 px-4 rounded-lg mx-2 mb-1"
          onClick={() => {
            navigate("/results");
            setProfileOpen(false);
          }}
        >
          <BarChart3 className="h-4 w-4 mr-3 text-secondary" />
          <span className="font-medium">Results</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-sm hover:bg-secondary/10 hover:text-secondary transition-colors duration-200 py-3 px-4 rounded-lg mx-2 mb-1"
          onClick={() => {
            navigate("/contactus");
            setProfileOpen(false);
          }}
        >
          <MessageSquare className="h-4 w-4 mr-3 text-secondary" />
          <span className="font-medium">Contact</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700/60 mx-2 my-2" />
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 py-3 px-4 rounded-lg mx-2 mb-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
