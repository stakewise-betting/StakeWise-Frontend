// // import React, { useState, useEffect, useRef, useContext } from "react";
// // import { useNavigate, NavLink, Link } from "react-router-dom";
// // import "@fortawesome/fontawesome-free/css/all.min.css";
// // import {
// //   FaHome,
// //   FaCalendarAlt,
// //   FaPoll,
// //   FaBell,
// //   FaBars,
// //   FaWallet,
// // } from "react-icons/fa";
// // import { AppContext } from "@/context/AppContext";
// // import { toast } from "react-toastify";
// // import axios from "axios";
// // import logo from "../../assets/images/logo.png";
// // import { ButtonOutline } from "../Buttons/Buttons";
// // import Web3 from "web3";
// // import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg";

// // // Define an interface for Notification object
// // interface Notification {
// //   id: string; // Added ID for tracking individual notifications
// //   message: string;
// //   notificationImageURL?: string;
// //   read: boolean; // Added read status
// //   timestamp: number; // Added timestamp for sorting
// // }

// // const Navbar: React.FC = () => {
// //   const navigate = useNavigate();
// //   const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
// //     useContext(AppContext)!;
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const [isDarkMode, setIsDarkMode] = useState(false);
// //   const [profileOpen, setProfileOpen] = useState(false);
// //   const [notificationsOpen, setNotificationsOpen] = useState(false);
// //   const [notifications, setNotifications] = useState<Notification[]>([]);
// //   const [walletBalance, setWalletBalance] = useState("0.00");
// //   const [walletConnected, setWalletConnected] = useState(false);
// //   const [ethPrice, setEthPrice] = useState(0);
// //   const [picture, setPicture] = useState(userData?.picture || "");
// //   const ws = useRef<WebSocket | null>(null);

// //   // Count unread notifications
// //   const unreadCount = notifications.filter((n) => !n.read).length;

// //   // Function to mark all notifications as read
// //   const markAllAsRead = () => {
// //     setNotifications((prevNotifications) =>
// //       prevNotifications.map((notification) => ({
// //         ...notification,
// //         read: true,
// //       }))
// //     );
// //   };

// //   // Mark notifications as read when panel is opened
// //   useEffect(() => {
// //     if (notificationsOpen && unreadCount > 0) {
// //       markAllAsRead();
// //     }
// //   }, [notificationsOpen]);

// //   // WebSocket connection
// //   useEffect(() => {
// //     if (!isLoggedin) return;

// //     const websocketUrl =
// //       import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:5000";
// //     ws.current = new WebSocket(websocketUrl);

// //     ws.current.onmessage = (event) => {
// //       try {
// //         const message = JSON.parse(event.data);
// //         if (message.type === "notification" || message.type === "newEvent") {
// //           setNotifications((prev) => [
// //             {
// //               id: Date.now().toString(), // Generate unique ID
// //               message: message.message || message.notificationMessage,
// //               notificationImageURL: message.notificationImageURL,
// //               read: false, // New notifications are unread
// //               timestamp: Date.now(), // Add timestamp
// //             },
// //             ...prev,
// //           ]);
// //         }
// //       } catch (error) {
// //         console.error("WebSocket message error:", error);
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("WebSocket disconnected");
// //     };

// //     ws.current.onerror = (error) => {
// //       console.error("WebSocket error:", error);
// //     };

// //     return () => {
// //       if (ws.current) {
// //         ws.current.close();
// //       }
// //     };
// //   }, [isLoggedin]);

// //   // Check wallet connection and get balance
// //   useEffect(() => {
// //     const checkWalletConnection = async () => {
// //       if (window.ethereum) {
// //         try {
// //           const web3 = new Web3(window.ethereum);
// //           const accounts = await window.ethereum.request({
// //             method: "eth_accounts",
// //           });

// //           if (accounts.length > 0) {
// //             setWalletConnected(true);
// //             const balanceWei = await web3.eth.getBalance(accounts[0]);
// //             const balanceEth = web3.utils.fromWei(balanceWei, "ether");
// //             setWalletBalance(parseFloat(balanceEth).toFixed(4));
// //           } else {
// //             setWalletConnected(false);
// //             setWalletBalance("0.00");
// //           }
// //         } catch (error) {
// //           console.error("Error checking wallet connection:", error);
// //           setWalletConnected(false);
// //         }
// //       }
// //     };

// //     checkWalletConnection();

// //     // Listen for account changes
// //     if (window.ethereum) {
// //       window.ethereum.on("accountsChanged", checkWalletConnection);
// //     }

// //     return () => {
// //       if (window.ethereum) {
// //         window.ethereum.removeListener(
// //           "accountsChanged",
// //           checkWalletConnection
// //         );
// //       }
// //     };
// //   }, []);

// //   // Fetch ETH price from CoinGecko API
// //   useEffect(() => {
// //     const fetchEthPrice = async () => {
// //       try {
// //         const response = await fetch(
// //           "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
// //         );
// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         if (data && data.ethereum) {
// //           setEthPrice(data.ethereum.usd);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching ETH price:", error);
// //       }
// //     };

// //     fetchEthPrice();
// //     // Set up interval to refresh price every minute
// //     const priceInterval = setInterval(fetchEthPrice, 60000);

// //     // Clean up interval on component unmount
// //     return () => clearInterval(priceInterval);
// //   }, []);

// //   // Calculate USD value
// //   const usdValue = (parseFloat(walletBalance) * ethPrice).toFixed(2);

// //   // Connect wallet function
// //   const connectWallet = async () => {
// //     if (window.ethereum) {
// //       try {
// //         await window.ethereum.request({ method: "eth_requestAccounts" });
// //         // Balance will be updated via the accountsChanged event listener
// //       } catch (error) {
// //         console.error("Error connecting to wallet:", error);
// //         toast.error("Failed to connect wallet");
// //       }
// //     } else {
// //       toast.error("MetaMask is not installed");
// //     }
// //   };

// //   // User actions

// //   const handleLogout = async () => {
// //     try {
// //       const { data } = await axios.post(
// //         `${backendUrl}/api/auth/logout`,
// //         {},
// //         {
// //           withCredentials: true,
// //         }
// //       );
// //       if (data.success) {
// //         setUserData(null);
// //         setIsLoggedin(false);
// //         navigate("/");
// //       }
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Logout failed");
// //     }
// //   };

// //   useEffect(() => {
// //     if (userData?.picture) {
// //       setTimeout(() => {
// //         setPicture(userData.picture);
// //       }, 100); // Short delay to allow React to process updates
// //     }
// //   }, [userData]);

// //   // Navigation links
// //   const navLinks = [
// //     { to: "/home", label: "Home", icon: <FaHome /> },
// //     { to: "/upcoming", label: "Upcoming Events", icon: <FaCalendarAlt /> },
// //     { to: "/results", label: "Results", icon: <FaPoll /> },
// //     ...(isLoggedin
// //       ? [{ to: "/dashboard", label: "Dashboard", icon: <FaPoll /> }]
// //       : []),
// //   ];

// //   return (
// //     <nav className="bg-primary px-4 py-3 sticky top-0 z-50 shadow-lg">
// //       <div className="max-w-7xl mx-auto flex justify-between items-center">
// //         {/* Branding */}
// //         <div className="flex items-center space-x-3">
// //           <img src={logo} alt="Logo" className="h-9 w-auto" />
// //           <Link
// //             to="/"
// //             onClick={() => window.scrollTo(0, 0)}
// //             className="text-2xl font-bold text-accent hover:text-secondary transition"
// //           >
// //             STAKEWISE
// //           </Link>
// //         </div>

// //         {/* Desktop Navigation */}
// //         <div className="hidden md:flex items-center space-x-8">
// //           {/* Main Links */}
// //           <div className="flex space-x-6">
// //             {navLinks.map(({ to, label, icon }) => (
// //               <NavLink
// //                 key={to}
// //                 to={to}
// //                 onClick={() => window.scrollTo(0, 0)}
// //                 className={({
// //                   isActive,
// //                 }) => `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
// //                   ${
// //                     isActive
// //                       ? "text-secondary bg-secondary/10"
// //                       : "text-sub hover:bg-secondary/10"
// //                   }`}
// //               >
// //                 {icon}
// //                 <span>{label}</span>
// //               </NavLink>
// //             ))}
// //           </div>

// //           {/* User Section */}
// //           {isLoggedin ? (
// //             <div className="flex items-center space-x-6">
// //               {/* Wallet Balance Display */}
// //               {walletConnected && (
// //                 <div className="flex items-center space-x-2 text-white">
// //                   <div className="flex flex-col items-end">
// //                     <span className="text-xs text-white/70">Cash</span>
// //                     <span className="font-medium text-green-400">
// //                       ${usdValue}
// //                     </span>
// //                   </div>
// //                   <ButtonOutline onClick={() => navigate("/deposit")}>
// //                     Deposit
// //                   </ButtonOutline>
// //                 </div>
// //               )}

// //               {/* Notifications */}
// //               <div className="relative">
// //                 <button
// //                   onClick={() => setNotificationsOpen(!notificationsOpen)}
// //                   className="text-2xl text-sub hover:text-secondary relative"
// //                 >
// //                   <FaBell />
// //                   {unreadCount > 0 && (
// //                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
// //                       {unreadCount}
// //                     </span>
// //                   )}
// //                 </button>

// //                 {notificationsOpen && (
// //                   <div className="absolute right-0 mt-2 w-72 bg-primary border border-secondary rounded-lg shadow-xl">
// //                     <div className="p-4 flex justify-between items-center border-b border-secondary">
// //                       <span className="font-bold">Notifications</span>
// //                       {notifications.length > 0 && (
// //                         <button
// //                           onClick={markAllAsRead}
// //                           className="text-xs text-secondary hover:underline"
// //                         >
// //                           Mark all as read
// //                         </button>
// //                       )}
// //                     </div>
// //                     <div className="max-h-60 overflow-y-auto">
// //                       {notifications.length > 0 ? (
// //                         notifications.map((n) => (
// //                           <div
// //                             key={n.id}
// //                             className={`p-4 flex items-center space-x-3 hover:bg-secondary/10 ${
// //                               !n.read ? "bg-secondary/5" : ""
// //                             }`}
// //                           >
// //                             {n.notificationImageURL && (
// //                               <img
// //                                 src={n.notificationImageURL}
// //                                 className="w-8 h-8 rounded-full"
// //                                 alt="Notification"
// //                               />
// //                             )}
// //                             <span>{n.message}</span>
// //                             {!n.read && (
// //                               <span className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></span>
// //                             )}
// //                           </div>
// //                         ))
// //                       ) : (
// //                         <div className="p-4 text-center text-sub">
// //                           No notifications
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* User Profile */}
// //               <div className="relative">
// //                 <button
// //                   onClick={() => setProfileOpen(!profileOpen)}
// //                   className="flex items-center space-x-3 group"
// //                 >
// //                   <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg">
// //                     {userData?.picture ? (
// //                       <img
// //                         key={picture}
// //                         src={picture}
// //                         alt="User profile"
// //                         className="w-full h-full object-cover rounded-full"
// //                       />
// //                     ) : userData?.fname ? (
// //                       userData.fname[0].toUpperCase()
// //                     ) : userData?.walletAddress ? (
// //                       <img
// //                         src={MetamaskLogo}
// //                         alt="MetaMask Logo"
// //                         className="w-3/4 h-3/4 object-contain rounded-full"
// //                       />
// //                     ) : (
// //                       ""
// //                     )}
// //                   </div>
// //                 </button>

// //                 {profileOpen && (
// //                   <div className="absolute right-0 mt-2 w-56 bg-primary border border-secondary rounded-lg shadow-xl">
// //                     <div className="p-4 border-b border-secondary">
// //                       <div className="font-bold">
// //                         {userData?.fname ||
// //                           (userData?.walletAddress ? "MetaMask User" : "User")}
// //                       </div>
// //                       <div className="text-sm text-sub">
// //                         {userData?.email ||
// //                           (userData?.walletAddress
// //                             ? userData.walletAddress.slice(0, 6) +
// //                               "..." +
// //                               userData.walletAddress.slice(-4)
// //                             : "")}
// //                       </div>
// //                     </div>

// //                     <div className="p-2 space-y-1">
// //                       <Link
// //                         to="/profile"
// //                         onClick={() => window.scrollTo(0, 0)}
// //                         className="block px-4 py-2 rounded hover:bg-secondary/10"
// //                       >
// //                         Profile
// //                       </Link>
// //                       <Link
// //                         to="/watchlist"
// //                         onClick={() => window.scrollTo(0, 0)}
// //                         className="block px-4 py-2 rounded hover:bg-secondary/10"
// //                       >
// //                         Watchlist
// //                       </Link>
// //                       <button
// //                         onClick={() => setIsDarkMode(!isDarkMode)}
// //                         className="w-full text-left px-4 py-2 rounded hover:bg-secondary/10"
// //                       >
// //                         {isDarkMode ? "Light" : "Dark"} Mode
// //                       </button>
// //                       <button
// //                         onClick={handleLogout}
// //                         className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500/10"
// //                       >
// //                         Logout
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="flex space-x-4">
// //               {/* Removed Connect Wallet here for not logged in state on desktop */}
// //               <ButtonOutline onClick={() => navigate("/login")}>
// //                 Login
// //               </ButtonOutline>
// //               <ButtonOutline onClick={() => navigate("/signup")}>
// //                 Sign Up
// //               </ButtonOutline>
// //             </div>
// //           )}
// //         </div>

// //         {/* Mobile Menu Trigger */}
// //         <div className="md:hidden">
// //           <button
// //             onClick={() => setMenuOpen(!menuOpen)}
// //             className="text-2xl text-sub"
// //           >
// //             <FaBars />
// //           </button>
// //         </div>
// //       </div>
// //       {/* Mobile Menu Content */}
// //       {menuOpen && (
// //         <div className="md:hidden absolute top-full w-full bg-primary border-t border-secondary">
// //           <div className="p-4 space-y-4">
// //             {/* Wallet Balance for Mobile - Conditionally render when logged in and wallet connected */}
// //             {isLoggedin && walletConnected && (
// //               <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
// //                 <div className="flex items-center space-x-2">
// //                   <FaWallet className="text-secondary" />
// //                   <div>
// //                     <div className="text-xs text-sub">Balance</div>
// //                     <div className="font-medium text-green-400">
// //                       ${usdValue}
// //                     </div>{" "}
// //                     {/* Amount in Green */}
// //                   </div>
// //                 </div>
// //                 <ButtonOutline
// //                   onClick={() => {
// //                     navigate("/deposit");
// //                     setMenuOpen(false);
// //                   }}
// //                   small
// //                 >
// //                   Deposit
// //                 </ButtonOutline>
// //               </div>
// //             )}

// //             {/* Conditionally render Connect Wallet in mobile menu when logged in but wallet not connected */}
// //             {isLoggedin && !walletConnected && (
// //               <ButtonOutline fullWidth onClick={connectWallet} className="mb-4">
// //                 Connect Wallet
// //               </ButtonOutline>
// //             )}

// //             {navLinks.map(({ to, label, icon }) => (
// //               <NavLink
// //                 key={to}
// //                 to={to}
// //                 className={({ isActive }) =>
// //                   `flex items-center space-x-2 p-3 rounded-lg
// //             ${isActive ? "bg-secondary/10 text-secondary" : "text-sub"}`
// //                 }
// //                 onClick={() => setMenuOpen(false)}
// //               >
// //                 {icon}
// //                 <span>{label}</span>
// //               </NavLink>
// //             ))}

// //             {isLoggedin ? (
// //               <div className="pt-4 border-t border-secondary">
// //                 {/* Conditionally render Deposit button when logged in but wallet not connected in mobile menu */}
// //                 {!walletConnected && (
// //                   <ButtonOutline
// //                     fullWidth
// //                     onClick={() => {
// //                       navigate("/deposit");
// //                       setMenuOpen(false);
// //                     }}
// //                   >
// //                     Deposit
// //                   </ButtonOutline>
// //                 )}
// //                 <button
// //                   onClick={handleLogout}
// //                   className="w-full p-3 text-left text-red-500 hover:bg-red-500/10 rounded-lg mt-3"
// //                 >
// //                   Logout
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="flex flex-col space-y-3 pt-4 border-t border-secondary">
// //                 <ButtonOutline
// //                   fullWidth
// //                   onClick={() => {
// //                     navigate("/login");
// //                     setMenuOpen(false);
// //                   }}
// //                 >
// //                   Login
// //                 </ButtonOutline>
// //                 <ButtonOutline
// //                   fullWidth
// //                   onClick={() => {
// //                     navigate("/signup");
// //                     setMenuOpen(false);
// //                   }}
// //                 >
// //                   Sign Up
// //                 </ButtonOutline>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import TeamLogo from '../../assets/team-logo.svg';
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useNavigate, NavLink, Link } from "react-router-dom";
// import { AppContext } from "@/context/AppContext";
// import { toast } from "react-toastify";
// import axios from "axios";
// import Web3 from "web3";
// import {Menu,Building2,Trophy,Calendar,BarChart3,Gift,Moon,MessageSquare,ChevronDown,Bell,User,Eye,LogOut,Wallet} from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// import logo from "../../assets/images/logo.png";
// import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg";

// // Define an interface for Notification object
// interface Notification {
//   id: string; // Added ID for tracking individual notifications
//   message: string;
//   notificationImageURL?: string;
//   read: boolean; // Added read status
//   timestamp: number; // Added timestamp for sorting
// }

// // Define the NavItem interface
// interface NavItem {
//   name: string;
//   href: string;
//   icon: React.ReactNode;
//   breakpoint: "always" | "xl" | "lg" | "md" | "sm";
// }

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
//     useContext(AppContext)!;

//   // UI State
//   const [isMounted, setIsMounted] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Data State
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [walletBalance, setWalletBalance] = useState("0.00");
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [ethPrice, setEthPrice] = useState(0);
//   const [picture, setPicture] = useState(userData?.picture || "");
//   const ws = useRef<WebSocket | null>(null);

//   // Mount effect
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Count unread notifications
//   const unreadCount = notifications.filter((n) => !n.read).length;

//   // Navigation links definition
//   const navItems = [
//     {
//       name: "HOME",
//       href: "/home",
//       icon: <Building2 className="h-4 w-4 mr-2" />,
//       breakpoint: "always",
//     },
//     {
//       name: "SPORTS",
//       href: "/sports",
//       icon: <Trophy className="h-4 w-4 mr-2" />,
//       breakpoint: "always",
//     },
//     {
//       name: "UPCOMING EVENTS",
//       href: "/upcoming",
//       icon: <Calendar className="h-4 w-4 mr-2" />,
//       breakpoint: "lg",
//     },
//     {
//       name: "RESULTS",
//       href: "/results",
//       icon: <BarChart3 className="h-4 w-4 mr-2" />,
//       breakpoint: "xl",
//     },
//     ...(isLoggedin
//       ? [{
//           name: "REWARDS",
//           href: "/reward",
//           icon: <Gift className="h-4 w-4 mr-2" />,
//            breakpoint: "xl",
//           // href: "/dashboard",
//           // icon: <BarChart3 className="h-4 w-4 mr-2" />,
//           // breakpoint: "xl"
//         }]
//       : []),
//   ] as NavItem[]; // Explicitly assert type here - although likely not needed for the fix

//   // Function to mark all notifications as read
//   const markAllAsRead = () => {
//     setNotifications((prevNotifications) =>
//       prevNotifications.map((notification) => ({
//         ...notification,
//         read: true,
//       }))
//     );
//   };

//   // Mark notifications as read when panel is opened
//   useEffect(() => {
//     if (notificationsOpen && unreadCount > 0) {
//       markAllAsRead();
//     }
//   }, [notificationsOpen]);

//   // WebSocket connection
//   useEffect(() => {
//     if (!isLoggedin) return;

//     const websocketUrl =
//       import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:5000";
//     ws.current = new WebSocket(websocketUrl);

//     ws.current.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);
//         if (message.type === "notification" || message.type === "newEvent") {
//           setNotifications((prev) => [
//             {
//               id: Date.now().toString(), // Generate unique ID
//               message: message.message || message.notificationMessage,
//               notificationImageURL: message.notificationImageURL,
//               read: false, // New notifications are unread
//               timestamp: Date.now(), // Add timestamp
//             },
//             ...prev,
//           ]);
//         }
//       } catch (error) {
//         console.error("WebSocket message error:", error);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("WebSocket disconnected");
//     };

//     ws.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     return () => {
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, [isLoggedin]);

//   // Check wallet connection and get balance
//   useEffect(() => {
//     const checkWalletConnection = async () => {
//       if (window.ethereum) {
//         try {
//           const web3 = new Web3(window.ethereum);
//           const accounts = await window.ethereum.request({
//             method: "eth_accounts",
//           });

//           if (accounts.length > 0) {
//             setWalletConnected(true);
//             const balanceWei = await web3.eth.getBalance(accounts[0]);
//             const balanceEth = web3.utils.fromWei(balanceWei, "ether");
//             setWalletBalance(parseFloat(balanceEth).toFixed(4));
//           } else {
//             setWalletConnected(false);
//             setWalletBalance("0.00");
//           }
//         } catch (error) {
//           console.error("Error checking wallet connection:", error);
//           setWalletConnected(false);
//         }
//       }
//     };

//     checkWalletConnection();

//     // Listen for account changes
//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", checkWalletConnection);
//     }

//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener(
//           "accountsChanged",
//           checkWalletConnection
//         );
//       }
//     };
//   }, []);

//   // Fetch ETH price from CoinGecko API
//   useEffect(() => {
//     const fetchEthPrice = async () => {
//       try {
//         const response = await fetch(
//           "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         if (data && data.ethereum) {
//           setEthPrice(data.ethereum.usd);
//         }
//       } catch (error) {
//         console.error("Error fetching ETH price:", error);
//       }
//     };

//     fetchEthPrice();
//     // Set up interval to refresh price every minute
//     const priceInterval = setInterval(fetchEthPrice, 60000);

//     // Clean up interval on component unmount
//     return () => clearInterval(priceInterval);
//   }, []);

//   // Calculate USD value
//   const usdValue = (parseFloat(walletBalance) * ethPrice).toFixed(2);

//   // Connect wallet function
//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         // Balance will be updated via the accountsChanged event listener
//       } catch (error) {
//         console.error("Error connecting to wallet:", error);
//         toast.error("Failed to connect wallet");
//       }
//     } else {
//       toast.error("MetaMask is not installed");
//     }
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/auth/logout`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );
//       if (data.success) {
//         setUserData(null);
//         setIsLoggedin(false);
//         navigate("/");
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Logout failed");
//     }
//   };

//   // Handle dark mode toggle
//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     // Here you would implement actual dark mode toggle functionality
//   };

//   // Set profile picture
//   useEffect(() => {
//     if (userData?.picture) {
//       setTimeout(() => {
//         setPicture(userData.picture);
//       }, 100); // Short delay to allow React to process updates
//     }
//   }, [userData]);

//   // Only render if mounted (for SSR compatibility)
//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <nav className="bg-[#1C1C27] text-white h-16 px-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
//       {/* Logo */}
//       <div className="flex items-center px-2">
//         <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
//           <span className="text-3xl  mr-3 font-saira-stencil">STAKEWISE</span>
//           <img
//             src={TeamLogo}
//             alt="Team Logo"
//             className="logo-icon w-[42px] h-[34px]"
//           />
//         </Link>
//       </div>

//       {/* Navigation Links - Visible based on breakpoints */}
//       <div className="hidden md:flex items-center space-x-8 ml-10 text-[13px] font-bold">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.href}
//             onClick={() => window.scrollTo(0, 0)}
//             className={({ isActive }) =>
//               `flex items-center ${isActive ? "text-[#E27625]" : "text-[#8488AC]"} hover:text-[#E27625] hover:border-b-[3px] hover:border-[#E27625] transition-color pb-2  ${
//                 item.breakpoint === "xl" ? "hidden xl:flex" : item.breakpoint === "lg" ? "hidden lg:flex" : ""
//               }`
//             }
//           >
//             {item.icon}
//             {item.name}
//           </NavLink>
//         ))}
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center space-x-6">
//         {/* Logged in state */}
//         {isLoggedin ? (
//           <>
//             {/* Cash Display */}
//             {walletConnected && (
//               <div className="hidden md:block text-right">
//                 <p className="text-[#00BD58] font-medium">${usdValue}</p>
//                 <p className="text-sm text-[#8488AC] text-center">Cash</p>
//               </div>
//             )}

//             {/* Deposit Button */}
//             <Button
//               className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white rounded-full px-[10px] py-[4px] min-h-0 h-auto text-sm"
//               onClick={() => navigate("/deposit")}
//             >
//               Deposit
//             </Button>

//             {/* Notification Bell */}
//             <div className="relative">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-[#ffffff] !w-8 !h-8 !p-2 hover:bg-gray-700 transition"
//               onClick={() => setNotificationsOpen(!notificationsOpen)}
//               >
//                 <Bell className="!w-6 !h-6" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-[#209de6] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {unreadCount}
//                     </span>
//                   )}
//               </Button>

//               {/* Notifications Panel */}
//               {notificationsOpen && (
//                 <div className="absolute right-0 mt-2 w-72 bg-[#1C1C27] border border-[#D4D8DD] rounded-lg shadow-xl">
//                   <div className="p-4 flex justify-between items-center border-b border-[#D4D8DD]">
//                     <span className="font-bold text-xl">Notifications</span>
//                     {notifications.length > 0 && (
//                       <button
//                         onClick={markAllAsRead}
//                         className="text-xs text-orange-500 hover:underline"
//                       >
//                         Mark all as read
//                       </button>
//                     )}
//                   </div>
//                   <div className="max-h-60 overflow-y-auto">
//                     {notifications.length > 0 ? (
//                       notifications.map((n) => (
//                         <div
//                           key={n.id}
//                           className={`p-4 flex items-center space-x-3 hover:bg-gray-800 ${
//                             !n.read ? "bg-gray-800/50" : ""
//                           }`}
//                         >
//                           {n.notificationImageURL && (
//                             <img
//                               src={n.notificationImageURL}
//                               className="w-8 h-8 rounded-full"
//                               alt="Notification"
//                             />
//                           )}
//                           <span>{n.message}</span>
//                           {!n.read && (
//                             <span className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></span>
//                           )}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-4 text-center text-gray-400">
//                         No notifications
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Separator */}
//             {/* <div className="hidden md:block h-8 w-px bg-gray-700"></div> */}

//             {/* User Profile Dropdown */}
//             <DropdownMenu onOpenChange={setIsProfileOpen}>
//               <DropdownMenuTrigger asChild>
//                 <button className="flex items-center space-x-1 rounded-full p-1 hover:bg-gray-700 transition">
//                   <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">
//                     {userData?.picture ? (
//                       <img
//                         key={picture}
//                         src={picture}
//                         alt="User profile"
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     ) : userData?.fname ? (
//                       <div className="w-full h-full rounded-full flex items-center justify-center bg-[#b4b11e] text-[#1a1a2e]">
//                         {userData.fname[0].toUpperCase()}
//                       </div>
//                     ) : userData?.walletAddress ? (
//                       <img
//                         src={MetamaskLogo}
//                         alt="MetaMask Logo"
//                         className="w-3/4 h-3/4 object-contain rounded-full"
//                       />
//                     ) : (
//                       <User className="h-4 w-4" />
//                     )}
//                   </div>
//                   <ChevronDown className={`h-6 w-6 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56 bg-[#1C1C27] text-white border-gray-700">
//                 {/* Navigation items that should be hidden based on screen size */}
//                 {navItems
//                   .filter((item) => item.breakpoint === "xl")
//                   .map((item) => (
//                     <DropdownMenuItem key={item.name} asChild className="hidden lg:flex xl:hidden">
//                       <Link to={item.href} className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
//                         {item.icon}
//                         {item.name}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}

//                 {navItems
//                   .filter((item) => item.breakpoint === "lg" || item.breakpoint === "xl")
//                   .map((item) => (
//                     <DropdownMenuItem key={item.name} asChild className="hidden md:flex lg:hidden">
//                       <Link to={item.href} className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
//                         {item.icon}
//                         {item.name}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}

//                 {/* All nav items on mobile */}
//                 {navItems.map((item) => (
//                   <DropdownMenuItem key={`mobile-${item.name}`} asChild className="md:hidden">
//                     <Link to={item.href} className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
//                       {item.icon}
//                       {item.name}
//                     </Link>
//                   </DropdownMenuItem>
//                 ))}

//                 {/* Mobile-only cash and deposit */}
//                 {isLoggedin && (
//                   <>
//                     <DropdownMenuSeparator className="md:hidden bg-gray-700" />
//                     {walletConnected && (
//                       <DropdownMenuItem className="flex flex-col items-start md:hidden">
//                         <p className="text-[#00BD58] font-medium">${usdValue}</p>
//                         <p className="text-xs text-[#8488AC]">Cash</p>
//                       </DropdownMenuItem>
//                     )}
//                     <DropdownMenuItem asChild className="md:hidden">
//                       <Button
//                         className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full mt-2"
//                         onClick={() => {
//                           navigate("/deposit");
//                           setIsProfileOpen(false);
//                         }}
//                       >
//                         Deposit
//                       </Button>
//                     </DropdownMenuItem>
//                   </>
//                 )}

//                 {/* Conditionally render Connect Wallet in profile dropdown when logged in but wallet not connected */}
//                 {isLoggedin && !walletConnected && (
//                   <DropdownMenuItem asChild>
//                     <Button
//                       className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full mt-2"
//                       onClick={connectWallet}
//                     >
//                       <Wallet className="h-4 w-4 mr-2" />
//                       Connect Wallet
//                     </Button>
//                   </DropdownMenuItem>
//                 )}

//                 {/* Standard user menu items with separator */}
//                 <DropdownMenuSeparator className="bg-[#8488AC]" />
//                 <DropdownMenuItem
//                   className="flex items-center cursor-pointer"
//                   onClick={() => {
//                     navigate("/profile");
//                     setIsProfileOpen(false);
//                   }}
//                 >
//                   <User className="h-4 w-4 mr-2" />
//                   Profile
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   className="flex items-center cursor-pointer"
//                   onClick={() => {
//                     navigate("/watchlist");
//                     setIsProfileOpen(false);
//                   }}
//                 >
//                   <Eye className="h-4 w-4 mr-2" />
//                   Watch List
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   className="flex items-center cursor-pointer"
//                   onClick={() => {
//                     navigate("/dashboard");
//                     setIsProfileOpen(false);
//                   }}
//                 >
//                   <BarChart3 className="h-4 w-4 mr-2" />
//                   Dashboard
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                   className="flex items-center cursor-pointer"
//                   onClick={() => toggleDarkMode()}
//                 >
//                   <Moon className="h-4 w-4 mr-2" />
//                   {isDarkMode ? "Light" : "Dark"} Mode
//                   <div className={`ml-auto w-8 h-4 rounded-full ${isDarkMode ? "bg-orange-500" : "bg-gray-600"} relative`}>
//                     <div
//                       className={`absolute top-0.5 ${isDarkMode ? "right-0.5" : "left-0.5"} w-3 h-3 bg-white rounded-full transition-all`}
//                     ></div>
//                   </div>
//                 </DropdownMenuItem>

//                 <DropdownMenuSeparator className="bg-[#8488AC]" />
//                 <DropdownMenuItem
//                   className="flex items-center cursor-pointer text-red-400"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="h-4 w-4 mr-2" />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </>
//         ) : (
//           <>
//             {/* Login Button */}
//             <Button
//               variant="ghost"
//               className="hidden md:flex text-orange-500 hover:text-orange-400"
//               onClick={() => navigate("/login")}
//             >
//               Login
//             </Button>

//             {/* Sign Up Button */}
//             <Button
//               className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white rounded-full"
//               onClick={() => navigate("/signup")}
//             >
//               Sign Up
//             </Button>

//             {/* Hamburger Menu Dropdown */}
//             <DropdownMenu onOpenChange={setIsMenuOpen}>
//               <DropdownMenuTrigger asChild>
//                 <button className="flex items-center justify-center rounded-full p-2 hover:bg-gray-700 transition">
//                   <Menu className="h-6 w-6" />
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56 bg-[#252538] text-white border-gray-700">
//                 {/* Navigation items that should be hidden based on screen size */}
//                 {navItems
//                   .filter((item) => item.breakpoint === "xl")
//                   .map((item) => (
//                     <DropdownMenuItem key={item.name} asChild className="hidden lg:flex xl:hidden">
//                       <Link to={item.href} className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
//                         {item.icon}
//                         {item.name}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}

//                 {navItems
//                   .filter((item) => item.breakpoint === "lg" || item.breakpoint === "xl")
//                   .map((item) => (
//                     <DropdownMenuItem key={item.name} asChild className="hidden md:flex lg:hidden">
//                       <Link to={item.href} className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
//                         {item.icon}
//                         {item.name}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}

//                 {/* All nav items on mobile */}
//                 {navItems.map((item) => (
//                   <DropdownMenuItem key={`mobile-${item.name}`} asChild className="md:hidden">
//                     <Link to={item.href} className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
//                       {item.icon}
//                       {item.name}
//                     </Link>
//                   </DropdownMenuItem>
//                 ))}

//                 {/* Mobile-only login and signup */}
//                 <DropdownMenuSeparator className="md:hidden bg-gray-700" />
//                 <DropdownMenuItem asChild className="md:hidden">
//                   <Button
//                     className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full mt-2 justify-center"
//                     onClick={() => {
//                       navigate("/signup");
//                       setIsMenuOpen(false);
//                     }}
//                   >
//                     Sign Up
//                   </Button>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild className="md:hidden">
//                   <Button
//                     className="w-full bg-transparent hover:bg-gray-700 text-orange-500 border border-orange-500 rounded-full mt-2 justify-center"
//                     onClick={() => {
//                       navigate("/login");
//                       setIsMenuOpen(false);
//                     }}
//                   >
//                     Login
//                   </Button>
//                 </DropdownMenuItem>

//                 {/* Contact Us and Dark Mode options */}
//                 <DropdownMenuSeparator className="bg-gray-700" />
//                 <DropdownMenuItem asChild>
//                   <Link to="/contact" className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
//                     <MessageSquare className="h-4 w-4 mr-2" />
//                     Contact Us
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={toggleDarkMode} className="flex items-center cursor-pointer">
//                   <Moon className="h-4 w-4 mr-2" />
//                   Dark Mode
//                   <div className={`ml-auto w-8 h-4 rounded-full ${isDarkMode ? "bg-orange-500" : "bg-gray-600"} relative`}>
//                     <div
//                       className={`absolute top-0.5 ${isDarkMode ? "right-0.5" : "left-0.5"} w-3 h-3 bg-white rounded-full transition-all`}
//                     ></div>
//                   </div>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
