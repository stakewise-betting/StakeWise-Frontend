import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaHome, FaCalendarAlt, FaPoll, FaBell, FaBars } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import { ButtonOutline } from "../Buttons/Buttons";

// Define an interface for Notification object
interface Notification {
  message: string;
  notificationImageURL?: string; // Optional as it might not always be present
}

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
    useContext(AppContext)!;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ws = useRef<WebSocket | null>(null);

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
              message: message.message || message.notificationMessage,
              notificationImageURL: message.notificationImageURL,
            },
            ...prev,
          ]);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    return () => ws.current?.close();
  }, [isLoggedin]);

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
      data.success ? navigate("/email-verify") : toast.error(data.message);
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
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="text-2xl text-sub hover:text-secondary relative"
                >
                  <FaBell />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-primary border border-secondary rounded-lg shadow-xl">
                    <div className="p-4 font-bold border-b border-secondary">
                      Notifications
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((n, i) => (
                        <div
                          key={i}
                          className="p-4 flex items-center space-x-3 hover:bg-secondary/10"
                        >
                          {n.notificationImageURL && (
                            <img
                              src={n.notificationImageURL}
                              className="w-8 h-8 rounded-full"
                              alt="Notification"
                            />
                          )}
                          <span>{n.message}</span>
                        </div>
                      ))}
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
                    {userData?.name[0].toUpperCase()}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-primary border border-secondary rounded-lg shadow-xl">
                    <div className="p-4 border-b border-secondary">
                      <div className="font-bold">{userData?.name}</div>
                      <div className="text-sm text-sub">{userData?.email}</div>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 rounded hover:bg-secondary/10"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/watchlist"
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
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({
                  isActive,
                }) => `flex items-center space-x-2 p-3 rounded-lg
                  ${isActive ? "bg-secondary/10 text-secondary" : "text-sub"}`}
                onClick={() => setMenuOpen(false)}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}

            {isLoggedin ? (
              <div className="pt-4 border-t border-secondary">
                <button
                  onClick={handleLogout}
                  className="w-full p-3 text-left text-red-500 hover:bg-red-500/10 rounded-lg"
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
