// components/admin/layout/Sidebar.tsx
import React from "react";
// Removed Button import as we'll use a standard button/div with custom styles
import { LayoutDashboard, CalendarDays, Settings } from "lucide-react"; // Icons
import clsx from "clsx"; // Utility for conditional classes (install: npm i clsx or yarn add clsx)

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: CalendarDays },
  // Add more sections here if needed
  // { id: "users", label: "User Management", icon: Users },
  // { id: "settings", label: "Admin Details", icon: Settings }, // Example if you add it back
];

// Helper for Icon Backgrounds (Optional, but consistent with Dashboard)
const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`p-2 rounded-lg flex items-center justify-center ${className}`}
  >
    {children}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  // Base classes for all navigation links
  const baseLinkClasses = `
        flex items-center w-full px-3 py-2.5 rounded-lg // Padding and rounding
        text-sm font-medium // Text styling
        transition-all duration-200 ease-in-out // Smooth transitions
        cursor-pointer group // Indicate interactivity
    `;

  // Classes for INACTIVE navigation links
  const inactiveLinkClasses = `
        text-dark-secondary // Muted text color
        hover:text-dark-primary // Brighter text on hover
        hover:bg-card // Subtle background on hover
    `;

  // Classes for ACTIVE navigation links
  const activeLinkClasses = `
        bg-secondary/15 // Semi-transparent accent background
        text-secondary // Accent text color
        font-semibold // Slightly bolder text
    `;

  return (
    // Main sidebar container styling
    <aside className="w-64 bg-primary border-r border-gray-700/60 h-full flex flex-col p-4 text-dark-primary">
      {/* Sidebar Header/Title */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <IconWrapper className="bg-secondary/20">
          {/* You could use a specific logo icon here */}
          <Settings className="w-5 h-5 text-secondary" />
        </IconWrapper>
        <h2 className="text-xl font-bold text-dark-primary">Admin Panel</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button // Use button for accessibility and click handling
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              // Combine base, and conditionally active/inactive classes
              className={clsx(
                baseLinkClasses,
                isActive ? activeLinkClasses : inactiveLinkClasses
              )}
              aria-current={isActive ? "page" : undefined} // Accessibility for active page
            >
              <item.icon
                className={clsx(
                  "mr-3 h-5 w-5 flex-shrink-0" // Icon spacing and size
                  // Icon color matches text color automatically via inheritance,
                  // but explicitly setting ensures consistency:
                  // isActive ? 'text-secondary' : 'text-dark-secondary group-hover:text-dark-primary'
                )}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Optional: Footer */}
      {/* <div className="mt-auto border-t border-gray-700/60 pt-4 px-2">
                 <p className="text-xs text-dark-secondary">© 2024 StakeWise Admin</p>
             </div> */}
    </aside>
  );
};
