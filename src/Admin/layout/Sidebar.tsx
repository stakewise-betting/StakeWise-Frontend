// components/admin/layout/Sidebar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CalendarDays, Settings } from "lucide-react"; // Icons

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: CalendarDays },
  // Add more sections here if needed
  // { id: "users", label: "User Management", icon: Users },
  // { id: "settings", label: "Admin Details", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  return (
    <aside className="w-64 bg-background border-r h-full flex flex-col p-4">
      <div className="mb-6">
        {/* You can add a logo or title here */}
        <h2 className="text-xl font-semibold px-2">Admin Panel</h2>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectSection(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      {/* Optional: Footer or user info at the bottom */}
      {/* <div className="mt-auto"> ... </div> */}
    </aside>
  );
};
