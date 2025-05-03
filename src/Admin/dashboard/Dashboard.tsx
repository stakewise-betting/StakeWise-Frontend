// src/components/admin/dashboard/Dashboard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  BarChart2,
  TrendingUp,
  Activity,
  Wallet,
  Download,
  Info,
} from "lucide-react";
import DownloadReport from "../reports/DownloadReport"; // Adjust path if needed

interface DashboardProps {
  adminProfit: string;
  adminAddress: string;
  totalEvents: number;
  ongoingEvents: number;
  totalBetsPlaced: number;
  totalUsers: number;
  loading: boolean;
}

// --- Skeleton Loader Component ---
const SkeletonCard: React.FC = () => (
  <div className="bg-card text-dark-primary rounded-xl shadow-lg border border-gray-700/60 p-4 animate-pulse space-y-4">
    {/* Header Placeholder */}
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-600/50 rounded w-1/3"></div>
      <div className="h-6 w-6 bg-gray-600/50 rounded-full"></div>
    </div>
    {/* Content Placeholder */}
    <div className="space-y-2">
      <div className="h-8 bg-gray-600/50 rounded w-1/2"></div>
      <div className="h-3 bg-gray-600/50 rounded w-3/4"></div>
    </div>
  </div>
);

const SkeletonDetailCard: React.FC = () => (
  <div className="bg-card text-dark-primary rounded-xl shadow-lg border border-gray-700/60 p-4 animate-pulse space-y-4">
    {/* Header Placeholder */}
    <div className="flex items-center gap-3 border-b border-gray-700/50 pb-3 mb-3">
      <div className="h-8 w-8 bg-gray-600/50 rounded-full"></div>
      <div className="h-5 bg-gray-600/50 rounded w-1/3"></div>
    </div>
    {/* Content Placeholder */}
    <div className="space-y-3">
      <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
      <div className="h-4 bg-gray-600/50 rounded w-1/2"></div>
      <div className="h-10 bg-gray-600/50 rounded w-full"></div>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  adminProfit,
  adminAddress,
  totalEvents,
  ongoingEvents,
  totalBetsPlaced,
  totalUsers,
  loading,
}) => {
  const displayValue = (value: string | number): string | number =>
    // Skeleton handled by conditional rendering, so just return value or empty
    loading ? "" : value;

  const displayAddress = (address: string): string => {
    if (loading) return "";
    if (!address || address === "...") return "..."; // Keep placeholder if address not loaded yet but component isn't in main loading state
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // --- Card Styling (No change needed here) ---
  const cardBaseClasses = `
        bg-card text-dark-primary rounded-xl shadow-lg
        border border-gray-700/60
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:border-secondary/50
        hover:-translate-y-1
        overflow-hidden relative // Removed fade-in animation, handled by loading state change
        bg-noise
        dark
    `;
  // Loading classes are now handled by rendering SkeletonCard

  // Helper for icon backgrounds (No change)
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

  // --- Revised Button Styling (Semi-Transparent Base, Fill on Hover) ---
  const baseButtonClasses = `
        inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
        text-sm font-semibold
        transition-all duration-300 ease-in-out relative overflow-hidden
        border  // Apply border class
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-secondary/80
     `;

  const enabledButtonClasses = `
        ${baseButtonClasses}
        bg-secondary/20  // Semi-transparent background (adjust opacity 0-100)
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

  // --- Main Component Render ---
  return (
    <div className="bg-primary min-h-screen p-4 sm:p-6 lg:p-8 text-dark-primary">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 sm:mb-8 text-dark-primary flex items-center gap-3">
        <IconWrapper className="bg-secondary/20">
          <Activity className="w-6 h-6 text-secondary" />
        </IconWrapper>
        Dashboard Overview
      </h2>

      {/* --- Summary Cards Grid --- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* Profit Card */}
            <Card className={cardBaseClasses}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-dark-secondary">
                  Total Admin Profit
                </CardTitle>
                <IconWrapper className="bg-admin-success/15">
                  <TrendingUp className="h-5 w-5 text-admin-success-light" />
                </IconWrapper>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl lg:text-3xl font-bold text-dark-primary">
                  {displayValue(adminProfit)} ETH
                </div>
                <p className="text-xs text-dark-secondary pt-1">
                  Accumulated 5% fee
                </p>
              </CardContent>
            </Card>

            {/* Events Card */}
            <Card className={cardBaseClasses}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-dark-secondary">
                  Active/Upcoming Events
                </CardTitle>
                <IconWrapper className="bg-admin-info/15">
                  <Activity className="h-5 w-5 text-admin-info" />
                </IconWrapper>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl lg:text-3xl font-bold text-dark-primary">
                  {displayValue(ongoingEvents)}
                </div>
                <p className="text-xs text-dark-secondary pt-1">
                  Out of {displayValue(totalEvents)} total events
                </p>
              </CardContent>
            </Card>

            {/* Bets Card */}
            <Card className={cardBaseClasses}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-dark-secondary">
                  Total Bets Placed
                </CardTitle>
                <IconWrapper className="bg-admin-accent/15">
                  <BarChart2 className="h-5 w-5 text-admin-accent" />
                </IconWrapper>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl lg:text-3xl font-bold text-dark-primary">
                  {displayValue(totalBetsPlaced)}
                </div>
                <p className="text-xs text-dark-secondary pt-1">
                  Across all events
                </p>
              </CardContent>
            </Card>

            {/* User Card */}
            <Card className={cardBaseClasses}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-dark-secondary">
                  Total Users
                </CardTitle>
                <IconWrapper className="bg-admin-secondary/15">
                  <Users className="h-5 w-5 text-admin-secondary" />
                </IconWrapper>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl lg:text-3xl font-bold text-dark-primary">
                  {displayValue(totalUsers)}
                </div>
                <p className="text-xs text-dark-secondary pt-1">Participants</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* --- Admin Details & Reports Grid --- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {loading ? (
          <>
            <SkeletonDetailCard />
            <SkeletonDetailCard />
          </>
        ) : (
          <>
            {/* Admin Details Card */}
            <Card className={cardBaseClasses}>
              <CardHeader className="px-4 pt-4 pb-3 border-b border-gray-700/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconWrapper className="bg-secondary/20">
                    <Wallet className="w-5 h-5 text-secondary" />
                  </IconWrapper>
                  <CardTitle className="text-lg font-semibold text-dark-primary">
                    Admin Details
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <CardDescription className="text-sm text-dark-secondary flex items-center gap-2">
                  <Info size={16} className="text-admin-info flex-shrink-0" />
                  Contract administrator wallet address.
                </CardDescription>
                <p className="text-sm font-medium text-dark-primary pt-2">
                  Wallet Address:
                </p>
                <div
                  className="text-sm text-dark-secondary font-mono break-all bg-black/20 p-3 rounded-md border border-gray-700/50 shadow-inner"
                  title={adminAddress} // Show full address on hover if not loading
                >
                  {displayAddress(adminAddress)}
                </div>
              </CardContent>
            </Card>

            {/* Reports Card - Styling confirmed & Button updated */}
            <Card className={cardBaseClasses}>
              <CardHeader className="px-4 pt-4 pb-3 border-b border-gray-700/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconWrapper className="bg-secondary/20">
                    <Download className="w-5 h-5 text-secondary" />
                  </IconWrapper>
                  <CardTitle className="text-lg font-semibold text-dark-primary">
                    Reports
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col justify-between min-h-[150px]">
                <CardDescription className="text-sm text-dark-secondary mb-4">
                  Download cumulative administrative reports.
                </CardDescription>
                {/* Inside the Reports Card -> CardContent */}
                <div className="mt-auto">
                  {/* Render DownloadReport directly, passing necessary props */}
                  {/* DownloadReport now handles its own button rendering and styling */}
                  <DownloadReport
                    adminProfit={adminProfit}
                    loading={loading} // Pass the loading state directly
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

// --- Mock/Placeholder DownloadReport component for demonstration ---
// Example using renderTrigger prop:
/*
const DownloadReport = ({ adminProfit, renderTrigger }) => {
    const handleDownload = () => {
        console.log("Downloading report for profit:", adminProfit);
        // Add actual download logic here (e.g., generate CSV/PDF)
        const csvData = `Admin Profit,${adminProfit}\nTotal Events,...\n...`; // Example data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "admin_report.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Use the render prop to render the button passed from the parent
    // The parent (Dashboard) now controls the button's appearance
    return renderTrigger(handleDownload);
};
*/

// --- Make sure DownloadReport is imported correctly ---
// import DownloadReport from '../reports/DownloadReport';
