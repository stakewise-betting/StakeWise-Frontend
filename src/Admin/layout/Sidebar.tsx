//StakeWise-Frontend/src/Admin/layout/Sidebar.tsx
import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CircleUserRound,
  Ticket,
  ImageIcon,
  Newspaper,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  isMobile?: boolean;
  isOpen?: boolean;
}

// Check the navItems array to ensure the slider item is correctly defined
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "raffles", label: "Raffles", icon: Ticket }, // New Raffles section
  { id: "users", label: "Users", icon: Users },
  { id: "profile", label: "Profile", icon: CircleUserRound },
  // { id: "settings", label: "Admin Details", icon: Settings },
  { id: "slider", label: "Slider", icon: ImageIcon },
  { id: "news", label: "News", icon: Newspaper },

  //{ id: "settings", label: "Admin Details", icon: Settings },
];

// Animated gradient logo text
const Logo = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 ${
      isMobile ? "justify-center sm:justify-start" : ""
    }`}
  >
    <div className="relative">
      <div className="p-2 rounded-xl bg-secondary/20 border border-gray-700/60 shadow-lg">
        <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
          <circle cx="17" cy="17" r="16" fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            fill="#fff"
            fontSize="16"
            fontFamily="Saira Stencil One, sans-serif"
            dy=".3em"
          >
            S
          </text>
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-admin-success rounded-full animate-pulse"></div>
    </div>
    <div className={`space-y-1 ${isMobile ? "hidden sm:block" : ""}`}>
      <h2 className="text-xl font-bold text-dark-primary">StakeWise</h2>
      <p className="text-xs text-dark-secondary font-medium">Admin Panel</p>
    </div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isMobile = false,
}) => {
  return (
    <aside
      className={`
        ${isMobile ? "w-64 sm:w-64" : "w-64"} 
        h-screen flex flex-col bg-[#1C1C27] text-dark-primary border-r border-gray-700/60 relative shadow-lg transition-all duration-300 ease-in-out
        ${isMobile ? "min-h-screen" : ""}
      `}
    >
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-700/60 bg-black/20 flex-shrink-0">
        <Logo isMobile={isMobile} />
      </div>

      {/* Navigation Section */}
      <div className="flex-1 p-3 overflow-y-auto min-h-0">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`group flex items-center w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden ${
                  isActive
                    ? "bg-secondary/20 text-dark-primary border border-secondary/50 shadow-lg"
                    : "text-dark-secondary hover:bg-secondary/10 hover:text-dark-primary hover:border hover:border-gray-700/60"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Icon container */}
                <div
                  className={`flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 flex-shrink-0 ${
                    isActive
                      ? "bg-secondary/20 text-secondary shadow-lg"
                      : "bg-black/20 text-dark-secondary group-hover:bg-secondary/10 group-hover:text-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </div>

                {/* Label */}
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isActive
                      ? "text-dark-primary"
                      : "text-dark-secondary group-hover:text-dark-primary"
                  } ${isMobile ? "hidden sm:inline" : ""}`}
                >
                  {item.label}
                </span>

                {/* Mobile-only label that shows on very small screens */}
                {isMobile && (
                  <span className="sm:hidden text-xs font-medium ml-1">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Footer - Optional */}
      {isMobile && (
        <div className="p-4 border-t border-gray-700/60 bg-black/20 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-dark-secondary">Tap outside to close</p>
          </div>
        </div>
      )}
    </aside>
  );
};
