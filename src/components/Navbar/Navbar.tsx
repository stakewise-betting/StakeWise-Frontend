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
  id: string; // Added ID for tracking individual notifications
  message: string;
  notificationImageURL?: string;
  read: boolean; // Added read status
  timestamp: number; // Added timestamp for sorting
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

  // WebSocket connection
  useEffect(() => {
    if (!isLoggedin) return;

    const websocketUrl =
      import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:5000";
    ws.current = new WebSocket(websocketUrl);

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "notification" || message.type === "newEvent") {
          setNotifications((prev) => [
            {
              id: Date.now().toString(), // Generate unique ID
              message: message.message || message.notificationMessage,
              notificationImageURL: message.notificationImageURL,
              read: false, // New notifications are unread
              timestamp: Date.now(), // Add timestamp
            },
            ...prev,
          ]);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [isLoggedin]);

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
                      {unreadCount}
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
                            className={`p-4 flex items-center space-x-3 hover:bg-secondary/10 ${
                              !n.read ? "bg-secondary/5" : ""
                            }`}
                          >
                            {n.notificationImageURL && (
                              <img
                                src={n.notificationImageURL}
                                className="w-8 h-8 rounded-full"
                                alt="Notification"
                              />
                            )}
                            <span>{n.message}</span>
                            {!n.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></span>
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
                        onClick={() => window.scrollTo(0, 0)}
                        className="block px-4 py-2 rounded hover:bg-secondary/10"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/watchlist"
                        onClick={() => window.scrollTo(0, 0)}
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
        <div className="md:hidden absolute top-full w-full bg-primary border-t border-secondary">
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
                    </div>{" "}
                    {/* Amount in Green */}
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
