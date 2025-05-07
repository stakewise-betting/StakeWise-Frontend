import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  CircleUserRound,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "users", label: "Users", icon: Users },
  { id: "profile", label: "Profile", icon: CircleUserRound },
  // { id: "settings", label: "Admin Details", icon: Settings },
];

// Icon background accent color
const iconBg = "bg-admin-accent/10 text-admin-accent";

// Animated gradient logo text
const Logo = () => (
  <div className="flex items-center gap-3 px-2">
    <span className="text-2xl">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <circle cx="17" cy="17" r="16" fill="#6d28d9" />
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          fill="#fff"
          fontSize="18"
          fontFamily="Saira Stencil One, sans-serif"
          dy=".3em"
        >
          S
        </text>
      </svg>
    </span>
    <h2 className="gradient-text font-saira-stencil text-2xl tracking-wide animate-appear">
      Admin Panel
    </h2>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  return (
    <aside className="w-64 h-full flex flex-col p-4 bg-primary border-r border-gray-700/60 text-dark-primary relative bg-noise bg-floating-shapes animate-admin-fade-in transition-all duration-300">
      {/* Logo/Header */}
      <div className="mb-10">{<Logo />}</div>

      {/* Nav */}
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={clsx(
                "group flex items-center w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none relative",
                // Orange hover and active states
                isActive
                  ? "bg-orange-500/20 text-orange-600 shadow-btn-glow scale-102"
                  : "text-dark-secondary hover:bg-orange-500/10 hover:text-orange-600"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={clsx(
                  "flex items-center justify-center mr-3 rounded-lg transition-all duration-200 h-9 w-9",
                  isActive
                    ? "bg-orange-500 text-white shadow-btn-glow"
                    : "bg-orange-500/10 text-orange-500 group-hover:bg-orange-600/20 group-hover:text-orange-600"
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span
                className={clsx(
                  "text-base transition-colors duration-200",
                  isActive ? "font-semibold" : "font-normal"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Optional: Sidebar Footer (e.g. settings) */}
      <div className="mt-auto pt-6">
        <button
          onClick={() => onSelectSection("settings")}
          className={clsx(
            "flex items-center w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none",
            "hover:bg-admin-secondary/10 hover:text-admin-secondary text-dark-secondary"
          )}
        >
          <span className="flex items-center justify-center mr-3 rounded-lg h-9 w-9 bg-admin-secondary/10 text-admin-secondary group-hover:bg-admin-secondary/20 group-hover:text-admin-secondary transition-all duration-200">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base">Admin Details</span>
        </button>
      </div>
    </aside>
  );
};
