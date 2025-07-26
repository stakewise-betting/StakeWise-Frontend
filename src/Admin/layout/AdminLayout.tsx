//StakeWise-Frontend/src/Admin/layout/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: (activeSection: string) => React.ReactNode; // Function to render content based on section
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState("dashboard"); // Default section
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [isMobile, setIsMobile] = useState(false); // Track if we're in mobile view

  // Check screen size and update mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
      // Auto-close sidebar on mobile when screen size changes
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close sidebar when a section is selected on mobile
  const handleSectionSelect = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-muted/40 relative">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1C1C27] text-dark-primary border border-gray-700/60 shadow-lg hover:bg-secondary/10 transition-colors duration-200 md:hidden"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed" : "relative"} 
          ${isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
          transition-transform duration-300 ease-in-out z-40
          ${isMobile ? "h-full" : "h-screen"}
        `}
      >
        <Sidebar
          activeSection={activeSection}
          onSelectSection={handleSectionSelect}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <main
        className={`
          flex-1 overflow-y-auto
          ${isMobile ? "p-4 pt-16" : "p-6 md:p-8"}
          ${isMobile && isSidebarOpen ? "pointer-events-none" : ""}
        `}
      >
        {/* Render the content based on the active section */}
        {children(activeSection)}
      </main>
    </div>
  );
};
