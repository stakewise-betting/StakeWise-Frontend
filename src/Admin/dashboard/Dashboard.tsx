// src/components/admin/dashboard/Dashboard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming shadcn/ui path
import {
  Users,
  BarChart2,
  TrendingUp,
  ListChecks,
  Activity,
} from "lucide-react";
import DownloadReport from "../reports/DownloadReport"; // Adjust path

interface DashboardProps {
  adminProfit: string;
  adminAddress: string;
  totalEvents: number;
  ongoingEvents: number;
  totalBetsPlaced: number;
  totalUsers: number; // Already exists, ensure it's used
  loading: boolean; // Already exists, ensure it's used
}

export const Dashboard: React.FC<DashboardProps> = ({
  adminProfit,
  adminAddress,
  totalEvents,
  ongoingEvents,
  totalBetsPlaced,
  totalUsers, // Receive the actual user count
  loading,
}) => {
  // This helper already handles the loading state!
  const displayValue = (value: string | number) =>
    loading ? "Loading..." : value;

  const displayAddress = (address: string) => {
    if (loading) return "Loading...";
    if (!address || address === "...") return "Loading..."; // Handle placeholder
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Other Cards remain the same for now... */}
        <Card>
          {" "}
          {/* Profit Card */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Admin Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : `${displayValue(adminProfit)} ETH`}
            </div>
            <p className="text-xs text-muted-foreground">Accumulated 5% fee</p>
          </CardContent>
        </Card>
        <Card>
          {" "}
          {/* Events Card */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active/Upcoming Events
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayValue(ongoingEvents)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {displayValue(totalEvents)} total events
            </p>
          </CardContent>
        </Card>
        <Card>
          {" "}
          {/* Bets Card */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bets Placed
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayValue(totalBetsPlaced)}
            </div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        {/* --- USER CARD - Updated --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Use the displayValue helper which handles loading */}
            <div className="text-2xl font-bold">{displayValue(totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              Participants {/* Removed "(Hardcoded)" */}
            </p>
          </CardContent>
        </Card>
        {/* --- END USER CARD --- */}
      </div>

      {/* Other Sections - Use displayAddress helper */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          {" "}
          {/* Admin Details */}
          <CardHeader>
            <CardTitle>Admin Details</CardTitle>
            <CardDescription>
              Contract administrator information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium">Admin Wallet:</p>
            <p
              className="text-sm text-muted-foreground font-mono break-all"
              title={loading ? "" : adminAddress}
            >
              {displayAddress(adminAddress)}
            </p>
          </CardContent>
        </Card>
        <Card>
          {" "}
          {/* Reports */}
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Download administrative reports.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pass relevant props if DownloadReport needs them */}
            <DownloadReport adminProfit={loading ? "0" : adminProfit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
