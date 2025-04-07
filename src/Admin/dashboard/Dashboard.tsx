// components/admin/dashboard/Dashboard.tsx
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
  ListChecks,
  Activity,
} from "lucide-react"; // Icons
import DownloadReport from "../reports/DownloadReport"; // Adjusted path

interface DashboardProps {
  adminProfit: string;
  adminAddress: string;
  totalEvents: number;
  ongoingEvents: number;
  totalBetsPlaced: number; // Placeholder - implement fetching logic
  totalUsers: number; // Placeholder - implement fetching logic
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  adminProfit,
  adminAddress,
  totalEvents,
  ongoingEvents,
  totalBetsPlaced, // Receive as prop
  totalUsers, // Receive as prop
  loading,
}) => {
  const displayValue = (value: string | number) =>
    loading ? "Loading..." : value;
  const displayAddress = (address: string) => {
    if (loading) return "Loading...";
    if (!address) return "N/A";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Admin Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayValue(`${adminProfit} ETH`)}
            </div>
            <p className="text-xs text-muted-foreground">Accumulated 5% fee</p>
          </CardContent>
        </Card>
        <Card>
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bets Placed
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Replace with actual data */}
            <div className="text-2xl font-bold">
              {displayValue(totalBetsPlaced)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all events (Hardcoded)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Replace with actual data */}
            <div className="text-2xl font-bold">{displayValue(totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              Participants (Hardcoded)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Other Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
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
              title={adminAddress}
            >
              {displayAddress(adminAddress)}
            </p>
            {/* Add more admin details if needed */}
          </CardContent>
        </Card>
        {/* Report Download Card */}
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Download administrative reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <DownloadReport adminProfit={adminProfit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
