import React, { useState } from "react";
import { Newspaper, ArrowLeft } from "lucide-react";
import { NewsForm } from "./NewsForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NewsListTable } from "./NewsListTable";

// --- Reusable Icon Wrapper ---
const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`p-2 rounded-full flex items-center justify-center ${className}`}
  >
    {children}
  </div>
);

// --- Main News Page Component ---
export const NewsPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");

  const renderContent = () => {
    if (currentView === "form") {
      return (
        <div>
          {/* Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("list")}
              className="text-dark-secondary hover:text-dark-primary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News List
            </Button>
          </div>

          {/* Form Content */}
          <NewsForm />
        </div>
      );
    }

    // Default list view
    return (
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-dark-primary flex items-center gap-3 whitespace-nowrap">
            <IconWrapper className="bg-secondary/20">
              <Newspaper className="w-6 h-6 text-secondary" />
            </IconWrapper>
            Manage News
          </h2>

          {/* Add Article Button */}
          <Button
            onClick={() => setCurrentView("form")}
            variant="outline"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-secondary/10
                       text-secondary
                       border-secondary/50
                       hover:bg-secondary/20
                       hover:border-secondary/70
                       hover:-translate-y-0.5
                       transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:shadow-secondary/20
                       focus:outline-none focus:ring-0 focus:ring-offset-0
                       w-full sm:w-auto
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add New Article</span>
          </Button>
        </div>

        {/* Content Area */}
        <div className="bg-card border border-gray-700/60 rounded-xl shadow-lg overflow-hidden">
          <NewsListTable />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-primary text-dark-primary">
      {/* Render main content based on current view */}
      {renderContent()}
    </div>
  );
};
