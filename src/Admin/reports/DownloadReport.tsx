// components/admin/reports/DownloadReport.tsx
import React from "react";
import { Button } from "@/components/ui/button"; // Keep using shadcn Button if preferred, but we'll override styles
import { Download } from "lucide-react"; // Import icon

// --- Define Button Styles (Copied from Dashboard for consistency) ---
const baseButtonClasses = `
    inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
    text-sm font-semibold
    transition-all duration-300 ease-in-out relative overflow-hidden
    border  // Apply border class
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-secondary/80
`;

const enabledButtonClasses = `
    ${baseButtonClasses}
    bg-secondary/20  // Semi-transparent background
    border-secondary/60 // Visible border in base state
    text-secondary // Text color matches border in base state
    hover:bg-secondary // Solid background on hover
    hover:text-white // White text on hover for contrast
    hover:border-secondary // Keep border color consistent on hover
    hover:-translate-y-0.5 // Slight lift effect
    shadow-sm hover:shadow-md hover:shadow-secondary/30
`;

const loadingButtonClasses = `
    ${baseButtonClasses}
    bg-gray-600/50 text-gray-400 cursor-not-allowed
    border-gray-500/30 shadow-none
`;
// --- End Button Styles ---

interface DownloadReportProps {
  adminProfit?: string;
  loading?: boolean; // Add loading prop
}

const DownloadReport: React.FC<DownloadReportProps> = ({
  adminProfit = "0",
  loading = false, // Default loading to false
}) => {
  const handleDownloadReport = () => {
    // --- FIX: Use Vite's import.meta.env ---
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    console.log("Report Download - Using Backend URL:", backendUrl);
    // ----------------------------------------

    window.open(
      `${backendUrl}/api/report/pdf?adminProfit=${encodeURIComponent(
        adminProfit
      )}`,
      "_blank"
    );
  };

  // Render ONLY the button, applying the correct classes based on loading state
  return (
    <Button
      onClick={handleDownloadReport}
      // Apply classes directly, overriding shadcn variants
      className={loading ? loadingButtonClasses : enabledButtonClasses}
      disabled={loading}
    >
      <Download size={16} /> {loading ? "Generating..." : "Download Report"}
    </Button>
  );
};

export default DownloadReport;
