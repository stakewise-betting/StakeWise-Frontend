import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaHome, FaCalendarAlt, FaPoll, FaBell, FaBars } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import { ButtonOutline } from "../Buttons/Buttons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for testing notifications
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const navigate = useNavigate();

  // WebSocket State and Ref - Explicitly typed ref
  const [notifications, setNotifications] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      ws.current = new WebSocket("ws://localhost:5000"); // Connect to WebSocket server

      ws.current.onopen = () => {
        console.log("WebSocket connected in Navbar");
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected in Navbar");
      };

      ws.current.onmessage = (event) => {
        console.log("WebSocket message received:", event);
        try {
          const message = JSON.parse(event.data);
          console.log("Parsed WebSocket message:", message);
          if (message.type === "notification") {
            setNotifications((prevNotifications) => [
              message.message,
              ...prevNotifications,
            ]);
          } else if (message.type === "newEvent") {
            // Handle 'newEvent' type
            const newEventNotificationMessage = message.notificationMessage; // Access notificationMessage from message
            setNotifications((prevNotifications) => [
              newEventNotificationMessage,
              ...prevNotifications,
            ]);
            // You can also store message.eventData if you want to display more details in the notification dropdown later
          } else {
            console.log("Received unknown message type:", message);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error, event.data);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.close();
        }
      };
    } else {
      setNotifications([]);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    }
  }, [isLoggedIn]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfilePopupOpen(false);
    setNotificationPanelOpen(false);
  };

  const commonLinks = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/upcoming", label: "Upcoming Events", icon: <FaCalendarAlt /> },
    { to: "/results", label: "Results", icon: <FaPoll /> },
  ];

  const loggedInLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <FaPoll /> },
  ];

  return (
    <nav className="bg-primary px-4 py-3 z-[1000] relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8" />
          <Link to="/" className="text-accent font-saira-stencil text-[30px]">
            STAKEWISE
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {[...commonLinks, ...(isLoggedIn ? loggedInLinks : [])].map(
            (link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center space-x-2 text-sub hover:text-secondary transition-all duration-700 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[3px] after:bg-secondary hover:after:w-full after:transition-all ${
                    isActive ? "text-secondary after:w-full" : ""
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            )
          )}
        </div>

        {/* Right Section (Login/Signup or Profile Section) */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <div className="flex flex-col items-center text-sub font-normal">
                <div className="text-green">$0.00</div>
                <div>Cash</div>
              </div>

              <button
                className="text-sub bg-transparent border border-secondary py-1 px-6 rounded-full hover:text-white hover:bg-secondary transition-all duration-300"
                onClick={() => alert("Deposit clicked!")}
              >
                Deposit
              </button>

              <button
                className="relative text-accent text-2xl hover:text-secondary transition-all duration-300"
                onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {notifications.length}
                  </span>
                )}
              </button>
              {notificationPanelOpen && (
                <div className="absolute right-0 mt-6 w-64 bg-primary border border-secondary rounded-lg shadow-lg z-[1000]">
                  <div className="p-4 text-accent font-bold">Notifications</div>
                  <ul>
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-secondary hover:text-white"
                        >
                          {notification}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">
                        No new notifications
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <div className="relative">
                <button
                  className="w-12 h-12 rounded-full overflow-hidden"
                  onClick={() => setProfilePopupOpen(!profilePopupOpen)}
                >
                  <img
                    src="https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/1d1de2db7e719dfdc2fd999d7a01df55.jpeg"
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
                {profilePopupOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-primary border border-secondary rounded-lg shadow-lg z-[1000]">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-accent hover:bg-secondary hover:text-white transition-all duration-300"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/watchlist"
                      className="block px-4 py-2 text-accent hover:bg-secondary hover:text-white transition-all duration-300"
                    >
                      Watchlist
                    </Link>
                    <button
                      onClick={toggleDarkMode}
                      className="block w-full text-left px-4 py-2 text-accent hover:bg-secondary hover:text-white transition-all duration-300"
                    >
                      Dark Mode
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-accent hover:bg-secondary hover:text-white transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <ButtonOutline
                onClick={handleLogin}
                className="text-sub border border-secondary hover:text-white hover:bg-secondary transition-all duration-300 py-0.5 px-6 rounded-full"
              >
                Login
              </ButtonOutline>

              <ButtonOutline
                onClick={() => navigate("/signup")}
                className="text-sub bg-transparent border border-secondary py-0.5 px-6 rounded-full hover:text-white hover:bg-secondary transition-all duration-300"
              >
                Sign Up
              </ButtonOutline>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button
            className="text-accent text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-4 w-48 bg-primary border border-secondary rounded-lg shadow-lg z-[1000]">
              {[...commonLinks, ...(isLoggedIn ? loggedInLinks : [])].map(
                (link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 text-accent hover:bg-secondary hover:text-white transition-all duration-300"
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </Link>
                )
              )}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-6 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                  <button
                    onClick={handleLogin}
                    className="px-6 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
                  >
                    Login
                  </button>
                </>
              )}
              <div className="flex items-center justify-between px-4 py-2 text-accent">
                <span>Dark Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-12 h-6 bg-gray-300 rounded-full ${
                    isDarkMode ? "bg-secondary" : ""
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      isDarkMode ? "transform translate-x-6" : ""
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
