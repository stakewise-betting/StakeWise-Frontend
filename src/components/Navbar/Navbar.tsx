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
} from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/images/logo.png";
import { ButtonOutline } from "../Buttons/Buttons";
import Web3 from "web3";
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg";

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
  const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
    useContext(AppContext)!;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [walletConnected, setWalletConnected] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [picture, setPicture] = useState(userData?.picture || "");
  const ws = useRef<WebSocket | null>(null);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Mark notifications as read when panel is opened
  useEffect(() => {
    if (notificationsOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [notificationsOpen]);

  // Load initial notifications from API
  useEffect(() => {
    if (isLoggedin && userData?.id) {
      fetchNotifications();
    }
  }, [isLoggedin, userData]);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      // Check if the user is properly authenticated before making the request
      if (!userData?.id) {
        console.log(
          "User not authenticated or missing ID, skipping notification fetch"
        );
        return;
      }

      console.log(
        "Fetching notifications for user ID:",
        userData.id,
        "from:",
        `${backendUrl}/api/notifications`
      );

      // Explicitly pass the user ID both in query params and headers for robustness
      const { data } = await axios.get(`${backendUrl}/api/notifications`, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "user-id": userData.id, // Add user ID in header
        },
        params: {
          userId: userData.id, // Also add as query parameter
        },
      });

      console.log("Notifications response:", data);

      if (data.notifications && Array.isArray(data.notifications)) {
        const formattedNotifications = data.notifications.map((n: any) => ({
          id: n._id || `temp-${Date.now()}`,
          message: n.message || "New notification",
          notificationImageURL: n.image,
          timestamp: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
          read: n.read ? true : false, // Handle different read status formats
        }));

        setNotifications(formattedNotifications);
      } else {
        console.log(
          "No notifications found in response or invalid format:",
          data
        );
        setNotifications([]);
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
    }
  };
  // WebSocket connection
  // WebSocket connection in Navbar.tsx
  useEffect(() => {
    if (!isLoggedin || !userData?.id) return;

    const websocketUrl =
      import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:5000";

    // Include user ID in WebSocket connection URL
    const wsUrl = `${websocketUrl}?userId=${userData.id}`;
    console.log("Connecting to WebSocket:", wsUrl);

    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        if (message.type === "notification" || message.type === "newEvent") {
          // Add new notification and mark as unread
          const newNotification = {
            id: message.id || Date.now().toString(),
            message:
              message.message ||
              message.notificationMessage ||
              "New notification",
            notificationImageURL: message.notificationImageURL || message.image,
            read: false, // Mark new notifications as unread
            timestamp: message.timestamp || Date.now(),
          };

          setNotifications((prev) => [newNotification, ...prev]);

          // Show toast for new notification
          toast.info(newNotification.message, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.current.onopen = () => {
      console.log("WebSocket connected successfully");
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        console.log("Closing WebSocket connection");
        ws.current.close();
      }
    };
  }, [isLoggedin, userData]);

  // Check wallet connection and get balance
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            setWalletConnected(true);
            const balanceWei = await web3.eth.getBalance(accounts[0]);
            const balanceEth = web3.utils.fromWei(balanceWei, "ether");
            setWalletBalance(parseFloat(balanceEth).toFixed(4));
          } else {
            setWalletConnected(false);
            setWalletBalance("0.00");
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setWalletConnected(false);
        }
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", checkWalletConnection);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          checkWalletConnection
        );
      }
    };
  }, []);

  // Fetch ETH price from CoinGecko API
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
        if (data && data.ethereum) {
          setEthPrice(data.ethereum.usd);
        }
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };

    fetchEthPrice();
    // Set up interval to refresh price every minute
    const priceInterval = setInterval(fetchEthPrice, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(priceInterval);
  }, []);

  // Calculate USD value
  const usdValue = (parseFloat(walletBalance) * ethPrice).toFixed(2);

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Balance will be updated via the accountsChanged event listener
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        toast.error("Failed to connect wallet");
      }
    } else {
      toast.error("MetaMask is not installed");
    }
  };

  // User actions
  const handleVerification = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/sendVerifyOtp`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setUserData(null);
        setIsLoggedin(false);
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    if (userData?.picture) {
      setTimeout(() => {
        setPicture(userData.picture);
      }, 100); // Short delay to allow React to process updates
    }
  }, [userData]);

  // Navigation links
  const navLinks = [
    { to: "/home", label: "Home", icon: <FaHome /> },
    { to: "/upcoming", label: "Upcoming Events", icon: <FaCalendarAlt /> },
    { to: "/results", label: "Results", icon: <FaPoll /> },
    ...(isLoggedin
      ? [{ to: "/dashboard", label: "Dashboard", icon: <FaPoll /> }]
      : []),
  ];

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds} sec ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <nav className="bg-primary px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Branding */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-9 w-auto" />
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="text-2xl font-bold text-accent hover:text-secondary transition"
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
                className={({
                  isActive,
                }) => `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                  ${
                    isActive
                      ? "text-secondary bg-secondary/10"
                      : "text-sub hover:bg-secondary/10"
                  }`}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Section */}
          {isLoggedin ? (
            <div className="flex items-center space-x-6">
              {/* Wallet Balance Display */}
              {walletConnected && (
                <div className="flex items-center space-x-2 text-white">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-white/70">Cash</span>
                    <span className="font-medium text-green-400">
                      ${usdValue}
                    </span>
                  </div>
                  <ButtonOutline onClick={() => navigate("/deposit")}>
                    Deposit
                  </ButtonOutline>
                </div>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="text-2xl text-sub hover:text-secondary relative"
                >
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-primary border border-secondary rounded-lg shadow-xl">
                    <div className="p-4 flex justify-between items-center border-b border-secondary">
                      <span className="font-bold">Notifications</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-secondary hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 flex items-start space-x-3 hover:bg-secondary/10 ${
                              !n.read ? "bg-secondary/5" : ""
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {n.notificationImageURL ? (
                                <img
                                  src={n.notificationImageURL}
                                  className="w-8 h-8 rounded-full"
                                  alt="Notification"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center">
                                  <FaBell className="text-white text-xs" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm">{n.message}</div>
                              <div className="text-xs text-sub mt-1">
                                {formatTimestamp(n.timestamp)}
                              </div>
                            </div>
                            {!n.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sub">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg">
                    {userData?.picture ? (
                      <img
                        key={picture}
                        src={picture}
                        alt="User profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : userData?.fname ? (
                      userData.fname[0].toUpperCase()
                    ) : userData?.walletAddress ? (
                      <img
                        src={MetamaskLogo}
                        alt="MetaMask Logo"
                        className="w-3/4 h-3/4 object-contain rounded-full"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-primary border border-secondary rounded-lg shadow-xl">
                    <div className="p-4 border-b border-secondary">
                      <div className="font-bold">
                        {userData?.fname ||
                          (userData?.walletAddress ? "MetaMask User" : "User")}
                      </div>
                      <div className="text-sm text-sub">
                        {userData?.email ||
                          (userData?.walletAddress
                            ? userData.walletAddress.slice(0, 6) +
                              "..." +
                              userData.walletAddress.slice(-4)
                            : "")}
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setProfileOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-secondary/10"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/watchlist"
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setProfileOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-secondary/10"
                      >
                        Watchlist
                      </Link>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-full text-left px-4 py-2 rounded hover:bg-secondary/10"
                      >
                        {isDarkMode ? "Light" : "Dark"} Mode
                      </button>
                      {!userData?.isAccountVerified && (
                        <button
                          onClick={handleVerification}
                          className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500/10"
                        >
                          Verify Account
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500/10"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              {/* Removed Connect Wallet here for not logged in state on desktop */}
              <ButtonOutline onClick={() => navigate("/login")}>
                Login
              </ButtonOutline>
              <ButtonOutline onClick={() => navigate("/signup")}>
                Sign Up
              </ButtonOutline>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-sub"
          >
            <FaBars />
          </button>
        </div>
      </div>
      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary border-t border-secondary">
          <div className="p-4 space-y-4">
            {/* Wallet Balance for Mobile - Conditionally render when logged in and wallet connected */}
            {isLoggedin && walletConnected && (
              <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaWallet className="text-secondary" />
                  <div>
                    <div className="text-xs text-sub">Balance</div>
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
            )}

            {/* Conditionally render Connect Wallet in mobile menu when logged in but wallet not connected */}
            {isLoggedin && !walletConnected && (
              <ButtonOutline fullWidth onClick={connectWallet} className="mb-4">
                Connect Wallet
              </ButtonOutline>
            )}

            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-3 rounded-lg
            ${isActive ? "bg-secondary/10 text-secondary" : "text-sub"}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}

            {isLoggedin ? (
              <div className="pt-4 border-t border-secondary">
                {/* Conditionally render Deposit button when logged in but wallet not connected in mobile menu */}
                {!walletConnected && (
                  <ButtonOutline
                    fullWidth
                    onClick={() => {
                      navigate("/deposit");
                      setMenuOpen(false);
                    }}
                  >
                    Deposit
                  </ButtonOutline>
                )}

                <Link
                  to="/notifications"
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-secondary/10 mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FaBell />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full p-3 text-left text-red-500 hover:bg-red-500/10 rounded-lg mt-3"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 border-t border-secondary">
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
