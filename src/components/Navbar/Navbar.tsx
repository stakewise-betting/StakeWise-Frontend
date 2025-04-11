import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  FaHome,
  FaCalendarAlt,
  FaPoll,
  FaBell,
  FaBars,
  FaWallet,
  FaUserCircle, // Added for default icon
} from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/images/logo.png"; // Ensure this path is correct
import { ButtonOutline } from "../Buttons/Buttons"; // Ensure this path is correct
import Web3 from "web3";
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg"; // Ensure this path is correct

// Define an interface for Notification object
interface Notification {
  id: string;
  message: string;
  notificationImageURL?: string;
  read: boolean;
  timestamp: number;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  // Add null checks for context values
  if (!context) {
    // Handle the case where context is null, maybe return a loading indicator or null
    console.error("AppContext is null");
    return null; // Or some fallback UI
  }

  const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
    context;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Add logic to actually toggle dark mode if needed
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [walletConnected, setWalletConnected] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [picture, setPicture] = useState(userData?.picture || "");
  const ws = useRef<WebSocket | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // --- Close dropdowns when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Function to mark all notifications as read (using API if available, otherwise local)
  const markAllAsRead = async () => {
    // Optimistic UI update
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    // Optional: Send request to backend to mark all as read
    if (isLoggedin && userData?.id) {
      try {
        await axios.post(
          `${backendUrl}/api/notifications/read-all`,
          {},
          {
            withCredentials: true,
            headers: { "user-id": userData.id }, // Ensure backend expects this header
          }
        );
        // console.log("Marked all notifications as read on backend.");
      } catch (error) {
        console.error("Error marking notifications as read on backend:", error);
        // Optionally revert the optimistic update or show an error toast
        toast.error("Failed to sync read status with server.");
        // Re-fetch to get the correct state if the API call failed
        // fetchNotifications();
      }
    }
  };

  // Mark notifications as read when panel is opened
  useEffect(() => {
    if (notificationsOpen && unreadCount > 0) {
      // Maybe add a small delay before marking as read, or mark on close?
      markAllAsRead();
    }
  }, [notificationsOpen]); // Dependency on unreadCount removed to avoid loop if API call fails

  // --- Fetch initial notifications ---
  const fetchNotifications = async () => {
    if (!isLoggedin || !userData?.id) {
      console.log("User not logged in or no ID, skipping notification fetch.");
      setNotifications([]); // Clear notifications if user logs out
      return;
    }

    try {
      console.log(`Fetching notifications for user ID: ${userData.id}`);
      const { data } = await axios.get<{ notifications: any[] }>(
        `${backendUrl}/api/notifications`,
        {
          withCredentials: true,
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            "user-id": userData.id, // Send user ID in header
          },
          // No need for params if using header, unless backend requires both
          // params: { userId: userData.id }
        }
      );

      console.log("Notifications response:", data);

      if (data.notifications && Array.isArray(data.notifications)) {
        const formattedNotifications = data.notifications
          .map((n: any) => ({
            id: n._id || `temp-${Date.now()}-${Math.random()}`, // Ensure unique ID
            message: n.message || "Notification content missing.", // Provide clearer default
            notificationImageURL: n.image || n.notificationImageURL, // Check both possible fields
            timestamp: n.createdAt
              ? new Date(n.createdAt).getTime()
              : Date.now(),
            read: !!n.read, // Ensure boolean
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first

        setNotifications(formattedNotifications);
      } else {
        console.log("No notifications found or invalid format:", data);
        setNotifications([]);
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response error status:", error.response.status);
        // Handle specific statuses like 401/403 (Unauthorized) perhaps by logging out
        if (error.response.status === 401 || error.response.status === 403) {
          toast.error("Authentication error fetching notifications.");
          // handleLogout(); // Consider logging out if auth fails
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Network error fetching notifications.");
      } else {
        console.error("Request setup error:", error.message);
      }
      setNotifications([]); // Clear notifications on error
    }
  };

  // Load initial notifications on login/user change
  useEffect(() => {
    fetchNotifications();
  }, [isLoggedin, userData?.id]); // Rerun if user logs in/out or ID changes

  // --- WebSocket connection ---
  useEffect(() => {
    if (!isLoggedin || !userData?.id) {
      // Close existing connection if user logs out
      if (ws.current) {
        console.log(
          "Closing WebSocket connection due to logout or missing user ID."
        );
        ws.current.close();
        ws.current = null;
      }
      return;
    }

    // Avoid reconnecting if already connected
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected.");
      return;
    }

    const websocketUrl =
      import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:5000";
    const wsUrl = `${websocketUrl}?userId=${userData.id}`; // Pass userId for targeted messages
    console.log("Attempting to connect to WebSocket:", wsUrl);

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected successfully");
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        // Ensure the message is intended for this user if backend doesn't filter
        // if (message.targetUserId && message.targetUserId !== userData.id) return;

        if (message.type === "notification" || message.type === "newEvent") {
          const newNotification: Notification = {
            id:
              message.id || message._id || `ws-${Date.now()}-${Math.random()}`, // Use provided ID or generate
            message:
              message.message ||
              message.notificationMessage ||
              "New notification received.", // Clearer default
            notificationImageURL: message.image || message.notificationImageURL,
            read: false, // New notifications are always unread
            timestamp:
              message.timestamp || message.createdAt
                ? new Date(message.createdAt || message.timestamp).getTime()
                : Date.now(),
          };

          // Add to the beginning of the list and prevent duplicates by ID
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotification.id)) {
              return prev; // Avoid adding duplicate if message received again
            }
            return [newNotification, ...prev];
          });

          // Show toast for new notification
          toast.info(newNotification.message, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        console.error("Received data:", event.data);
      }
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      ws.current = null; // Clear ref on close
      // Optional: Implement reconnect logic here if needed
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket connection error.");
      ws.current = null; // Clear ref on error
    };

    // Cleanup function
    return () => {
      if (ws.current) {
        console.log(
          "Closing WebSocket connection on component unmount or dependency change."
        );
        ws.current.onclose = null; // Prevent close handler from running during manual close
        ws.current.onerror = null;
        ws.current.close();
        ws.current = null;
      }
    };
  }, [isLoggedin, userData?.id]); // Reconnect if login status or user ID changes

  // --- Wallet Connection & Balance ---
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = (await window.ethereum.request({
            method: "eth_accounts",
          })) as string[];

          if (accounts && accounts.length > 0) {
            setWalletConnected(true);
            const balanceWei = await web3.eth.getBalance(accounts[0]);
            const balanceEth = web3.utils.fromWei(balanceWei, "ether");
            setWalletBalance(parseFloat(balanceEth).toFixed(4));
            // Optionally update wallet address in userData if needed/possible
            // if (userData && !userData.walletAddress) {
            //    // setUserData({...userData, walletAddress: accounts[0] }); // Be careful with context updates here
            // }
          } else {
            setWalletConnected(false);
            setWalletBalance("0.00");
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setWalletConnected(false);
          setWalletBalance("0.00");
        }
      } else {
        // MetaMask not installed
        setWalletConnected(false);
        setWalletBalance("0.00");
      }
    };

    checkWalletConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      console.log("Wallet accounts changed:", accounts);
      checkWalletConnection(); // Re-check connection and balance
    };

    if (window.ethereum) {
      // Use the recommended way to add listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Cleanup listener
    return () => {
      if (window.ethereum?.removeListener) {
        // Check if removeListener exists
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [userData]); // Rerun if userData changes (e.g., after login)

  // --- Fetch ETH Price ---
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data?.ethereum?.usd) {
          setEthPrice(data.ethereum.usd);
        } else {
          console.warn("Could not extract ETH price from API response:", data);
        }
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        // Don't reset price to 0 on temporary fetch error, keep the last known value
      }
    };

    fetchEthPrice(); // Initial fetch
    const priceInterval = setInterval(fetchEthPrice, 60000); // Refresh every minute

    return () => clearInterval(priceInterval); // Cleanup interval
  }, []);

  // Calculate USD value
  const usdValue = (parseFloat(walletBalance) * ethPrice).toFixed(2);

  // --- Connect Wallet Function ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Balance and connection state will update via the 'accountsChanged' listener effect
        toast.success("Wallet connected successfully!");
      } catch (error: any) {
        console.error("Error connecting to wallet:", error);
        if (error.code === 4001) {
          toast.info("Wallet connection request rejected.");
        } else {
          toast.error("Failed to connect wallet. See console for details.");
        }
      }
    } else {
      toast.error(
        "MetaMask is not installed. Please install it to connect your wallet."
      );
      // Optionally provide a link to MetaMask website
    }
  };

  // --- User Actions ---
  const handleVerification = async () => {
    // Close profile dropdown first
    setProfileOpen(false);
    try {
      // Show loading toast
      const loadingToast = toast.loading("Sending verification email...");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/sendVerifyOtp`,
        {},
        { withCredentials: true }
      );
      toast.dismiss(loadingToast); // Dismiss loading toast

      if (data.success) {
        toast.success("Verification email sent! Please check your inbox.");
        navigate("/email-verify"); // Navigate to verification page
      } else {
        toast.error(data.message || "Failed to send verification email.");
      }
    } catch (error: any) {
      toast.dismiss(); // Ensure loading toast is dismissed on error
      console.error("Verification email sending error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during verification."
      );
    }
  };

  const handleLogout = async () => {
    // Close profile dropdown first
    setProfileOpen(false);
    try {
      const loadingToast = toast.loading("Logging out...");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.dismiss(loadingToast);

      if (data.success) {
        setUserData(null);
        setIsLoggedin(false);
        setWalletConnected(false); // Reset wallet state on logout
        setWalletBalance("0.00");
        setNotifications([]); // Clear notifications
        if (ws.current) {
          // Close WebSocket on logout
          ws.current.close();
          ws.current = null;
        }
        toast.success("Logged out successfully!");
        navigate("/"); // Navigate to home page
      } else {
        toast.error(data.message || "Logout failed.");
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Logout error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during logout."
      );
      // Force state clear even if API fails?
      // setUserData(null);
      // setIsLoggedin(false);
      // navigate("/");
    }
  };

  // --- Update Profile Picture State ---
  // This effect ensures the 'picture' state updates if userData changes AFTER initial load
  useEffect(() => {
    setPicture(userData?.picture || "");
  }, [userData?.picture]);

  // --- Navigation Links ---
  const navLinks = [
    { to: "/home", label: "Home", icon: <FaHome /> },
    { to: "/upcoming", label: "Upcoming Events", icon: <FaCalendarAlt /> },
    { to: "/results", label: "Results", icon: <FaPoll /> },
    // Conditionally add Dashboard link if logged in
    ...(isLoggedin
      ? [{ to: "/dashboard", label: "Dashboard", icon: <FaPoll /> }]
      : []),
  ];

  // --- Format Timestamp Helper ---
  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 5) return `just now`;
    if (seconds < 60) return `${seconds} sec ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return `yesterday`;
    if (days < 7) return `${days} days ago`;

    // For older dates, show the actual date
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    // Or full date: return date.toLocaleDateString();
  };

  // --- Render ---
  return (
    <nav className="bg-primary px-4 py-3 sticky top-0 z-50 shadow-lg text-white">
      {" "}
      {/* Assuming white text on primary bg */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Branding */}
        <div className="flex items-center space-x-3">
          {logo && <img src={logo} alt="Logo" className="h-9 w-auto" />}{" "}
          {/* Conditionally render logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="text-2xl font-bold text-accent hover:text-secondary transition duration-200"
          >
            STAKEWISE
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Main Links */}
          <div className="flex space-x-6">
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => window.scrollTo(0, 0)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium
                  ${
                    isActive
                      ? "text-secondary bg-secondary/10" // Active link style
                      : "text-gray-300 hover:text-white hover:bg-white/10" // Inactive link style (adjust text-sub if needed)
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Section (Logged In) */}
          {isLoggedin && userData ? (
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Wallet Display & Deposit Button */}
              {walletConnected ? (
                <div className="flex items-center space-x-3 bg-black/20 px-3 py-1.5 rounded-lg">
                  <FaWallet className="text-green-400 text-lg" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs text-gray-400">Cash</span>
                    <span className="font-semibold text-green-400 text-sm">
                      ${usdValue}
                    </span>
                  </div>
                  <ButtonOutline
                    onClick={() => navigate("/deposit")}
                    small // Use smaller button variant if available
                    className="ml-2" // Add margin if needed
                  >
                    Deposit
                  </ButtonOutline>
                </div>
              ) : (
                // Show Connect Wallet button if logged in but wallet not connected
                <ButtonOutline onClick={connectWallet} small>
                  Connect Wallet
                </ButtonOutline>
              )}

              {/* Notifications Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Toggle Notifications"
                  className="text-2xl text-gray-300 hover:text-white transition duration-200 relative"
                >
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-primary">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    {" "}
                    {/* Darker dropdown */}
                    <div className="p-3 flex justify-between items-center border-b border-gray-700">
                      <span className="font-semibold text-white">
                        Notifications
                      </span>
                      {notifications.some((n) => !n.read) && ( // Show only if there are unread messages
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent closing dropdown
                            markAllAsRead();
                          }}
                          className="text-xs text-blue-400 hover:underline"
                          disabled={unreadCount === 0} // Disable if no unread
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                      {" "}
                      {/* Custom scrollbar */}
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 flex items-start space-x-3 transition-colors duration-150 border-b border-gray-700/50 ${
                              !n.read
                                ? "bg-blue-900/20"
                                : "hover:bg-gray-700/50" // Highlight unread, hover effect
                            }`}
                          >
                            {/* Icon/Image */}
                            <div className="flex-shrink-0 w-8 h-8 mt-0.5">
                              {n.notificationImageURL ? (
                                <img
                                  src={n.notificationImageURL}
                                  className="w-full h-full rounded-full object-cover"
                                  alt="Notification source"
                                  onError={(e) => (e.currentTarget.src = logo)} // Fallback image on error
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                                  <FaBell className="text-gray-300 text-sm" />
                                </div>
                              )}
                            </div>
                            {/* Message and Timestamp */}
                            <div className="flex-1 min-w-0">
                              {" "}
                              {/* min-w-0 prevents overflow issues */}
                              <div className="text-sm text-gray-100 leading-snug">
                                {n.message}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatTimestamp(n.timestamp)}
                              </div>
                            </div>
                            {/* Unread Indicator */}
                            {!n.read && (
                              <span
                                className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"
                                aria-label="Unread"
                                title="Unread"
                              ></span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-400 text-sm">
                          You're all caught up!
                        </div>
                      )}
                    </div>
                    {/* Optional: View All link */}
                    {/* <div className="p-2 text-center border-t border-gray-700">
                        <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-sm text-blue-400 hover:underline">
                            View All
                        </Link>
                     </div> */}
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Toggle User Menu"
                  className="flex items-center space-x-2 group transition duration-200"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-bold overflow-hidden border-2 border-transparent group-hover:border-accent transition">
                    {picture ? (
                      <img
                        key={picture} // Re-render if picture changes
                        src={picture}
                        alt="User profile"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        } // Hide if image fails
                      />
                    ) : // Display initials or icon if picture fails or isn't set
                    userData.fname ? (
                      <span className="text-lg">
                        {userData.fname[0].toUpperCase()}
                      </span>
                    ) : userData.walletAddress ? (
                      <img
                        src={MetamaskLogo} // Specific logo for MetaMask user without profile pic
                        alt="MetaMask User"
                        className="w-3/4 h-3/4 object-contain p-0.5" // Adjust padding/size as needed
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-gray-400" /> // Generic fallback
                    )}
                    {/* Fallback if image failed and other conditions not met */}
                    {!picture && !userData.fname && !userData.walletAddress && (
                      <FaUserCircle className="w-full h-full text-gray-400" />
                    )}
                  </div>
                  {/* Optional: Show name next to avatar */}
                  {/* <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden lg:block">
                      {userData.fname || userData.walletAddress?.slice(0, 6)}
                   </span>
                   <FaCaretDown className="text-gray-400 group-hover:text-white hidden lg:block" /> */}
                </button>

                {/* Profile Dropdown Content */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
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
                        Profile Settings
                      </Link>
                      <Link
                        to="/watchlist"
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        My Watchlist
                      </Link>
                      {/* Dark Mode Toggle - Implement actual logic */}
                      <button
                        onClick={() => {
                          setIsDarkMode(!isDarkMode);
                          // Add logic here to toggle dark mode class on body/html
                          // e.g., document.documentElement.classList.toggle('dark');
                          setProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        Toggle {isDarkMode ? "Light" : "Dark"} Mode
                      </button>
                      {/* Verification Button */}
                      {!userData.isAccountVerified && (
                        <button
                          onClick={handleVerification} // Use the function here
                          className="block w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-900/30 transition-colors duration-150"
                        >
                          Verify Account
                        </button>
                      )}
                      <div className="my-1 border-t border-gray-700"></div>{" "}
                      {/* Separator */}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors duration-150"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // User Section (Logged Out)
            <div className="flex items-center space-x-3">
              {/* Connect Wallet button visible even when logged out */}
              {/* Decide if you want this - maybe only show after login? */}
              {/* <ButtonOutline onClick={connectWallet} small>
                   Connect Wallet
                 </ButtonOutline> */}
              <ButtonOutline
                onClick={() => navigate("/login")}
                small
                className="text-sm" // Ensure text size is appropriate
              >
                Login
              </ButtonOutline>
              <ButtonOutline
                onClick={() => navigate("/signup")}
                variant="secondary" // Example: Use a different style for Sign Up
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
          {/* Notification bell for mobile when logged in */}
          {isLoggedin && (
            <div className="relative">
              <Link
                to="/notifications"
                className="text-2xl text-gray-300 hover:text-white transition duration-200 relative"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-primary">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            </div>
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
      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 w-full bg-primary border-t border-gray-700 shadow-lg">
          <div className="p-4 space-y-3 flex flex-col">
            {/* Wallet Info & Deposit/Connect (Mobile) */}
            {isLoggedin &&
              (walletConnected ? (
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg mb-2">
                  <div className="flex items-center space-x-2">
                    <FaWallet className="text-green-400" />
                    <div>
                      <div className="text-xs text-gray-400">Balance</div>
                      <div className="font-medium text-green-400">
                        ${usdValue}
                      </div>
                    </div>
                  </div>
                  <ButtonOutline
                    onClick={() => {
                      navigate("/deposit");
                      setMenuOpen(false);
                    }}
                    small
                  >
                    Deposit
                  </ButtonOutline>
                </div>
              ) : (
                <ButtonOutline
                  fullWidth
                  onClick={() => {
                    connectWallet();
                    setMenuOpen(false);
                  }}
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
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 font-medium
                  ${
                    isActive
                      ? "bg-secondary/10 text-secondary"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}

            {/* Mobile User Actions */}
            {isLoggedin && userData ? (
              <div className="pt-3 border-t border-gray-700 space-y-2">
                {/* Mobile Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUserCircle />
                  <span>Profile Settings</span>
                </Link>

                {/* Mobile Watchlist Link */}
                <Link
                  to="/watchlist"
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {/* Replace FaPoll with a more appropriate icon like FaStar if needed */}
                  <FaPoll />
                  <span>My Watchlist</span>
                </Link>

                {/* Mobile Notifications Link (already visible near hamburger) - redundant here? */}
                {/* <Link
                    to="/notifications"
                    className="flex items-center justify-between w-full p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                     <div className="flex items-center space-x-3">
                       <FaBell />
                       <span>Notifications</span>
                     </div>
                     {unreadCount > 0 && (
                       <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                         {unreadCount > 9 ? "9+" : unreadCount}
                       </span>
                     )}
                 </Link> */}

                {/* Verify Account Button (Mobile) */}
                {!userData.isAccountVerified && (
                  <button
                    onClick={() => {
                      handleVerification();
                      setMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg text-yellow-400 hover:bg-yellow-900/30 transition-colors duration-150"
                  >
                    {/* Add an icon e.g. <FaExclamationTriangle /> */}
                    <span>Verify Account</span>
                  </button>
                )}

                {/* Mobile Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors duration-150"
                >
                  {/* Add an icon e.g. <FaSignOutAlt /> */}
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Mobile Login/Signup Buttons
              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-700">
                <ButtonOutline
                  fullWidth
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </ButtonOutline>
                <ButtonOutline
                  fullWidth
                  variant="secondary"
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                >
                  Sign Up
                </ButtonOutline>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
