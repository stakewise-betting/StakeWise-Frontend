// components/admin/reports/DownloadReport.tsx
import React from "react";
import { Button } from "@/components/ui/button"; // Use shadcn Button

interface DownloadReportProps {
  adminProfit?: string;
}

const DownloadReport: React.FC<DownloadReportProps> = ({
  adminProfit = "0",
}) => {
  const handleDownloadReport = () => {
    // --- FIX: Use Vite's import.meta.env ---
    // Ensure VITE_BACKEND_URL is set in your .env file at the project root
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    // Log the URL being used for debugging (optional)
    console.log("Report Download - Using Backend URL:", backendUrl);
    // ----------------------------------------

    // Ensure your backend report service is running at the specified URL
    window.open(
      `${backendUrl}/api/report/pdf?adminProfit=${encodeURIComponent(
        adminProfit
      )}`,
      "_blank" // Opens the PDF in a new tab
    );
  };

  return (
    // Your existing JSX structure
    <div className="mt-8 p-6 bg-white shadow rounded-lg border">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Admin Reports
      </h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Generate a PDF report summarizing event statistics and profit
          information.
        </p>
      </div>
      <Button
        onClick={handleDownloadReport}
        variant="secondary" // Or choose another variant
      >
        Download Profit Report (PDF)
      </Button>
    </div>
  );
};

export default DownloadReport;
