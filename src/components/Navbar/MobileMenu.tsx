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
  unreadCount: number;
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
  unreadCount,
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
    <div className="lg:hidden absolute top-16 left-0 right-0 w-full bg-[#1C1C27] border-t border-[#252538] shadow-lg z-40">
      <div className="p-4 space-y-3 flex flex-col">
        {/* Navigation Links Section - Show for all users */}
        <div className="space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={`mobile-${item.name}`}
              to={item.href}
              onClick={() => onLinkClick()}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 font-medium ${
                  isActive
                    ? "text-[#E27625] bg-[#252538]"
                    : "text-[#8488AC] hover:text-[#E27625] hover:bg-[#252538]"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Wallet Section - Only for logged in users */}
        {isLoggedin && (
          <div className="pt-3 border-t border-[#252538]">
            {walletConnected ? (
              <div className="flex justify-between items-center p-3 bg-[#252538] rounded-lg mb-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="text-green-400 h-4 w-4" />
                  <div>
                    <div className="text-xs text-[#8488AC]">Balance</div>
                    <div className="font-medium text-green-400">
                      ${usdValue}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-sm text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white min-h-0 h-auto"
                  onClick={() => onLinkClick(() => navigate("/deposit"))}
                >
                  Deposit
                </Button>
              </div>
            ) : (
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-full min-h-0 h-auto mb-2"
                onClick={() => onButtonClick(connectWallet)}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        )}

        {/* User Profile Section - Only for logged in users */}
        {isLoggedin && userData ? (
          <div className="pt-3 border-t border-[#252538] space-y-2">
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-3 rounded-lg text-[#8488AC] hover:text-[#E27625] hover:bg-[#252538]"
              onClick={() => onLinkClick()}
            >
              <User className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
            <Link
              to="/watchlist"
              className="flex items-center space-x-3 p-3 rounded-lg text-[#8488AC] hover:text-[#E27625] hover:bg-[#252538]"
              onClick={() => onLinkClick()}
            >
              <Eye className="h-4 w-4" />
              <span>Watch List</span>
            </Link>

            {!userData.isAccountVerified && (
              <button
                onClick={() => onButtonClick(handleVerification)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-yellow-400 hover:bg-yellow-900/30 transition-colors duration-150 font-medium"
              >
                <span>Verify Account</span>
              </button>
            )}
            {userData.isAccountVerified && (
              <div className="flex items-center space-x-3 w-full p-3 rounded-lg text-green-400">
                <span>Account Verified</span>
              </div>
            )}

            <button
              onClick={() => onButtonClick(handleLogout)}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors duration-150 font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          /* Auth Section - Only for non-logged in users */
          <div className="flex flex-col space-y-3 pt-3 border-t border-[#252538]">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-full min-h-0 h-auto"
              onClick={() => onLinkClick(() => navigate("/login"))}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white w-full min-h-0 h-auto"
              onClick={() => onLinkClick(() => navigate("/signup"))}
            >
              Sign Up
            </Button>

            {/* Contact Us for non-logged in users */}
            <Link
              to="/contactus"
              className="flex items-center space-x-3 p-3 rounded-lg text-[#8488AC] hover:text-[#E27625] hover:bg-[#252538]"
              onClick={() => onLinkClick()}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact Us</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
