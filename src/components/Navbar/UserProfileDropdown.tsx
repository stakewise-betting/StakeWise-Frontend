// src/components/navbar/UserProfileDropdown.tsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ChevronDown, Moon, LogOut, Eye, BarChart3 } from "lucide-react"; // Using lucide-react icons
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
        <DropdownMenu onOpenChange={setProfileOpen} open={profileOpen}>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1 rounded-full p-1 hover:bg-gray-700 transition"> {/* Adjusted button style to match My-Nav Bar */}
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">
                        {userData?.picture ? (
                            <img
                                key={picture}
                                src={picture}
                                alt="User profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : userData?.fname ? (
                            <div className="w-full h-full rounded-full flex items-center justify-center bg-[#b4b11e] text-[#1a1a2e]">
                                {userData.fname[0].toUpperCase()}
                            </div>
                        ) : userData?.walletAddress ? (
                            <img
                                src={MetamaskLogo}
                                alt="MetaMask Logo"
                                className="w-3/4 h-3/4 object-contain rounded-full"
                            />
                        ) : (
                            <User className="h-4 w-4" />
                        )}
                    </div>
                    <ChevronDown className={`h-6 w-6 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1C1C27] text-white border-gray-700"> {/* Adjusted dropdown style to match My-Nav Bar */}
                <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                    }}
                >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        navigate("/watchlist");
                        setProfileOpen(false);
                    }}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Watch List
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        navigate("/dashboard");
                        setProfileOpen(false);
                    }}
                >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleDarkMode()}
                >
                    <Moon className="h-4 w-4 mr-2" />
                    {isDarkMode ? "Light" : "Dark"} Mode
                    <div className={`ml-auto w-8 h-4 rounded-full ${isDarkMode ? "bg-orange-500" : "bg-gray-600"} relative`}>
                        <div
                            className={`absolute top-0.5 ${isDarkMode ? "right-0.5" : "left-0.5"} w-3 h-3 bg-white rounded-full transition-all`}
                        ></div>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#8488AC]" />
                <DropdownMenuItem
                    className="flex items-center cursor-pointer text-red-400"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserProfileDropdown;
