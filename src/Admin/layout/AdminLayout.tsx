// components/admin/layout/AdminLayout.tsx
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
  children: (activeSection: string) => React.ReactNode; // Function to render content based on section
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState("dashboard"); // Default section

  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Render the content based on the active section */}
        {children(activeSection)}
      </main>
    </div>
  );
};
