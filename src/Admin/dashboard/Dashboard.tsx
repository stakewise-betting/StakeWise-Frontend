// src/components/admin/dashboard/Dashboard.tsx
import React from "react";
import Web3 from "web3"; // Import Web3
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Activity,
  Wallet,
  Download,
  Info,
  DollarSign,
} from "lucide-react";
import DownloadReport from "../reports/DownloadReport";
import RecentBetsTable, { RecentBet } from "./RecentBetsTable"; // Import the new component and type

interface DashboardProps {
  adminProfit: string;
  adminAddress: string;
  totalEvents: number;
  ongoingEvents: number;
  totalBetsPlaced: string; // Total value placed (ETH string)
  totalUsers: number;
  loading: boolean; // Loading for top cards/details
  // --- Add props for recent bets --- NEW ---
  recentBets: RecentBet[];
  loadingRecentBets: boolean;
  web3Instance: Web3 | null; // Receive web3 instance
}

// --- Skeleton Loaders --- (Keep existing SkeletonCard and SkeletonDetailCard)
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
  loading, // Loading for top cards
  recentBets, // Receive recent bets
  loadingRecentBets, // Receive loading state for bets
  web3Instance, // Receive web3
}) => {
  // --- Helper functions --- (Keep existing displayValue, displayAddress)
  const displayValue = (value: string | number): string | number =>
    loading ? "" : value;

  const displayAddress = (address: string): string => {
    if (loading) return "";
    if (!address || address === "...") return "...";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // --- Styling classes --- (Keep existing cardBaseClasses, IconWrapper, button classes)
  const cardBaseClasses = `
        bg-card text-dark-primary rounded-xl shadow-lg
        border border-gray-700/60
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:border-secondary/50
        hover:-translate-y-1
        overflow-hidden relative
        bg-noise
        dark
    `;

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

  // --- Main Component Render --- MODIFIED
  return (
    // Use min-h-screen and flex for layout if needed, or adjust container
    <div className="bg-primary p-4 sm:p-6 lg:p-8 text-dark-primary space-y-6 sm:space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
        <IconWrapper className="bg-secondary/20">
          <Activity className="w-6 h-6 text-secondary" />
        </IconWrapper>
        Dashboard Overview
      </h2>

      {/* --- Summary Cards Grid --- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard /> <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
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
            {/* Bets Value Card */}
            <Card className={cardBaseClasses}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-dark-secondary">
                  Total Value Placed
                </CardTitle>
                <IconWrapper className="bg-admin-accent/15">
                  <DollarSign className="h-5 w-5 text-admin-accent" />
                </IconWrapper>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl lg:text-3xl font-bold text-dark-primary">
                  {displayValue(totalBetsPlaced)} ETH
                </div>
                <p className="text-xs text-dark-secondary pt-1">
                  Across all events (in ETH)
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

      {/* --- Recent Bets Table --- NEW SECTION --- */}
      <div>
        {" "}
        {/* Add a div wrapper if needed for spacing */}
        <RecentBetsTable
          bets={recentBets}
          loading={loadingRecentBets}
          web3Instance={web3Instance}
        />
      </div>

      {/* --- Admin Details & Reports Grid --- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {loading ? (
          <>
            <SkeletonDetailCard /> <SkeletonDetailCard />
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
                  <Info size={16} className="text-admin-info flex-shrink-0" />{" "}
                  Contract administrator wallet address.
                </CardDescription>
                <p className="text-sm font-medium text-dark-primary pt-2">
                  Wallet Address:
                </p>
                <div
                  className="text-sm text-dark-secondary font-mono break-all bg-black/20 p-3 rounded-md border border-gray-700/50 shadow-inner"
                  title={adminAddress}
                >
                  {displayAddress(adminAddress)}
                </div>
              </CardContent>
            </Card>

            {/* Reports Card */}
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
                <div className="mt-auto">
                  <DownloadReport adminProfit={adminProfit} loading={loading} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
