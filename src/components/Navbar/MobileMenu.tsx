import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { User, Wallet, LogOut, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext"; // Adjust path as needed

// Updated MobileMenuProps to accept NavItem[] for navLinks - Fixes error 06 from Navbar.tsx implicitly
interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
  navLinks: NavItem[]; // Now expects NavItem[]
  walletConnected: boolean;
  usdValue: string;
  connectWallet: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleVerification: () => Promise<void>;
}

// Define NavItem interface to match Navbar.tsx - Important for type consistency
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  breakpoint: "always" | "xl" | "lg" | "md" | "sm"; // Added breakpoint if needed in MobileMenu later
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  closeMenu,
  navLinks, // Now expecting NavItem[]
  walletConnected,
  usdValue,
  connectWallet,
  handleLogout,
  handleVerification,
}) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) return null;
  const { isLoggedin, userData } = context;

  if (!isOpen) {
    return null;
  }

  const onLinkClick = (action?: () => void) => {
    action?.();
    closeMenu();
    window.scrollTo(0, 0);
  };

  const onButtonClick = (action: () => Promise<void> | void) => {
    action();
  };

  return (
    <div className="lg:hidden absolute top-16 left-0 right-0 w-full bg-[#1C1C27] border-t border-[#252538] shadow-2xl shadow-black/50 z-40 backdrop-blur-sm">
      <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Navigation Links Section - Show for all users */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#8488AC] uppercase tracking-wider mb-3">
            Navigation
          </h3>
          {navLinks.map((item) => (
            <NavLink
              key={`mobile-${item.name}`}
              to={item.href}
              onClick={() => onLinkClick()}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 sm:p-4 rounded-xl transition-all duration-300 font-medium border ${
                  isActive
                    ? "text-secondary bg-secondary/20 border-secondary/30 shadow-lg"
                    : "text-[#8488AC] hover:text-secondary hover:bg-secondary/10 border-transparent hover:border-secondary/20 hover:shadow-md"
                }`
              }
            >
              <span className="text-secondary">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Wallet Section - Only for logged in users */}
        {isLoggedin && (
          <div className="border-t border-[#252538] pt-4">
            <h3 className="text-sm font-semibold text-[#8488AC] uppercase tracking-wider mb-3">
              Wallet
            </h3>
            {walletConnected ? (
              <div className="bg-[#252538] border border-gray-600/40 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                      <Wallet className="text-green-400 h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-[#8488AC] font-medium">
                        Balance
                      </div>
                      <div className="font-bold text-green-400 text-lg">
                        ${usdValue}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-sm text-secondary border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => onLinkClick(() => navigate("/deposit"))}
                  >
                    Deposit
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="bg-secondary hover:bg-secondary/80 text-white rounded-xl w-full font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => onButtonClick(connectWallet)}
              >
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        )}

        {/* User Profile Section - Only for logged in users */}
        {isLoggedin && userData ? (
          <div className="border-t border-[#252538] pt-4">
            <h3 className="text-sm font-semibold text-[#8488AC] uppercase tracking-wider mb-3">
              Account
            </h3>
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl text-[#8488AC] hover:text-secondary hover:bg-secondary/10 transition-all duration-300 border border-transparent hover:border-secondary/20 hover:shadow-md font-medium"
                onClick={() => onLinkClick()}
              >
                <User className="h-5 w-5 text-secondary" />
                <span>Profile Settings</span>
              </Link>
              <Link
                to="/watchlist"
                className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl text-[#8488AC] hover:text-secondary hover:bg-secondary/10 transition-all duration-300 border border-transparent hover:border-secondary/20 hover:shadow-md font-medium"
                onClick={() => onLinkClick()}
              >
                <Eye className="h-5 w-5 text-secondary" />
                <span>Watch List</span>
              </Link>

              {!userData.isAccountVerified && (
                <button
                  onClick={() => onButtonClick(handleVerification)}
                  className="flex items-center space-x-3 w-full p-3 sm:p-4 rounded-xl text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                >
                  <span className="text-yellow-500">⚠️</span>
                  <span>Verify Account</span>
                </button>
              )}
              {userData.isAccountVerified && (
                <div className="flex items-center space-x-3 w-full p-3 sm:p-4 rounded-xl text-green-500 bg-green-500/10 border border-green-500/30 font-semibold">
                  <span className="text-green-500">✅</span>
                  <span>Account Verified</span>
                </div>
              )}

              <button
                onClick={() => onButtonClick(handleLogout)}
                className="flex items-center space-x-3 w-full p-3 sm:p-4 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          /* Auth Section - Only for non-logged in users */
          <div className="border-t border-[#252538] pt-4">
            <h3 className="text-sm font-semibold text-[#8488AC] uppercase tracking-wider mb-3">
              Get Started
            </h3>
            <div className="space-y-3">
              <Button
                className="bg-secondary hover:bg-secondary/80 text-white rounded-xl w-full font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => onLinkClick(() => navigate("/login"))}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="rounded-xl text-secondary border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 w-full font-semibold py-3 transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => onLinkClick(() => navigate("/signup"))}
              >
                Sign Up
              </Button>

              {/* Contact Us for non-logged in users */}
              <Link
                to="/contactus"
                className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl text-[#8488AC] hover:text-secondary hover:bg-secondary/10 transition-all duration-300 border border-transparent hover:border-secondary/20 hover:shadow-md font-medium"
                onClick={() => onLinkClick()}
              >
                <MessageSquare className="h-5 w-5 text-secondary" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
